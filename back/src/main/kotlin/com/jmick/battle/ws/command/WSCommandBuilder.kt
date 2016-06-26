package com.jmick.battle.ws.command

import java.util.*

class WSCommand(val command: Command) {
    private val sb: StringBuilder;

    init {
        sb = StringBuilder()
        sb.append(command.ordinal)
    }

    fun addElem(elem: Int): WSCommand {
        appendSeparator()
        sb.append(elem)
        return this
    }

    fun addElem(elem: String?): WSCommand {
        appendSeparator()
        if (elem != null) {
            sb.append(elem)
        }
        return this
    }

    fun addElemBase64(elem: String?): WSCommand {
        appendSeparator()
        if (elem != null) {
            sb.append(Base64.getEncoder().encode(elem.toByteArray(Charsets.UTF_8)).toString(Charsets.UTF_8))
        }
        return this
    }

    private fun appendSeparator() {
        sb.append(colon)
    }

    fun build() : String {
        return sb.toString()
    }
    companion object {
        @JvmStatic
        val colon = ":"
    }
}
