CREATE TABLE user_credential
(
  user_id    SERIAL PRIMARY KEY,
  username   TEXT UNIQUE,
  email      TEXT UNIQUE,
  hash       BYTEA NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT timezone('utc' :: TEXT, now())
);

CREATE UNIQUE INDEX user_credential_email_idx
ON user_credential
USING BTREE
(email);

CREATE UNIQUE INDEX user_credential_username_idx
ON user_credential
USING BTREE
(username);