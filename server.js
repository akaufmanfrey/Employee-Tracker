// Import and require Pool (node-postgres)
const inquirer = require('inquirer');
const { Pool } = require('pg');
const Query = require('./query');

// Connect to database
const pool = new Pool(
  {
    // TODO: Enter PostgreSQL username
    user: 'postgres',
    // TODO: Enter PostgreSQL password
    password: 'rootroot',
    host: 'localhost',
    database: 'business_db'
  },
  console.log(`Connected to the business_db database.`)
)

pool.connect();

inquirer.prompt([
  {
    type: 'list',
    message: 'What would you like to do?',
    name: 'option',
    choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']

  }
])
.then((response) => {
  const query = new Query();
  if (response.option === 'View all roles') {
    query.viewRole(pool);
  } else if (response.option === 'View all departments') {
    query.viewDepartment(pool);
  } else if (response.option === 'View all employees') {
    query.viewEmployee(pool);
  }

})

// Query database


