
CREATE DATABASE buyer_risk_db;

\c buyer_risk_db;

CREATE TABLE buyers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    risk_score INT,
    risk_level VARCHAR(50)
);

INSERT INTO buyers (name, risk_score, risk_level)
VALUES
('John Doe', 82, 'RED'),
('Jane Smith', 45, 'AMBER'),
('Alex Brown', 20, 'GREEN');
