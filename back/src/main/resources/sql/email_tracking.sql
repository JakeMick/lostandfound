create table email_tracking (
	tracker uuid primary key,
	email text unique
);

create unique index on email_tracking (tracker);

