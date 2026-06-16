SELECT * FROM collegeSite

CREATE EXTENSION IF NOT EXISTS pg_trgm;



CREATE TABLE scapedMajorSites (
     id SERIAL PRIMARY KEY,
     major TEXT UNIQUE NOT NULL,
     sourceUrl TEXT[],
     urlData JSONB,
     last_scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

CREATE TABLE collegeSite(
     id SERIAL PRIMARY KEY,
     major TEXT,
     urls TEXT[]
)





SELECT urls FROM collegeSite WHERE major = 'Computer Science'

DELETE FROM scapedMajorSites WHERE major = 'Crop Sciences'





