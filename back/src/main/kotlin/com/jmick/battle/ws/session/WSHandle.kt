package com.jmick.battle.ws.session

import javax.websocket.CloseReason

interface WSHandle<T> {
    open fun removeSession(session: T, closeReason: CloseReason)
    open fun addSession(session: T)
    open fun onMessage(session: T, message: String?)
}