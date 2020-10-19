const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');

const startPrompt = function () {
  inquirer
    .prompt([
      {
        type: 'list',
        message: 'What would you like to do?',
        name: 'action',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'QUIT']
      }
    ])
    .then(({ action }) => {
      if (action === 'View all departments') {
        readDepartments();
      }
      else if (action === 'View all roles') {
        readRoles();
      }
      else if (action === 'View all employees') {
        readEmployees();
      }
      else if (action === 'Add a department') {
        inquirer.prompt([
          {
            type: 'input',
            message: 'What is the name of the department?',
            name: 'departmentName'
          }
        ])
          .then(({ departmentName }) => {
            addDepartment(departmentName);
          })
      }
      else if (action === 'Add a role') {
        addRole();
      }
      else if (action === 'Add an employee') {
        getArray();
      }
      else if (action === 'Update an employee role'){
        updateRole();
      }
      else if (action === 'QUIT') {
        quitProgram();
      }
    })
}


// Create the connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  // Your MySQL username
  user: 'root',
  // Your MySQL password
  password: 'Jan221997',
  database: 'employeesDB'
});

connection.connect(err => {
  if (err) throw err;
  //console.log('connected as id ' + connection.threadId);
  startProgram();
});

readEmployees = () => {
  console.log('Selecting all employees...\n');
  const query = connection.query(
    `SELECT A.id, A.first_name, A.last_name, role.title, department.department_name, role.salary, CONCAT(B.first_name, " ", B.last_name )AS manager
    FROM employee AS A
    INNER JOIN role ON A.role_id = role.id
    INNER JOIN department ON role.department_id = department.id
    LEFT OUTER JOIN employee AS B ON A.manager_id = B.id;`,
    (err, res) => {
      if (err) throw err;

      console.table(res);

      startPrompt();
    }
  )
  //
};

readDepartments = () => {
  console.log('Selecting all departments...\n');

  const query = connection.query(
    `SELECT * FROM department`,
    (err, res) => {
      if (err) throw err;

      console.table(res);

      startPrompt();
    }
  )

};

readRoles = () => {
  console.log('Selecting all roles...\n');

  const query = connection.query(
    `SELECT title, role.id, department.department_name, salary
      FROM role
      INNER JOIN department ON role.department_id = department.id;`,
    (err, res) => {
      if (err) throw err;

      console.table(res);

      startPrompt();
    }
  )

};

addDepartment = (departmentName) => {
  console.log('What is the name of the department? \n');

  const query = connection.query(
    `INSERT INTO department SET ?`,
    [{
      department_name: departmentName
    }],
    (err, res) => {
      if (err) throw err;
      console.log("INSERTED!")
      startPrompt();
    }
  )

};

addRole = () => {
  const query = connection.query(
    // `INSERT INTO role (title, salary, department_id)
    //   VALUES (?, ?, ?)`,
    // [roleName, roleSalary, departmentRole],
    // (err, res) => {
    //   if (err) throw err;
    //   console.log('ROLE ADDED!');
    //   startPrompt();
    // }
    `SELECT * FROM department`,
    (err, res) => {
      if (err) throw err;
      let deptArr = [];

      for (let i = 0; i < res.length; i++) {
        deptArr.push(res[i].department_name);
      }
      inquirer.prompt([
        {
          type: 'input',
          message: 'What is the name of the role?',
          name: 'roleName'
        },
        {
          type: 'number',
          message: 'What is the salary of that role?',
          name: 'roleSalary'
        },
        {
          type: 'list',
          message: 'What is the department this role belong to?',
          name: 'departmentRole',
          choices: deptArr
        }
      ])
      .then(({ roleName, roleSalary, departmentRole }) => {
        let deptId = 0;
        for (let i = 0; i < res.length; i++) {
          if (res[i].department_name === departmentRole) {
            deptId = res[i].id;
          }
        }
        const query = connection.query(
          `INSERT INTO role (title, salary, department_id)
          VALUES (?,?,?)`,
          [roleName, roleSalary, deptId],
          (err, res) => {
            if (err) throw err;
            console.log('ROLE HAS BEEN ADDED SUCCESSFULLY');
            startPrompt();
          }
        )
      })
    }

  )


}

getArray = () => {
  const query = connection.query(
    `SELECT * FROM role`,
    (err, res) => {
      if (err) throw err;
      let rolesArr = [];
      for (let i = 0; i < res.length; i++) {
        rolesArr.push(res[i].title);
      }
      inquirer.prompt([
        {
          type: 'input',
          message: 'What is the employees first name?',
          name: 'empFName'
        },
        {
          type: 'input',
          message: 'What is the employees last name?',
          name: 'empLName'
        },
        {
          type: 'list',
          message: 'What is the employees role?',
          name: 'empRole',
          choices: rolesArr
        },
        {
          type: 'number',
          message: 'What is the employees manager ID?',
          name: 'empMan'
        }

      ])
        .then(({ empFName, empLName, empRole, empMan }) => {
          let roleId = 0;
          for (let i = 0; i < res.length; i++) {
            if (res[i].title === empRole) {
              roleId = res[i].id;
            }
          }
          const query = connection.query(
            `INSERT INTO employee (first_name, last_name, role_id, manager_id)
            VALUES (?,?,?,?)`,
            [empFName, empLName, roleId, empMan],
            (err, res) => {
              if (err) throw err;
              console.log('EMPLOYEE HAS BEEN ADDED SUCCESSFULLY');
              startPrompt();
            }
          )
        })
    }
  )
}
updateRole = () => {
  const query = connection.query(
    `SELECT id, CONCAT(first_name, " ", last_name) AS emp FROM employee`,
    (err, res) => {
      if(err) throw err;
      
      let empArr = [];
      for (let i = 0; i < res.length; i++) {
        empArr.push(res[i].emp);
      }
      inquirer.prompt([
        {
          type: 'list',
          message: 'Which employee would you like to switch roles',
          name: 'updateEmp',
          choices: empArr
        },
        {
          type: 'number',
          message: 'What is the role ID?',
          name: 'updateId'
        }
      ])
      .then(({ updateEmp, updateId }) => {
        let updateEmpId = 0;
          for (let i = 0; i < res.length; i++) {
            if (res[i].emp === updateEmp) {
              updateEmpId = res[i].id;
            }
          }
        const query = connection.query(
          `UPDATE employee SET ? WHERE ?`,
          [
            {
              role_id: updateId
            },
            {
              id: updateEmpId
            }
          ],
          function(err, res) {
            if(err) throw err;
            console.log("Updated successfully!");
            startPrompt();
          }
        )
      })
    }
  )
}

startProgram = () => {
  console.log(
    `
    WELCOME TO THE EMPLOYEE TRACKER!!!
  
    PLEASE SELECT AN OPTION BELOW
    `
  );

  startPrompt();
}

quitProgram = () => {
  console.log(
    `
    THANK YOU FOR USING EMPLOYEE TRACKER

    HAVE A GREAT DAY!!!
    `
  )
  process.exit();
}