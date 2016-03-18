package com.jmick.caseban

import com.fasterxml.jackson.annotation.JsonProperty
import io.dropwizard.Configuration
import io.dropwizard.db.DataSourceFactory
import org.hibernate.validator.constraints.NotEmpty
import java.nio.charset.Charset
import javax.validation.Valid
import javax.validation.constraints.NotNull

public class CaseBanConfiguration() : Configuration() {

    @Valid
    @NotNull
    @JsonProperty
    var expirationSeconds: Int = 0

    val UTF8 = Charset.forName("UTF-8")

    @Valid
    @NotNull
    @JsonProperty
    val database = DataSourceFactory();

    fun getDataSourceFactory() : DataSourceFactory  {
        return database;
    }

    @NotEmpty
    val jwtTokenSecret = "ya2ibxeqdy4k3x6rlwufo4bwlp39hf".toByteArray(UTF8);

}
