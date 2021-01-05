// Design the following database schema containing three tables:

// * **department**:
//       * **id** - INT PRIMARY KEY
//       * **name** - VARCHAR(30) to hold department name

// * **role**:
//       * **id** - INT PRIMARY KEY
//       * **title** -  VARCHAR(30) to hold role title
//       * **salary** -  DECIMAL to hold role salary
//       * **department_id** -  INT to hold reference to department role belongs to

// * **employee**:
//       * **id** - INT PRIMARY KEY
//       * **first_name** - VARCHAR(30) to hold employee first name
//       * **last_name** - VARCHAR(30) to hold employee last name
//       * **role_id** - INT to hold reference to role employee has
//       * **manager_id** - INT to hold reference to another employee that manages the employee being Created. This field may be null if the employee has no manager
  
// Build a command-line application that at a minimum allows the user to:
//       * Add departments, roles, employees

//       * View departments, roles, employees

//       * Update employee roles

//1. require your needed libraries
const mysql = require('mysql');
const inquirer = require('inquirer');
const consoleTable = require('console.table');


// 2. create the connection, connection information for the sql database
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'password',
    database: 'employeeTracker_DB',
});

// connect to the mysql server and sql database
connection.connect((err) => {
    if (err) throw err;
    console.log('                ');
    console.log('Starting the app...');
    console.log('                ');
    start();
});

// function which prompts the user for what action they would like to take
const start = () => {
    console.log('                ');
    console.log('WELCOME TO THE EMPLOYEE TRACKER APP ! ! !');
    console.log('                ');
    inquirer.prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: 'choice',
        choices: [
            'View All Employees',
            'View All Employees By Department',
            'View All Roles', 
            'Add Employee', 
            'Add Role',
            'Add Department',
            'Update Employee Role'
        ]
    })
    .then((answer) => {
        switch (answer.choice) {
            case 'View All Employees':
            viewAllEmployees();
                break;
            case 'View All Employees By Department':
            viewEmployeesByDepartment();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Update Employee Role':
                updateEmployeeRole();
                break;
        }
    });
};

//================================= function to handle 'View All Employees'
    const viewAllEmployees = () => {
        connection.query(`SELECT e.first_name, e.last_name, role.title, department.name, role.salary, CONCAT(m.first_name, ' ' , m.last_name) AS Manager 
        FROM employee e
        INNER JOIN role ON e.role_id = role.id 
        INNER JOIN department ON role.department_id = department.id 
        LEFT JOIN employee m ON e.manager_id = m.id;
        `, (err, res) => {
              if (err) throw err;
              console.table(res);
              start();
            }
        );
    }

//==================== function to handle 'View All Employees By Department'
const viewEmployeesByDepartment = () => {
    connection.query(`SELECT e.first_name, e.last_name, department.name AS Department 
    FROM employee e
    JOIN role ON e.role_id = role.id 
    JOIN department ON role.department_id = department.id 
    ORDER BY e.id;
    `, (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
        }
    );
}

//====================================== function to handle 'View All Roles'
const viewAllRoles = () => {
    connection.query(`SELECT e.first_name, e.last_name, role.title AS Title 
    FROM employee e
    JOIN role ON e.role_id = role.id;`, 
        (err, res) => {
        if (err) throw err;
        console.table(res);
        start();
        }
    )
}

// create array to handle role title queries for 'Add Employees' and 'Update Employee'
let roleArr = [];
var roleChoices = () => {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        for (let i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }   
    })
    return roleArr;
}

// create array to handle manager queries for 'Add Employees'
let managerArr = [];
var managerChoices = () => {
    connection.query(`SELECT first_name, last_name 
    FROM employee 
    WHERE manager_id IS NULL
    `, (err, res) => {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            managerArr.push(res[i].first_name);
        }
    })
    return managerArr;
}
//======================================= function to handle 'ADD EMPLOYEE'
const addEmployee = () => {

    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: "What is the employee's first name?",
        },
        {
            name: 'lastName',
            type: 'input',
            message: "What is the employee's last name?",
        },
        {
            name: 'role',
            type: 'rawlist',
            message: "What is the employee's role?",
            choices: roleChoices()
        },
        {
            name: 'manager',
            type: 'rawlist',
            message: "What is their manager's name?",
            choices: managerChoices()
        }
    ])
    .then((answer) => {
        let roleId = roleChoices().indexOf(answer.role) + 1
        let managerId = managerChoices().indexOf(answer.manager) + 1
        connection.query("INSERT INTO employee SET ?", 
        {
            first_name: answer.firstName,
            last_name: answer.lastName,
            manager_id: managerId,
            role_id: roleId       
        }, 
        (err) => {
            if (err) throw err;
            console.table(answer);
            start();
        }
        );
    });   
}

//=========================================== function to handle 'ADD ROLE'
const addRole = () => {
    connection.query("SELECT role.title AS title, role.salary AS salary FROM role", (err) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: "What is the title of the role to be added?",
            },
            {
                name: 'salary',
                type: 'input',
                message: "What is the salary of the role to be added?"
            }
        ])
        .then((answer) => {
            connection.query("INSERT INTO role SET ?", 
            {
                title: answer.title,
                salary: answer.salary
            }, 
            (err) => {
                if (err) throw err;
                console.table(answer);
                start();
            });
        });
    });
}

//===================================== function to handle 'ADD DEPARTMENT'
const addDepartment = () => {
    inquirer.prompt([
        {
            name: 'name',
            type: 'input',
            message: "What is the name of the department to be added?",
        }
    ])
    .then((answer) => {
        connection.query("INSERT INTO department SET ?", 
        {
            name: answer.name  
        }, 
        (err) => {
            if (err) throw err;
            console.table(answer);
            start();
        });
    });
}

//================================== function to handle 'UPDATE EMPLOYEE ROLES'

const updateEmployeeRole = () => {
    connection.query(`SELECT e.first_name, e.last_name ,role.title
    FROM employee e
    INNER JOIN role ON e.role_id = role.id;`, (err,res) => {
        if (err) throw err;
        console.table(res);

        inquirer.prompt([
            {
                name: 'name',
                type: 'rawlist',
                message: "What is the last name of the employee to be updated?",
                choices: nameChoice = () => {
                    let lastName = [];
                    for (let i = 0; i < res.length; i++) {
                        lastName.push(res[i].last_name);
                    }   
                    return lastName;
                }
            },
            {
                name: "role",
                type: "rawlist",
                message: "What is the Employees new title? ",
                choices: roleChoices()
            }
        ])
        .then((answer) => {
            let roleId = roleChoices().indexOf(answer.role) + 1
            connection.query("UPDATE employee SET WHERE ?", 
            {
                role_id: roleId
            },
            {
                last_name: answer.lastName 
            },
            (err) => {
                if (err) throw err;
                console.table(answer);
                start();
            })
        });
    });
}
