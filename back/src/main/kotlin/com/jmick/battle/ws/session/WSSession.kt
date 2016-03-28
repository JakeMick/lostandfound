package com.jmick.battle.ws.session

import com.codahale.metrics.annotation.ExceptionMetered
import com.codahale.metrics.annotation.Metered
import com.codahale.metrics.annotation.Timed
import org.slf4j.LoggerFactory
import javax.websocket.*
import javax.websocket.server.ServerEndpoint


data class Verified(val username: String,
                    val nuclear: Boolean,
                    val post: Boolean,
                    val verified: Boolean = true) {
}

@Metered
@Timed
@ExceptionMetered
@ServerEndpoint("/lobby")
class WSSession {
    companion object {
        @JvmStatic
        val logger = LoggerFactory.getLogger(WSSession::class.java)

    }

    var verified: Verified? = null

    var session: Session? = null;

    @OnMessage
    fun onMessage(session: Session, message: String?) {
        logger.info("message", session, message)
        WSDelegate.handleMessage(this, message)
    }

    @OnOpen
    fun onOpen(session: Session, config: EndpointConfig) {
        logger.info("open", session, config)
        this.session = session
        WSDelegate.addSession(this)
    }

    @OnClose
    fun onClose(session: Session, closeReason: CloseReason) {
        logger.info("close", session, closeReason)
        WSDelegate.removeSession(this, closeReason)
    }

    fun sendMessage(message: String) {
        session?.asyncRemote?.sendText(message)
    }

    override fun equals(other: Any?): Boolean{
        if (this === other) return true
        if (other?.javaClass != javaClass) return false

        other as WSSession
        if (session?.id != other.session?.id) return false

        return true
    }

    override fun hashCode(): Int{
        var result = session?.id?.hashCode() ?: 0
        return result
    }

}
