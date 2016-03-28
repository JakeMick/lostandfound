package com.jmick.battle.ws.command

import com.jmick.battle.ws.session.WSSession
import org.slf4j.LoggerFactory
import java.util.*

class CommandParser {
    val logger = LoggerFactory.getLogger(CommandParser::class.java)
    var commandLookup = ArrayList<CommandService>(Command.values.size)

    constructor(vararg commandServices : CommandService) {
        for (commandService in commandServices) {
            val commandOrd = commandService.command().ordinal
            commandLookup.add(commandOrd, commandService)
        }
    }

    fun parse(session: WSSession, message: String) {
        val messageHeader = message.split(':', limit=2).orEmpty()
        val commandId = Integer.valueOf(messageHeader.first())

        if (commandId < commandLookup.size && messageHeader.size == 2) {
            val commandService = commandLookup[commandId]
            commandService.service(session, messageHeader[1])
        } else {
            logger.warn("Invalid message request from ", session.verified, message)
        }
    }

}



