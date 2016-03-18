create table user_mailing (
	
	email text not null unique,
	created_at timestamp without time zone default (now() at time zone 'utc')
);


create unique index on user_credential (username);
create unique index on user_credential (email);