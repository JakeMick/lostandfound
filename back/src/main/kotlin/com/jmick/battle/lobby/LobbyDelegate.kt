package com.jmick.battle.lobby

import javax.websocket.CloseReason

object LobbyDelegate {

    var lobby: WebSocketHandle<LobbySession>? = null;


    fun addSession(session: LobbySession) {
        lobby?.addSession(session)
    }

    fun removeSession(session: LobbySession, closeReason: CloseReason) {
        lobby?.removeSession(session, closeReason)
    }

    fun handleMessage(session: LobbySession, message: String?) {
        lobby?.onMessage(session, message)
    }
}