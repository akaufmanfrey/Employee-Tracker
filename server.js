// Import and require Pool (node-postgres)
const inquirer = require('inquirer');
const { Pool } = require('pg');
const Query = require('./query');

// Connect to database
const pool = new Pool(
  {
    //postgres credentials
    user: 'postgres',
    password: 'rootroot',
    host: 'localhost',
    database: 'business_db'
  },
  console.log(`Connected to the business_db database.`)
)

pool.connect();
// function to handle user interaction, async so that it waits for user responses before coninuing to execute
async function init() {
  // initial prompt which waits for a user to choose an option
  await inquirer.prompt([
    {
      type: 'list',
      message: 'What would you like to do?',
      name: 'option',
      choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit']
  
    }
  ])
  .then(async (response) => {
    const query = new Query();
    // check the response to determine which code to execute
    if (response.option === 'View all roles') {
      query.viewRole(pool);
    } else if (response.option === 'View all departments') {
      query.viewDepartment(pool);
    } else if (response.option === 'View all employees') {
      query.viewEmployee(pool);
    } else if (response.option === 'Add a department') {
      // adds new department based on user input
      await inquirer.prompt([
        {
          type: 'input',
          message: 'Please enter the name of the new department',
          name: 'dep'
        }
      ]).then((response) => {
          query.addDepartment(pool, response.dep);
      })
    } else if (response.option === 'Add a role') {
        // grabs an array of all departments
        const resArray = await selectArray('name', 'department');
        await inquirer.prompt([
          {
            type: 'input',
            message: 'Please enter the name of the new role',
            name: 'title'
          },
          {
            type: 'input',
            message: 'Please enter the salary',
            name: 'salary'
          },
          {
            type: 'list',
            message: 'Which department does this role belong to?',
            name: 'dep',
            choices: resArray
          }
        ]).then(async (response) => {
            // grabs id of selected department and adds it to the department table
            const depId = await pool.query(`SELECT id FROM department WHERE name = '${response.dep}'`)
            query.addRole(pool, response.title, response.salary, depId.rows[0].id);
        })
    } else if (response.option === 'Quit') {
      process.exit(1);
    } else if (response.option === 'Add an employee') {
      // grabs role and employee arrays
      const roleArray = await selectArray('title', 'role');
      const managerArray = await selectManager();
      managerArray.push('None');
        // asks user for new employee info
        await inquirer.prompt([
          {
            type: 'input',
            message: 'Please enter the first name of the employee',
            name: 'fname'
          },
          {
            type: 'input',
            message: 'Please enter the last name of the employee',
            name: 'lname'
          },
          {
            type: 'list',
            message: 'What is the role of this employee?',
            name: 'role',
            choices: roleArray
          },
          {
            type: 'list',
            message: 'Who is the manager of this employee?',
            name: 'manager',
            choices: managerArray
          }
        ]).then(async (response) => {
            // grabs role and manager ids based on selected options
            if (response.manager === 'None') {
              const roleId = await pool.query(`SELECT id FROM role WHERE title = '${response.role}'`)
              query.addEmployee(pool, response.fname, response.lname, roleId.rows[0].id, null);
            } else {
            const roleId = await pool.query(`SELECT id FROM role WHERE title = '${response.role}'`)
            const managerId = await pool.query(`SELECT id FROM employee WHERE first_name || ' ' || last_name = '${response.manager}'`)
            query.addEmployee(pool, response.fname, response.lname, roleId.rows[0].id, managerId.rows[0].id);
            }
        })
    } else {
      const roleArray = await selectArray('title', 'role');
      const employeeArray = await selectManager();
        await inquirer.prompt([
          {
            type: 'list',
            message: 'Who is the employee to update?',
            name: 'employee',
            choices: employeeArray
          },
          {
            type: 'list',
            message: 'What is the new role of this employee?',
            name: 'role',
            choices: roleArray
          },
        ]).then((response) => {
          // finds id value for selected role
          pool.query(`SELECT id FROM role WHERE title = '${response.role}'`, async (err, res) => {
            // sets new role_id for selected employee
            await pool.query(`UPDATE employee SET role_id = ${res.rows[0].id} WHERE first_name || ' ' || last_name = '${response.employee}'`)
          })
        })
    }
    // calls itself with a 1 second delay so nothing in the console is overwritten
    setTimeout(init, 1000);
  })
}
// helper function for grabbing an array
async function selectArray(column, table) {
  const res = await pool.query(`SELECT ${column} FROM ${table}`);
  if (table === 'role') {
    // turns array into an array of strings instead of objects
    const resultsArray = res.rows.map(a => a.title);
  return resultsArray
  }
  else {
  return res.rows
  }
}
// helper function for grabbing employee array
async function selectManager() {
  const res = await pool.query(`SELECT first_name || ' ' || last_name AS manager FROM employee`)
  const resultsArray = res.rows.map(a => a.manager);
  return resultsArray
}
init();


