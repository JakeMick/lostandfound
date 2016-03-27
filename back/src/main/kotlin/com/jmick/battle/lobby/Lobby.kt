package com.jmick.battle.lobby

import com.google.common.collect.Sets
import org.slf4j.LoggerFactory
import javax.websocket.CloseReason

class Lobby(val webSocketCommandHandler: WebSocketCommandParser) : WebSocketHandle<LobbySession> {
    val logger = LoggerFactory.getLogger(LobbySession::class.java)
    val sessions = Sets.newConcurrentHashSet<LobbySession>()

    override fun addSession(session: LobbySession) {
        sessions.add(session)
    }

    override fun removeSession(session: LobbySession, closeReason: CloseReason) {
        sessions.remove(session)
    }

    override fun onMessage(session: LobbySession, message: String?) {
        webSocketCommandHandler.parse(session, message)
        logger.info(message)
    }

}

