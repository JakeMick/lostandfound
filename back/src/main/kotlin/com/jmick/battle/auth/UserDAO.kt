package com.jmick.battle.auth

import org.skife.jdbi.v2.sqlobject.Bind
import org.skife.jdbi.v2.sqlobject.SqlQuery
import org.skife.jdbi.v2.sqlobject.SqlUpdate
import org.skife.jdbi.v2.sqlobject.customizers.RegisterMapper

@RegisterMapper(UserMapper::class)
public interface UserDAO {

    @SqlQuery("select 1 from user_credential")
    fun select1() : Int

    @SqlQuery("""select userid, username, email, hash, created_at
                 from user_credential
                 where email = :email
                 limit 1""")
    fun userByEmail(@Bind("email") email: String) : UserDTO?

    @SqlUpdate("""insert into user_credential
                (username, email, hash)
                    values
                (:username, :email, :hash)""")
    fun insertUser(@Bind("username") username: String,
                   @Bind("email") email: String,
                   @Bind("hash") hash: ByteArray)

    @SqlQuery("""select tracker
                 from email_tracking
                 where email = :email""")
    fun trackerByEmail(@Bind("email") email: String) : String?

    @SqlQuery("""insert into email_tracking (tracker, email)
                select (SELECT md5(random()\:\:text || clock_timestamp()\:\:text)\:\:uuid), :email
                where not exists (select 1 from email_tracking where email = :email)
                returning tracker""")
    fun generateTracker(@Bind("email") email: String) : String?


}


