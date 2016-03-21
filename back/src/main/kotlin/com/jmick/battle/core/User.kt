package com.jmick.battle.core;

import com.fasterxml.jackson.annotation.JsonProperty
import javax.validation.constraints.NotNull

class User {

    @JsonProperty
    @NotNull
    var username: String = ""

    @JsonProperty
    @NotNull
    var password: String = ""

    @JsonProperty
    @NotNull
    var email: String = ""

    @JsonProperty
    @NotNull
    var tracker: String = ""

    constructor()
}

class Credential {
    @JsonProperty
    @NotNull
    var email: String = ""

    @JsonProperty
    @NotNull
    var password: String = ""
}