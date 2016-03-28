package com.jmick.battle.ws.command

import com.jmick.battle.ws.session.WSSession

interface CommandService {
    open fun command() : Command
    open fun service(session: WSSession, message: String)
}