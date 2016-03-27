package com.jmick.battle.lobby

import com.codahale.metrics.annotation.ExceptionMetered
import com.codahale.metrics.annotation.Metered
import com.codahale.metrics.annotation.Timed
import javax.websocket.*
import javax.websocket.server.ServerEndpoint


@Metered
@Timed
@ExceptionMetered
@ServerEndpoint("/lobby")
class LobbySession {
    var verified : Verified? = null

    private var session: Session? = null;

    @OnMessage
    fun onMessage(session: Session, message: String?) {
        LobbyDelegate.handleMessage(this, message)
    }

    @OnOpen
    fun onOpen(session: Session) {
        this.session = session
        LobbyDelegate.addSession(this)
    }

    @OnClose
    fun onClose(session: Session, closeReason: CloseReason) {
        LobbyDelegate.removeSession(this, closeReason)
    }

    override fun equals(other: Any?): Boolean{
        if (this === other) return true
        if (other?.javaClass != javaClass) return false

        other as LobbySession

        if (session != other.session) return false

        return true
    }

    override fun hashCode(): Int{
        return session?.hashCode() ?: 0
    }
}

class Verified(username: String) {

}
