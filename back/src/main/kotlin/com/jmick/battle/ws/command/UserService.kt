package com.jmick.battle.ws.command

import com.jmick.battle.ws.session.WSSession

interface UserService {

    open fun addUser(session: WSSession)
    open fun removeUser(session: WSSession)
}