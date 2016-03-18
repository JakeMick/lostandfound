package com.jmick.caseban

import com.github.toastshaman.dropwizard.auth.jwt.JWTAuthFilter
import com.github.toastshaman.dropwizard.auth.jwt.hmac.HmacSHA512Verifier
import com.github.toastshaman.dropwizard.auth.jwt.parser.DefaultJsonWebTokenParser
import com.jmick.caseban.auth.LFAuthenticator
import com.jmick.caseban.auth.MyUser
import com.jmick.caseban.dao.UserDAO
import com.jmick.caseban.health.AuthHealthCheck
import com.jmick.caseban.resources.AuthResource
import io.dropwizard.Application
import io.dropwizard.auth.AuthDynamicFeature
import io.dropwizard.auth.AuthValueFactoryProvider
import io.dropwizard.jdbi.DBIFactory
import io.dropwizard.setup.Bootstrap
import io.dropwizard.setup.Environment
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature
import java.security.Principal

class CaseBanApplication() : Application<CaseBanConfiguration>() {
    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            CaseBanApplication().run(*args)
        }
    }

    override fun initialize(bootstrap: Bootstrap<CaseBanConfiguration>) {
    }

    override fun run(config: CaseBanConfiguration, env: Environment) {
        env.jersey().urlPattern = "/api/*"

        val factory = DBIFactory()
        val jdbi = factory.build(env, config.getDataSourceFactory(), "postgresql")
        val userDao = jdbi.onDemand(UserDAO::class.java)

        val tokenParser = DefaultJsonWebTokenParser()
        val tokenVerifier = HmacSHA512Verifier(config.jwtTokenSecret)
        env.jersey().register(AuthDynamicFeature(
                JWTAuthFilter.Builder<MyUser>()
                        .setCookieName("token")
                        .setTokenParser(tokenParser)
                        .setTokenVerifier(tokenVerifier)
                        .setRealm("realm")
                        .setPrefix("Bearer")
                        .setAuthenticator(LFAuthenticator(userDao))
                        .buildAuthFilter()))
        env.jersey().register(AuthValueFactoryProvider.Binder(Principal::class.java))
        env.jersey().register(RolesAllowedDynamicFeature::class.java)

        val authResource = AuthResource(userDao, config.jwtTokenSecret, config.expirationSeconds)
        env.jersey().register(authResource)

        val authHealthCheck = AuthHealthCheck(userDao)
        env.healthChecks().register("user dao health check", authHealthCheck);
    }

}
