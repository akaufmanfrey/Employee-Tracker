class Query{
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
        pool.query(`SELECT t1.id, t1.first_name, t1.last_name, role.title, department.name, role.salary, t2.first_name || ' ' || t2.last_name AS Manager 
            FROM employee t1 JOIN employee t2 ON t1.manager_id = t2.id JOIN role ON t1.role_id = role.id 
            JOIN department ON role.department = department.id`, function (err, {rows}) {
            console.table(rows);
          });
    }

}

module.exports = Query;