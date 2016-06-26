package com.jmick.battle.auth

import org.joda.time.DateTime
import org.skife.jdbi.v2.StatementContext
import org.skife.jdbi.v2.tweak.ResultSetMapper
import java.sql.ResultSet


data class UserDTO(val user_id: Long,
                   val username: String,
                   val email: String,
                   val hash: ByteArray,
                   val createdAt: DateTime) {
}

class UserMapper : ResultSetMapper<UserDTO> {
    override fun map(index: Int, r: ResultSet, ctx: StatementContext) : UserDTO? {
        if (r.getLong("user_id") == 0L) {
            return null;
        } else {
            return UserDTO(r.getLong("user_id"),
                r.getString("username"),
                r.getString("email"),
                r.getBytes("hash"),
                DateTime(r.getDate("created_at")))
        }
    }
}
