package com.jmick.battle.ws.session

import javax.websocket.CloseReason

object WSDelegate {

    var WS: WSHandle<WSSession>? = null;


    fun addSession(session: WSSession) {
        WS?.addSession(session)
    }

    fun removeSession(session: WSSession, closeReason: CloseReason) {
        WS?.removeSession(session, closeReason)
    }

    fun handleMessage(session: WSSession, message: String?) {
        WS?.onMessage(session, message)
    }
}