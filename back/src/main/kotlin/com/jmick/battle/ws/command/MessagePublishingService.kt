package com.jmick.battle.ws.command

import com.jmick.battle.ws.session.WSSession
import org.slf4j.LoggerFactory
import java.util.concurrent.LinkedBlockingDeque
import java.util.concurrent.atomic.AtomicInteger

class MessagePublishingService : CommandService {
    val multicast = LinkedBlockingDeque<String>(100)
    val deauth = LinkedBlockingDeque<WSSession>(100)
    var AI = AtomicInteger(0)
    val logger = LoggerFactory.getLogger(MessagePublishingService::class.java)

    override fun command() : Command {
        return Command.MESG
    }

    override fun service(session: WSSession, message: String) {
        if (session.verified != null) {
            val verified = session.verified
            if (verified.verified
                   && verified.post) {
                val cmd = WSCommand(Command.MESG)
                        .addElem(AI.andIncrement.toString())
                        .addElemBase64(verified.username)
                        .addElemBase64(message)
                multicast.add(cmd.build())
            }
        } else {
            logger.warn("Unauthorized user tried to send a message", session)
            deauth.add(session)
        }
    }

}