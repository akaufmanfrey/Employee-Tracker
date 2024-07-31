-- Create a new database
DROP DATABASE IF EXISTS business_db;
CREATE DATABASE business_db;

\c business_db;

-- Create a department table
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS role;

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

-- Create a role table
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department INTEGER NOT NULL,
    FOREIGN KEY (department) REFERENCES department(id)
);

-- Create an employee table
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);