package com.jmick.caseban.core;

import com.fasterxml.jackson.annotation.JsonProperty

class User {

    @JsonProperty
    var username: String = ""

    @JsonProperty
    var password: String = ""

    @JsonProperty
    var email: String = ""

    constructor()

    override fun equals(other: Any?): Boolean{
        if (this === other) return true
        if (other?.javaClass != javaClass) return false

        other as User

        if (email != other.email) return false
        if (password != other.password) return false

        return true
    }

    override fun hashCode(): Int{
        var result = email.hashCode()
        result += 31 * result + password.hashCode()
        return result
    }
}