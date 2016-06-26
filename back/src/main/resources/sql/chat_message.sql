CREATE TABLE chat_message
(
  chat_message_id SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES user_credential(user_id),
  room_id         INTEGER NOT NULL REFERENCES room (room_id),
  message_body    TEXT,
  created_at      TIMESTAMP WITHOUT TIME ZONE DEFAULT timezone('utc' :: TEXT, now())
);

CREATE INDEX chat_message_created_at_idx
ON chat_message
USING BTREE
(created_at);