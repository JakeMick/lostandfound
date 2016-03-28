package com.jmick.battle.ws.command

import java.util.*

class WSCommand(val command: Command) {
    private val sb: StringBuilder;

    init {
        sb = StringBuilder()
        sb.append(command.ordinal)
    }

    fun addElem(elem: String): WSCommand {
        sb.append(colon)
        sb.append(elem)
        return this;
    }

    fun addElemBase64(elem: String): WSCommand {
        sb.append(colon)
        sb.append(Base64.getEncoder().encode(elem.toByteArray(Charsets.UTF_8)).toString(Charsets.UTF_8))
        return this
    }

    fun build() : String {
        return sb.toString()
    }
    companion object {
        @JvmStatic
        val colon = ":"
    }
}
