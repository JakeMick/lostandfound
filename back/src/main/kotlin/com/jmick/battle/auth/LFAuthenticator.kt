package com.jmick.battle.auth

import com.github.toastshaman.dropwizard.auth.jwt.JsonWebTokenValidator
import com.github.toastshaman.dropwizard.auth.jwt.model.JsonWebToken
import com.google.common.base.Optional
import io.dropwizard.auth.Authenticator
import java.math.BigDecimal


class LFAuthenticator(val userDao: UserDAO,
                      val jsonWebTokenValidator: JsonWebTokenValidator)
        : Authenticator<JsonWebToken, MyUser> {

    override fun authenticate(token: JsonWebToken) : Optional<MyUser> {

        jsonWebTokenValidator.validate(token);

        if ("good-guy".equals(token.claim().subject())) {
            return Optional.of(MyUser(BigDecimal.ONE, "good-guy"));
        }

        return Optional.absent();
    }
}

