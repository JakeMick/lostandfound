package com.jmick.battle.ws.command

import com.github.toastshaman.dropwizard.auth.jwt.JsonWebTokenParser
import com.github.toastshaman.dropwizard.auth.jwt.JsonWebTokenValidator
import com.github.toastshaman.dropwizard.auth.jwt.JsonWebTokenVerifier
import com.jmick.battle.auth.JWTACL
import com.jmick.battle.ws.session.Verified
import com.jmick.battle.ws.session.WSSession

class WSAuthService(val jsonWebTokenParser: JsonWebTokenParser,
                    val jsonWebTokenVerifier: JsonWebTokenVerifier,
                    val jsonWebTokenValidator: JsonWebTokenValidator,
                    val chatService: ChatService) : CommandService {

    override fun command(): Command {
        return Command.AUTH
    }

    override fun service(session: WSSession, message: String) {
        val parsed = jsonWebTokenParser.parse(message)
        jsonWebTokenVerifier.verifySignature(parsed)
        jsonWebTokenValidator.validate(parsed)
        val claim = parsed.claim()
        session.verified = Verified(claim.getParameter(JWTACL.user) as String,
                claim.getParameter(JWTACL.nuclear) as Boolean,
                claim.getParameter(JWTACL.post) as Boolean)
        chatService.addUser(session)
    }

}