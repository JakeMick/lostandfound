package com.jmick.battle

import com.github.toastshaman.dropwizard.auth.jwt.JWTAuthFilter
import com.github.toastshaman.dropwizard.auth.jwt.JsonWebTokenValidator
import com.github.toastshaman.dropwizard.auth.jwt.hmac.HmacSHA512Verifier
import com.github.toastshaman.dropwizard.auth.jwt.parser.DefaultJsonWebTokenParser
import com.github.toastshaman.dropwizard.auth.jwt.validator.ExpiryValidator
import com.jmick.battle.auth.*
import com.jmick.battle.lobby.*
import io.dropwizard.Application
import io.dropwizard.auth.AuthDynamicFeature
import io.dropwizard.auth.AuthValueFactoryProvider
import io.dropwizard.jdbi.DBIFactory
import io.dropwizard.setup.Bootstrap
import io.dropwizard.setup.Environment
import io.dropwizard.websockets.WebsocketBundle
import org.eclipse.jetty.servlets.CrossOriginFilter
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature
import java.security.Principal
import java.util.*
import javax.servlet.DispatcherType

class BattleApplication() : Application<BattleConfiguration>() {
    companion object {
        @JvmStatic
        fun main(args: Array<String>) {
            BattleApplication().run(*args)
        }
    }

    override fun initialize(bootstrap: Bootstrap<BattleConfiguration>) {
        bootstrap.addBundle(WebsocketBundle(LobbySession::class.java))
    }


    private fun enableCors(env: Environment, frontEndOrigin: String) {
        val corsFilter = env.servlets().addFilter("CORS", CrossOriginFilter::class.java)
        corsFilter.setInitParameter(CrossOriginFilter.ALLOWED_METHODS_PARAM, "GET,PUT,POST,DELETE,OPTIONS")
        corsFilter.setInitParameter(CrossOriginFilter.ALLOWED_ORIGINS_PARAM, frontEndOrigin)
        corsFilter.setInitParameter(CrossOriginFilter.ALLOWED_HEADERS_PARAM, "Content-Type,Authorization,X-Requested-With,Content-Length,Accept,Origin")
        corsFilter.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType::class.java), true, "/*")
    }

    override fun run(config: BattleConfiguration, env: Environment) {
        if (config.cors.enabled) {
            enableCors(env, config.cors.frontEndOrigin)
        }

        env.jersey().urlPattern = "/api/*"

        val factory = DBIFactory()
        val jdbi = factory.build(env, config.getDataSourceFactory(), "postgresql")
        val userDao = jdbi.onDemand(UserDAO::class.java)

        val tokenParser = DefaultJsonWebTokenParser()
        val tokenVerifier = HmacSHA512Verifier(config.jwtTokenSecret)
        val expiryValidator = ExpiryValidator()
        createAndRegisterAuthentication(tokenParser,
                                        tokenVerifier,
                                        expiryValidator,
                                        env,
                                        userDao)

        createAndRegisterAuthorization(config, env, userDao)

        createLobby(tokenParser, tokenVerifier, expiryValidator)

    }

    private fun createAndRegisterAuthentication(tokenParser: DefaultJsonWebTokenParser,
                                                tokenVerifier: HmacSHA512Verifier,
                                                expiryValidator: JsonWebTokenValidator,
                                                env: Environment,
                                                userDao: UserDAO) {
        val lfAuthenticator = LFAuthenticator(userDao, expiryValidator)
        registerAuthentication(env, tokenParser, tokenVerifier, lfAuthenticator)
    }

    private fun createAndRegisterAuthorization(config: BattleConfiguration,
                                               env: Environment,
                                               userDao: UserDAO) {
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

    private fun createLobby(tokenParser: DefaultJsonWebTokenParser,
                            tokenVerifier: HmacSHA512Verifier,
                            expiryValidator: JsonWebTokenValidator) {
        val auth = WebSocketAuthService(tokenParser, tokenVerifier, expiryValidator)
        val commandParser = WebSocketCommandParser(auth)
        LobbyDelegate.lobby = Lobby(commandParser)
    }

    private fun registerAuthentication(env: Environment,
                                       tokenParser: DefaultJsonWebTokenParser,
                                       tokenVerifier: HmacSHA512Verifier,
                                       lfAuthenticator: LFAuthenticator) {
        env.jersey().register(AuthDynamicFeature(
                JWTAuthFilter.Builder<MyUser>()
                        .setCookieName("token")
                        .setTokenParser(tokenParser)
                        .setTokenVerifier(tokenVerifier)
                        .setRealm("realm")
                        .setPrefix("Bearer")
                        .setAuthenticator(lfAuthenticator)
                        .buildAuthFilter()))
        env.jersey().register(AuthValueFactoryProvider.Binder(Principal::class.java))
        env.jersey().register(RolesAllowedDynamicFeature::class.java)
    }

}

