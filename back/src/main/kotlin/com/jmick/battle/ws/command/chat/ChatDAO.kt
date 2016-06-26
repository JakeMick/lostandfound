package com.jmick.battle.ws.command.chat

import org.skife.jdbi.v2.sqlobject.Bind
import org.skife.jdbi.v2.sqlobject.SqlQuery

public interface ChatDAO {
    @SqlQuery("""INSERT INTO chat_message
            (user_id, room_id, message_body)
             VALUES
            (:user_id, :room_id, :message_body)
             RETURNING chat_message_id""")
    fun insertMessage(@Bind("user_id") userId: Int,
                      @Bind("room_id") roomId: Int,
                      @Bind("message_body") messageBody: String?): Int
}


