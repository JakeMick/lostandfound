package com.jmick.battle.resources;

import com.github.toastshaman.dropwizard.auth.jwt.hmac.HmacSHA512Signer
import com.github.toastshaman.dropwizard.auth.jwt.model.JsonWebToken
import com.github.toastshaman.dropwizard.auth.jwt.model.JsonWebTokenClaim
import com.github.toastshaman.dropwizard.auth.jwt.model.JsonWebTokenHeader
import com.jmick.battle.auth.MyUser
import com.jmick.battle.core.Credential
import com.jmick.battle.core.User
import com.jmick.battle.dao.UserDAO
import com.jmick.battle.service.OutboundEmailService
import com.sendgrid.SendGrid
import io.dropwizard.auth.Auth
import org.joda.time.DateTime
import org.mindrot.jbcrypt.BCrypt
import org.skife.jdbi.v2.exceptions.UnableToExecuteStatementException
import java.nio.charset.Charset
import java.security.Principal
import javax.validation.Valid
import javax.ws.rs.*
import javax.ws.rs.core.Cookie
import javax.ws.rs.core.MediaType
import javax.ws.rs.core.NewCookie
import javax.ws.rs.core.Response


@Path("/auth")
class AuthResource(val userDao: UserDAO,
                   val outboundEmailService: OutboundEmailService,
                   val jwtTokenSecret: ByteArray,
                   val expirationSeconds: Int,
                   val baseUrl: String) {

    val UTF8 = Charset.forName("UTF-8")

    val lolString = "lol"
    val lolHash: ByteArray = hashPass("lol").toByteArray(UTF8);

    private fun hashPass(pass: String): String {
        return BCrypt.hashpw(pass, BCrypt.gensalt(12))
    }

    private fun compare(pass: String, hash: ByteArray): Boolean {
        return BCrypt.checkpw(pass, String(hash, UTF8))
    }

    @POST
    @Path("/user")
    @Produces(MediaType.APPLICATION_JSON)
    @Consumes(MediaType.APPLICATION_JSON)
    fun createUser(@Valid user: User): Response {
        val tracker = userDao.trackerByEmail(user.email)
        val userDTO = userDao.userByEmail(user.email)
        if (tracker == null || userDTO != null || !tracker.equals(user.tracker)) {
            return Response
                .status(Response.Status.EXPECTATION_FAILED)
                .build()
        }
        try {
            userDao.insertUser(user.username,
                    user.email,
                    hashPass(user.password).toByteArray(UTF8))
        } catch (e: UnableToExecuteStatementException) {
            // technically the generate tracker statement has a small race condition depending on the isolation level
            // we catch it here so it matches the contract of error codes above
            return Response
                    .status(Response.Status.INTERNAL_SERVER_ERROR)
                    .build()
        }
        return Response
                .accepted(mapOf("user" to user.username))
                .build()

    }

    @POST
    @Path("/tracker")
    fun generateTracker(@Valid @QueryParam("email") email: String?): Response {
        if (email == null) {
            return Response
                    .status(Response.Status.BAD_REQUEST)
                    .build()
        }
        try {
            if (userDao.userByEmail(email) != null) {
                return Response
                    .status(Response.Status.CONFLICT)
                    .build()
            }
            val res = userDao.generateTracker(email) ?: return Response
                    .status(Response.Status.CONFLICT)
                    .build()
            sendTrackerEmail(email, res)
            return Response.accepted(mapOf("email" to email)).build()
        } catch (e: UnableToExecuteStatementException) {
            // technically the generate tracker statement has a small race condition depending on the isolation level
            // we catch it here so it matches the contract of error codes above
            return Response
                    .status(Response.Status.INTERNAL_SERVER_ERROR)
                    .build()
        }
    }

    val noReply = "no-reply@$baseUrl"
    val qualifiedRespondUrl = "http://$baseUrl/respond"

    private fun sendTrackerEmail(emailAddy: String, trackerUUID: String) {
        var email = SendGrid.Email()
        email.setFrom(noReply)
        email.setReplyTo(noReply)
        email.setTo(arrayOf(emailAddy))
        email.setSubject("dank memes")
        email.setText("Verify email address: $qualifiedRespondUrl/$trackerUUID")
        outboundEmailService.send(email)
    }

    @POST
    @Path("/token")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.TEXT_PLAIN)
    fun generateValidToken(
            @Valid credential: Credential): Response {
        val user = userDao.userByEmail(credential.email)

        if (user == null) {
            // mitigate side-channel attacks
            compare(lolString, lolHash)
            return Response.status(Response.Status.UNAUTHORIZED).build()
        } else {
            if (!compare(credential.password, user.hash)) {
                return Response.status(Response.Status.UNAUTHORIZED).build()
            }
        }

        val signer = HmacSHA512Signer(jwtTokenSecret);
        val token = JsonWebToken.builder()
                .header(JsonWebTokenHeader.HS512())
                .claim(JsonWebTokenClaim.builder()
                        .subject(user.userid.toString())
                        .param("hasNuclearPermissions", false)
                        .param("username", user.username)
                        .issuedAt(DateTime.now())
                        .expiration(DateTime.now().plusSeconds(expirationSeconds))
                        .build())
                .build();
        val signedToken = signer.sign(token)
        val cookie = Cookie("token", signedToken)
        val cookies = NewCookie(cookie,
                null,
                expirationSeconds,
                DateTime().plusSeconds(expirationSeconds).toDate(),
                false,
                false)
        return Response
                .ok(signedToken, MediaType.TEXT_PLAIN)
                .cookie(cookies)
                .build()
    }

    @GET
    @Path("/check-token")
    fun get(@Auth user: Principal): Map<String, Any> {
        return mapOf("username" to user.getName(), "id" to ((user as MyUser).id));
    }

}
