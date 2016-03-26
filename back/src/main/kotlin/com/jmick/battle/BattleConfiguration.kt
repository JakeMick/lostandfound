package com.jmick.battle

import com.fasterxml.jackson.annotation.JsonProperty
import io.dropwizard.Configuration
import io.dropwizard.db.DataSourceFactory
import org.hibernate.validator.constraints.NotEmpty
import java.nio.charset.Charset
import javax.validation.Valid
import javax.validation.constraints.NotNull

class BattleConfiguration() : Configuration() {

    @Valid
    @NotNull
    @JsonProperty
    val cors = CorsConfig()

    @Valid
    @NotNull
    @JsonProperty
    val auth = AuthenticationConfig()

    fun getAuthenticationConfig() : AuthenticationConfig {
        return auth
    }

    val UTF8 = Charset.forName("UTF-8")

    @Valid
    @NotNull
    @JsonProperty
    val database = DataSourceFactory();

    fun getDataSourceFactory() : DataSourceFactory {
        return database;
    }

    @NotEmpty
    val jwtTokenSecret = "ya2ibxeqdy4k3x6rlwufo4bwlp39hf".toByteArray(UTF8);

}

class CorsConfig {
    @Valid
    @NotNull
    @JsonProperty
    val enabled = false

    @Valid
    @NotNull
    @JsonProperty
    val frontEndOrigin = ""

}

class AuthenticationConfig {
    @Valid
    @NotNull
    @JsonProperty
    val sendGridUser: String = ""

    @Valid
    @NotNull
    @JsonProperty
    val sendGridPass: String = ""


    @Valid
    @NotNull
    @JsonProperty
    val baseUrl: String = ""

    @Valid
    @NotNull
    @JsonProperty
    var expirationSeconds: Int = 0

}
