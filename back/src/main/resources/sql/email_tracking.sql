CREATE TABLE email_tracking
(
  tracker UUID PRIMARY KEY,
  email   TEXT UNIQUE
);


CREATE UNIQUE INDEX email_tracking_tracker_idx
ON email_tracking
USING BTREE
(tracker);