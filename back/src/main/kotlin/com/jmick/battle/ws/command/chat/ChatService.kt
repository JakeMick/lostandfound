package com.jmick.battle.ws.command.chat

import com.jmick.battle.ws.command.Command
import com.jmick.battle.ws.command.CommandService
import com.jmick.battle.ws.command.UserService
import com.jmick.battle.ws.command.WSCommand
import com.jmick.battle.ws.session.WSSession
import org.apache.kafka.clients.consumer.KafkaConsumer
import org.apache.kafka.clients.producer.KafkaProducer
import org.apache.kafka.clients.producer.ProducerRecord
import org.slf4j.LoggerFactory
import java.util.*
import java.util.concurrent.LinkedBlockingDeque
import java.util.concurrent.ScheduledThreadPoolExecutor
import java.util.concurrent.TimeUnit

class ChatService(val kafkaConsumer: KafkaConsumer<String, String>,
                  val kafkaProducer: KafkaProducer<String, String>,
                  val chatDAO: ChatDAO) : CommandService, UserService {
    val multicast = LinkedBlockingDeque<String>(10000)
    val deauth = LinkedBlockingDeque<WSSession>(10000)
    val logger = LoggerFactory.getLogger(ChatService::class.java)
    val ses = ScheduledThreadPoolExecutor(1)

    init {
        kafkaConsumer.subscribe(Arrays.asList(Command.MESG.name))
        ses.scheduleWithFixedDelay({
            try {
                val records = kafkaConsumer.poll(Long.MAX_VALUE)
                for (record in records) {
                    val enrichedRecord = enrich(record.offset(), record.value())
                    multicast.add(enrichedRecord)
                }
                kafkaConsumer.commitSync()
            } catch (e: Exception) {
                logger.error("Failed to poll kafka")
            }
        }, 10, 33, TimeUnit.MILLISECONDS)
    }

    private fun enrich(offset: Long, message: String?): String? {
        return message?.replaceFirst("id", offset.toString())
    }

    override fun command(): Command {
        return Command.MESG
    }

    val maxMessageSize = 10000
    // TODO: check room number is legit
    // TODO: make a kafka producer pool?
    // TODO: validate base64 from client
    override fun service(session: WSSession, message: String) {

        try {
            if (session.verified != null && message.length < maxMessageSize) {
                val verified = session.verified
                val splitted = message.split(":")
                val roomNumber = Integer.parseInt(splitted[0])
                val messageBody = splitted[1]

                if (verified.verified
                        && verified.post
                        && splitted.size == 2
                        && Integer.valueOf(roomNumber) == 0
                        && !messageBody.contains(':')) {
                    val msg = Message(verified.userid,
                            roomNumber,
                            verified.username,
                            messageBody)
                    sendMessage(msg)
                }
            } else {
                logger.warn("Unauthorized/troll user tried to send a message", session)
                deauth.add(session)
            }
        } catch (e: Exception) {
            logger.error("Failed to handle message for reason", e)
        }
    }

    val ADD_USER = -1
    val REMOVE_USER = -2

    fun manageUser(session: WSSession, addOrRemove: Int) {
        val username = session.verified?.username
        val userid = session.verified?.userid
        if (username != null && userid != null) {
            val mesg = Message(userid, addOrRemove, username, null)
            sendMessage(mesg)
        }
    }

    override fun addUser(session: WSSession) {
        manageUser(session, ADD_USER)
    }

    override fun removeUser(session: WSSession) {
        manageUser(session, REMOVE_USER)
    }

    private fun sendMessage(message: Message) {
        var decodedBody: String? = null
        if (message.messageBody != null) {
            decodedBody = Base64.getDecoder().decode(message.messageBody.toByteArray(Charsets.UTF_8)).toString(Charsets.UTF_8)
        }
        val messageId = chatDAO.insertMessage(message.userId, message.roomNumber, decodedBody)
        val cmd = WSCommand(Command.MESG)
                .addElem(message.roomNumber)
                .addElem(messageId)
                .addElemBase64(message.username)
                .addElem(message.messageBody)
        val producerRecord = ProducerRecord<String, String>(Command.MESG.name, cmd.build())
        synchronized(kafkaProducer, {
            kafkaProducer.send(producerRecord)
        })
    }

}

data class Message(val userId: Int, val roomNumber: Int, val username: String, val messageBody: String?) {
}

