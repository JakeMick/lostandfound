package com.jmick.battle.auth

import com.codahale.metrics.health.HealthCheck

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
