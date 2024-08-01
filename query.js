class Query{
    // a query class with methods for the main types of queries
    viewDepartment(pool) {
        pool.query(`SELECT * FROM department`, function (err, {rows}) {
            console.table(rows);
          });
    }
    viewRole(pool) {
        pool.query('SELECT role.id, role.title, department.name, role.salary FROM role JOIN department ON role.department = department.id', function (err, {rows}) {
            console.table(rows);
          });
    }
    viewEmployee(pool) {
        // grabs the managers names from a self join with the employee table, grabs job title, and salary from role table, grabs department from a join with department table
        pool.query(`SELECT t1.id, t1.first_name, t1.last_name, role.title, department.name, role.salary, t2.first_name || ' ' || t2.last_name AS Manager 
            FROM employee t1 LEFT JOIN employee t2 ON t1.manager_id = t2.id JOIN role ON t1.role_id = role.id 
            JOIN department ON role.department = department.id`, function (err, {rows}) {
            console.table(rows);
          });
    }
    addDepartment(pool, dep) {
        pool.query(`INSERT INTO department(name) VALUES ('${dep}')`, (err, res) => err? console.log(err) : console.log('Department added'));
    }
    addRole(pool, title, salary, dep) {
        pool.query(`INSERT INTO role (title, salary, department) VALUES ('${title}', ${salary}, ${dep})`, 
            (err, res) => err? console.log(err) : console.log('Role added'));
    }
    addEmployee(pool, fname, lname, role_id, manager_id) {
        pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${fname}', '${lname}', ${role_id}, ${manager_id})`, 
            (err, res) => err? console.log(err) : console.log('employee added'));
    }

}

module.exports = Query;