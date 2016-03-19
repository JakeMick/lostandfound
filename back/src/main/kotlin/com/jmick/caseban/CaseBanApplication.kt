package com.jmick.caseban

import com.github.toastshaman.dropwizard.auth.jwt.JWTAuthFilter
import com.github.toastshaman.dropwizard.auth.jwt.hmac.HmacSHA512Verifier
import com.github.toastshaman.dropwizard.auth.jwt.parser.DefaultJsonWebTokenParser
import com.jmick.caseban.auth.LFAuthenticator
import com.jmick.caseban.auth.MyUser
import com.jmick.caseban.dao.UserDAO
import com.jmick.caseban.health.AuthHealthCheck
import com.jmick.caseban.resources.AuthResource
import com.jmick.caseban.service.OutboundEmailService
import io.dropwizard.Application
import io.dropwizard.auth.AuthDynamicFeature
import io.dropwizard.auth.AuthValueFactoryProvider
import io.dropwizard.jdbi.DBIFactory
import io.dropwizard.setup.Bootstrap
import io.dropwizard.setup.Environment
import org.eclipse.jetty.servlets.CrossOriginFilter
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature
import java.security.Principal
import java.util.*
import javax.servlet.DispatcherType

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
        val corsFilter = env.servlets().addFilter("CORS", CrossOriginFilter::class.java)
        corsFilter.setInitParameter(CrossOriginFilter.ALLOWED_METHODS_PARAM, "GET,PUT,POST,DELETE,OPTIONS")
        corsFilter.setInitParameter(CrossOriginFilter.ALLOWED_ORIGINS_PARAM, "*")
        corsFilter.setInitParameter(CrossOriginFilter.ALLOWED_HEADERS_PARAM, "Content-Type,Authorization,X-Requested-With,Content-Length,Accept,Origin")
        corsFilter.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType::class.java), true, "/*")


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

        val outboundEmailService = OutboundEmailService(config.auth.sendGridUser,
                                                        config.auth.sendGridPass);

        val authResource = AuthResource(userDao,
                outboundEmailService,
                config.jwtTokenSecret,
                config.auth.expirationSeconds,
                config.auth.baseUrl

        )
        env.jersey().register(authResource)

        val authHealthCheck = AuthHealthCheck(userDao)
        env.healthChecks().register("user dao health check", authHealthCheck);
    }

}
