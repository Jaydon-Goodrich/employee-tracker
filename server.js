const mysql = require('mysql2');
const cTable = require('console.table');
const inquirer = require('inquirer');

const startPrompt = function() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What would you like to do?',
                name: 'action',
                choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role']
            }
        ])
        .then(({ action }) => {
            if( action === 'View all departments'){
              
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
    console.log('connected as id ' + connection.threadId);
    afterConnection();
  });
  
  afterConnection = () => {

    connection.query(
      `SELECT * FROM employee`,
      function(err, results) {
          console.table(results);
      }
    )
    connection.query(
        `SELECT * FROM role`,
        function(err, results) {
            console.table(results);
        }
      )
      connection.query(
        `SELECT * FROM department`,
        function(err, results) {
            console.table(results);
        }
      )
    startPrompt();

    connection.end();
  };