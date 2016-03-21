package com.jmick.battle.auth

import com.github.toastshaman.dropwizard.auth.jwt.model.JsonWebToken
import com.github.toastshaman.dropwizard.auth.jwt.validator.ExpiryValidator
import com.google.common.base.Optional
import com.jmick.battle.dao.UserDAO
import io.dropwizard.auth.Authenticator
import java.math.BigDecimal


class LFAuthenticator(val userDao: UserDAO)
        : Authenticator<JsonWebToken, MyUser> {

    val expiryValidator = ExpiryValidator()

    override fun authenticate(token: JsonWebToken) : Optional<MyUser> {

        // Provide your own implementation to lookup users based on the principal attribute in the
        // JWT Token. E.g.: lookup users from a database etc.
        // This method will be called once the token's signature has been verified

        // In case you want to verify different parts of the token you can do that here.
        // E.g.: Verifying that the provided token has not expired.

        // All JsonWebTokenExceptions will result in a 401 Unauthorized response.

        expiryValidator.validate(token);

        if ("good-guy".equals(token.claim().subject())) {
            return Optional.of(MyUser(BigDecimal.ONE, "good-guy"));
        }

        return Optional.absent();
    }
}

