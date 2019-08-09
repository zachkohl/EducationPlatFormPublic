-- cat sql/working.sql | heroku pg:psql --app teen-aid

--To enter PSQL: heroku pg:psql --app teen-aid

--to backup the database
--heroku pg:backups:capture --app teen-aid
--heroku pg:backups:download --app teen-aid

-- https://www.tutorialspoint.com/postgresql/postgresql_drop_table.htm
-- DROP TABLE table_name;

--http://www.postgresqltutorial.com/postgresql-add-column/
-- ALTER TABLE table_name
-- ADD COLUMN new_column_name data_type;


-- http://www.postgresqltutorial.com/postgresql-drop-column/
-- ALTER TABLE table_name 
-- DROP COLUMN column_name;

-- CREATE TABLE users (
--  users_id serial PRIMARY KEY, 
--  users_username VARCHAR (255) UNIQUE NOT NULL,
--  users_email VARCHAR(255) UNIQUE NOT NULL,
--  users_emailvalidated BOOLEAN,
--  users_storedhash VARCHAR(255) NOT NULL,
--  users_role VARCHAR(255) NOT NULL,
--  users_category VARCHAR(255)
-- );

-- CREATE TABLE "session" (
--   "sid" varchar NOT NULL COLLATE "default",
-- 	"sess" json NOT NULL,
-- 	"expire" timestamp(6) NOT NULL
-- )
-- WITH (OIDS=FALSE);
-- ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;



-- drop table temppasswords;
-- CREATE TABLE temppasswords (
--  temppasswords_id serial PRIMARY KEY, 
--  temppasswords_email VARCHAR(255) UNIQUE NOT NULL,
--  temppasswords_storedhash VARCHAR(255) NOT NULL,
--  temppasswords_timestamp TIMESTAMPTZ default current_timestamp
-- );

-- CREATE TABLE questions(
--     questions_id serial NOT NULL PRIMARY KEY,
--     questions_info json,
--     questions_number NUMERIC,
--     questions_catagories VARCHAR(255)[],
--     questions_color VARCHAR(255),
--     questions_roles VARCHAR(255)[]
-- )
-- drop table catagories;
-- CREATE TABLE catagories(
--     catagories_id serial NOT NULL PRIMARY KEY,
--     catagories_name VARCHAR(255) UNIQUE NOT NULL,
--     catagories_color VARCHAR(255),
--     catagories_default boolean
-- )
--  ALTER TABLE questions
--  ADD COLUMN questions_catagories VARCHAR(255)[];

-- ALTER TABLE users
-- ADD COLUMN users_highestlevel numeric;

-- DROP TABLE answers;
-- CREATE TABLE answers(
--     answers_id serial NOT NULL PRIMARY KEY,
--     answers_users_id int REFERENCES users(users_id),
--     answers_answer text,
--     answers_timestamp timestamptz default current_timestamp,
--     answers_questions_id int REFERENCES questions(questions_id),
--     answers_catagory VARCHAR(255),
--     answers_needsgrading BOOLEAN default false,
--     answers_submittedEssay text,
--     unique (answers_questions_id,answers_users_id,answers_catagory)
-- )
--select * from answers where answers_users_id ='109' AND answers_questions_id = '62';

--MANY TO MANY EXAMPLE
-- CREATE TABLE adult_child
-- (
--     adult_id int REFERENCES adult (adult_id) ON UPDATE CASCADE ON DELETE CASCADE,
--     --if you update the ID, in adult, it will update the id in adult_child, and if you delete an adult, it will delete all their relationships in adult_child
--     child_id int REFERENCES child (child_id) ON UPDATE CASCADE ON DELETE CASCADE,
--     CONSTRAINT adult_child_pkey PRIMARY KEY (adult_id, child_id) --This is to make the queries go faster. 
-- );

-- ALTER TABLE users ALTER COLUMN users_email DROP NOT NULL;
--Did funky stuff to get rid of email unique constraint. Used the following as a reference: https://stackoverflow.com/questions/18514759/remove-uniqueness-of-index-in-postgresql

--debugging selects
--SELECT DISTINCT answers.answers_users_id, users.users_catagory FROM answers INNER JOIN users ON  answers.answers_users_id = users.users_id ORDER BY answers_users_id DESC;
--SELECT * FROM answers where answers_users_id = '28' AND answers_questions_id ='56';