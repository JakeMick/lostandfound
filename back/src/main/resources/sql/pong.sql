CREATE TABLE pong (
  user_id INTEGER UNIQUE not null references user_credential(user_id),
  date_last_modified TIMESTAMP WITHOUT TIME ZONE not NULL
);
