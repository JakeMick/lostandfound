package com.jmick.battle.lobby

import org.slf4j.LoggerFactory

class WebSocketCommandParser(val webSocketAuthService: WebSocketAuthService) {
    val logger = LoggerFactory.getLogger(WebSocketCommandParser::class.java)


    fun parse(session: LobbySession, message: String?) {
        val command = message?.split(colon, 'v', limit=2).orEmpty()
        if (command.isEmpty()) {
            return
        }
        when (command.first()) {
            AUTH -> webSocketAuthService.authenticateSession(session, command.last())
            else -> {
                logger.warn("Command unknown", message)
            }
        }
    }
    companion object {
        @JvmStatic
        val AUTH = "AUTH"

        @JvmStatic
        val colon = ':'
    }
}