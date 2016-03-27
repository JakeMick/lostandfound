package com.jmick.battle.lobby

import javax.websocket.CloseReason

interface WebSocketHandle<T> {
    open fun removeSession(session: T, closeReason: CloseReason)
    open fun addSession(session: T)
    open fun onMessage(session: T, message: String?)
}