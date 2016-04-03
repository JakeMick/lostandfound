package com.jmick.battle.ws.command

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
                  val kafkaProducer: KafkaProducer<String, String>) : CommandService, UserService {
    val multicast = LinkedBlockingDeque<String>(10000)
    val deauth = LinkedBlockingDeque<WSSession>(100)
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
    val idPlaceHolder = "id"
    // TODO: check room number is legit
    // TODO: make a kafka producer pool?
    // TODO: validate base64 from client
    override fun service(session: WSSession, message: String) {

        try {
            if (session.verified != null && message.length < maxMessageSize) {
                val verified = session.verified
                val splitted = message.split(":")
                val roomNumber = splitted[0]
                val messageBody = splitted[1]

                if (verified.verified
                        && verified.post
                        && splitted.size == 2
                        && Integer.valueOf(roomNumber) == 0
                        && !messageBody.contains(':')) {
                    val cmd = WSCommand(Command.MESG)
                            .addElem(roomNumber)
                            .addElem(idPlaceHolder)
                            .addElemBase64(verified.username)
                            .addElem(messageBody)
                    sendMessage(cmd)
                }
            } else {
                logger.warn("Unauthorized/troll user tried to send a message", session)
                deauth.add(session)
            }
        } catch (e: Exception) {
            logger.error("Failed to handle message for reason", e)
        }
    }

    // -1 as a room number means user was added
    val negativeOne = "-1"
    // -2 as a room number means user was removed
    val negativeTwo = "-2"
    val partyNoise = "Joined The Party"
    val partyQuiet = "Left The Party"

    override fun addUser(session: WSSession) {
        val username = session.verified?.username
        if (username != null) {
            val cmd = WSCommand(Command.MESG)
                    .addElem(negativeOne)
                    .addElem(idPlaceHolder)
                    .addElemBase64(username)
                    .addElemBase64(partyNoise)
            sendMessage(cmd)
        }
    }

    override fun removeUser(session: WSSession) {
        val username = session.verified?.username
        if (username != null) {
            val cmd = WSCommand(Command.MESG)
                    .addElem(negativeTwo)
                    .addElem(idPlaceHolder)
                    .addElemBase64(username)
                    .addElemBase64(partyQuiet)
            sendMessage(cmd)
        }
    }

    private fun sendMessage(cmd: WSCommand) {
        val producerRecord = ProducerRecord<String, String>(Command.MESG.name, cmd.build())
        synchronized(kafkaProducer, {
            kafkaProducer.send(producerRecord)
        })
    }

}

