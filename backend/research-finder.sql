SELECT * FROM collegeSite

CREATE EXTENSION IF NOT EXISTS pg_trgm;


CREATE TABLE scapedMajorSites (
     id SERIAL PRIMARY KEY,
     major TEXT,
     sourceUrl TEXT,
     urlData JSONB
)

CREATE TABLE collegeSite(
     id SERIAL PRIMARY KEY,
     major TEXT,
     urls TEXT[]
)



SELECT urls FROM collegeSite WHERE major = 'Computer Science'







