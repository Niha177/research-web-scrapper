SELECT * FROM facultyLinks
SELECT * FROM scapedMajorSites
SELECT * FROM collegeSite
SELECT * FROM easyFacultyLinks

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

CREATE TABLE facultyLinks(

     id SERIAL PRIMARY KEY,
     major TEXT UNIQUE NOT NULL,
     sourceUrl TEXT[],
     urlData JSONB,
     last_scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    
)

CREATE TABLE easyFacultyLinks(

     id SERIAL PRIMARY KEY,
     major TEXT UNIQUE NOT NULL,
     sourceUrl TEXT[],
     urlData JSONB,
     last_scraped_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP    
)



DELETE FROM 
WHERE major = 'Industrial Engineering';

SELECT urls FROM easyFacultyLinks WHERE major = 'Biochemistry'







