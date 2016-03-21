package com.jmick.battle.health

import com.codahale.metrics.health.HealthCheck
import com.jmick.battle.dao.UserDAO

class AuthHealthCheck(val userDAO: UserDAO) : HealthCheck() {
    override fun check() : Result {
        try {
            userDAO.select1();
        } catch (e : Exception) {
            return Result.unhealthy(e)
        }
        return Result.healthy()
    }
}
