package com.jmick.battle.ws

import com.google.common.collect.Sets
import com.jmick.battle.ws.command.ChatService
import com.jmick.battle.ws.command.CommandParser
import com.jmick.battle.ws.session.WSHandle
import com.jmick.battle.ws.session.WSSession
import org.slf4j.LoggerFactory
import java.io.IOException
import java.nio.ByteBuffer
import java.util.concurrent.ScheduledExecutorService
import java.util.concurrent.ScheduledThreadPoolExecutor
import java.util.concurrent.TimeUnit
import javax.websocket.CloseReason

class WSManager(val commandHandler: CommandParser,
                val chatService: ChatService) : WSHandle<WSSession> {
    val logger = LoggerFactory.getLogger(WSSession::class.java)
    val sessions = Sets.newConcurrentHashSet<WSSession>()
    val ses = getSES()
    val ping = ByteBuffer.wrap("ping".toByteArray("UTF-8"))

    private fun getSES(): ScheduledExecutorService {
        val ses = ScheduledThreadPoolExecutor(3)
        ses.scheduleWithFixedDelay({
            try {
                if (chatService.multicast.isEmpty()) {
                    return@scheduleWithFixedDelay
                }
                while (!chatService.multicast.isEmpty()) {
                    val nextMesg = chatService.multicast.pop();
                    for (session in sessions) {
                        session.sendMessage(nextMesg)
                    }
                }
            } catch (e: Exception) {
                logger.error("Message sending failed for reason ", e)
            }
        }, 10, 33, TimeUnit.MILLISECONDS)

        ses.scheduleWithFixedDelay({
            try {
                for (session in sessions) {
                    try {
                        session.session?.asyncRemote?.sendPong(ping)
                    } catch (e: IOException) {
                        sessions.remove(session)
                    }
                }
            } catch (e: Exception) {
                logger.error("Pong hard failed", e)
            }
        }, 10, 10, TimeUnit.SECONDS)

        ses.scheduleWithFixedDelay({
            if (chatService.deauth.isEmpty()) {
                return@scheduleWithFixedDelay
            }
            try {
                val deauthRequest = chatService.deauth.take()
                logger.info("Deauthenticating user")
                deauthRequest.session?.close()
                sessions.remove(deauthRequest.session)
            } catch (e: Exception) {
                logger.warn("Deauth request failed", e)
            }
        }, 10, 1, TimeUnit.SECONDS);
        return ses
    }

    override final fun addSession(session: WSSession) {
        sessions.add(session)
    }

    override final fun removeSession(session: WSSession, closeReason: CloseReason) {
        sessions.remove(session)
    }

    override final fun onMessage(session: WSSession, message: String?) {
        if (message != null) {
            commandHandler.parse(session, message)
            logger.info(message)
        } else {
            logger.warn("Null message from ", session.verified, message)
        }
    }

}

