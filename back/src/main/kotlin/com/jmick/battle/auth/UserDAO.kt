package com.jmick.battle.auth

import org.skife.jdbi.v2.sqlobject.Bind
import org.skife.jdbi.v2.sqlobject.SqlQuery
import org.skife.jdbi.v2.sqlobject.SqlUpdate
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper

@RegisterMapper(UserMapper::class)
public interface UserDAO {

    @SqlQuery("SELECT 1 FROM user_credential")
    fun select1(): Int

    @SqlQuery("""SELECT user_id, username, email, hash, created_at
                 FROM user_credential
                 WHERE email = :email
                 LIMIT 1""")
    fun userByEmail(@Bind("email") email: String): UserDTO?

    @SqlUpdate("""INSERT INTO user_credential
                (username, email, hash)
                    VALUES
                (:username, :email, :hash)""")
    fun insertUser(@Bind("username") username: String,
                   @Bind("email") email: String,
                   @Bind("hash") hash: ByteArray)

    @SqlQuery("""SELECT tracker
                 FROM email_tracking
                 WHERE email = :email""")
    fun trackerByEmail(@Bind("email") email: String): String?

    @SqlQuery("""INSERT INTO email_tracking (tracker, email)
                SELECT (SELECT md5(random()\:\:TEXT || clock_timestamp()\:\:TEXT)\:\:UUID), :email
                WHERE NOT EXISTS (SELECT 1 FROM email_tracking WHERE email = :email)
                RETURNING tracker""")
    fun generateTracker(@Bind("email") email: String): String?


}


