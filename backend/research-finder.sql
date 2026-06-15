SELECT * FROM majors

CREATE EXTENSION IF NOT EXISTS pg_trgm;

SELECT code, word_similarity(code, 'Computer Science') AS match_score
     FROM majors
     WHERE 'Computer Science' <% code
     ORDER BY match_score DESC
     LIMIT 1

SELECT code FROM majors WHERE name = 'Computer Science'



SELECT code, similarity(name, 'chemical engineering') AS match_score
FROM majors
ORDER BY match_score DESC
LIMIT 1;


SELECT code,name FROM majors WHERE name = 'computer science'






