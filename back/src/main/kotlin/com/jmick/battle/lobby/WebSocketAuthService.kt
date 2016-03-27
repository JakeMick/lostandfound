package com.jmick.battle.lobby

import com.github.toastshaman.dropwizard.auth.jwt.JsonWebTokenParser
import com.github.toastshaman.dropwizard.auth.jwt.JsonWebTokenValidator
import com.github.toastshaman.dropwizard.auth.jwt.JsonWebTokenVerifier
import org.slf4j.LoggerFactory

class WebSocketAuthService(val jsonWebTokenParser: JsonWebTokenParser,
                           val jsonWebTokenVerifier: JsonWebTokenVerifier,
                           val jsonWebTokenValidator: JsonWebTokenValidator) {
    val logger = LoggerFactory.getLogger(WebSocketAuthService::class.java)

    fun authenticateSession(session: LobbySession, jwt: String) {
        val parsed = jsonWebTokenParser.parse(jwt)
        jsonWebTokenVerifier.verifySignature(parsed)
        jsonWebTokenValidator.validate(parsed)
        session.verified = Verified(parsed.claim().getParameter(username) as String)
    }
    companion object {
        @JvmStatic
        val username = "username"
    }

}