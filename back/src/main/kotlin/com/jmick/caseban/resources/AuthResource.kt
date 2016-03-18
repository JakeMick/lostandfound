package com.jmick.caseban.resources;

import com.github.toastshaman.dropwizard.auth.jwt.hmac.HmacSHA512Signer
import com.github.toastshaman.dropwizard.auth.jwt.model.JsonWebToken
import com.github.toastshaman.dropwizard.auth.jwt.model.JsonWebTokenClaim
import com.github.toastshaman.dropwizard.auth.jwt.model.JsonWebTokenHeader
import com.jmick.caseban.auth.MyUser
import com.jmick.caseban.dao.UserDAO
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
@Produces(MediaType.APPLICATION_JSON)
class AuthResource(val userDao: UserDAO,
                   val jwtTokenSecret: ByteArray,
                   val expirationSeconds: Int) {

    val UTF8 = Charset.forName("UTF-8")

    val lolString = "lol"
    val lolHash: ByteArray = hashPass("lol").toByteArray(UTF8);

    private fun hashPass(pass: String): String {
        return BCrypt.hashpw(pass, BCrypt.gensalt(12))
    }

    private fun compare(pass: String, hash: ByteArray) : Boolean {
        return BCrypt.checkpw(pass, String(hash, UTF8))
    }

    @PUT
    @Path("/tracker")
    fun generateTracker(@Valid @QueryParam("email") email: String) : Response {
        try {
            val res = userDao.trackerByEmail(email);
            userDao.generateTracker(email)
            return Response.status(Response.Status.ACCEPTED).build()
        } catch (e: UnableToExecuteStatementException) {
            return Response.status(Response.Status.CONFLICT).build()
        }
    }

    @POST
    @Path("/token")
    fun generateValidToken(@Valid @QueryParam("email") email: String,
                           @Valid @QueryParam("pass") password: String): Response {
        val user = userDao.userByEmail(email)

        if (user == null) {
            // mitigate side-channel attacks
            compare(lolString, lolHash)
            return Response.status(Response.Status.UNAUTHORIZED).build()
        } else {
            if (!compare(password, user.hash)) {
                return Response.status(Response.Status.UNAUTHORIZED).build()
            }
        }

        val signer = HmacSHA512Signer(jwtTokenSecret);
        val token = JsonWebToken.builder()
                .header(JsonWebTokenHeader.HS512())
                .claim(JsonWebTokenClaim.builder()
                        .subject(user.userid.toString())
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
                .status(Response.Status.OK)
                .type(MediaType.APPLICATION_JSON)
                .cookie(cookies)
                .build()
    }

    @GET
    @Path("/check-token")
    fun get(@Auth user: Principal): Map<String, Any> {
        return mapOf("username" to user.getName(), "id" to ((user as MyUser).id));
    }

}