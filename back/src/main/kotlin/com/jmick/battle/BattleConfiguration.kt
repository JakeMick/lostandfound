package com.jmick.battle

import com.fasterxml.jackson.annotation.JsonProperty
import io.dropwizard.Configuration
import io.dropwizard.db.DataSourceFactory
import org.hibernate.validator.constraints.NotEmpty
import java.nio.charset.Charset
import java.util.*
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
    val kafka = KafkaConfig()

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

class KafkaConfig {

    @Valid
    @NotNull
    @JsonProperty
    val bootstrapServer = ""

    @Valid
    @NotNull
    @JsonProperty
    val groupId = ""

    @Valid
    @NotNull
    @JsonProperty
    val autoCreateTopics = true
}

fun getMap(kafkaConfig: KafkaConfig) : MutableMap<String, Any>  {
    val result = HashMap<String, Any>();
    result.put("bootstrap.servers", kafkaConfig.bootstrapServer)
    result.put("group.id", kafkaConfig.groupId)
    result.put("key.serializer", "org.apache.kafka.common.serialization.StringSerializer")
    result.put("value.serializer", "org.apache.kafka.common.serialization.StringSerializer")
    result.put("key.deserializer", "org.apache.kafka.common.serialization.StringDeserializer")
    result.put("value.deserializer", "org.apache.kafka.common.serialization.StringDeserializer")
    result.put("auto.create.topics.enable", kafkaConfig.autoCreateTopics)
    return result;
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
