CREATE TABLE room (
  room_id   SERIAL PRIMARY KEY,
  room_name TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT timezone('utc' :: TEXT, now())
);

INSERT INTO room
(room_id, room_name)
VALUES
(0, 'Main'),
(-1, 'Added'),
(-2, 'Removed');