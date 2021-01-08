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
    console.log(`
    █████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗    ████████╗██████╗  █████╗  ██████╗██╗  ██╗███████╗██████╗ 
    ██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝    ╚══██╔══╝██╔══██╗██╔══██╗██╔════╝██║ ██╔╝██╔════╝██╔══██╗
    █████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗         ██║   ██████╔╝███████║██║     █████╔╝ █████╗  ██████╔╝
    ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝         ██║   ██╔══██╗██╔══██║██║     ██╔═██╗ ██╔══╝  ██╔══██╗
    ███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗       ██║   ██║  ██║██║  ██║╚██████╗██║  ██╗███████╗██║  ██║
    ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝       ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝           
    `);
    console.log('                ');
    inquirer.prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: 'choice',
        choices: [
            'View All Employees',
            'View All Employees By Department',
            'View Employees By Roles', 
            'View Department Budget',
            'View Employees By Manager',
            'Add Employee', 
            'Add Role',
            'Add Department',
            'Update Employee Role',
            'Delete Employee'
        ]
    }).then((answer) => {
        switch (answer.choice) {
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'View All Employees By Department':
                viewEmployeesByDepartment();
                break;
            case 'View Employees By Roles':
                viewEmployeeByRoles();
                break;
            case 'View Department Budget':
                viewDepartmentBudget();
                break;
            case 'View Employees By Manager':
                viewEmployeesByManager();
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
            case 'Delete Employee':
                deleteEmployee();
                break;
        }
    });
};

//================================= function to handle 'VIEW ALL EMPLOYEES'
    const viewAllEmployees = () => {
        connection.query(`SELECT e.id, e.first_name, e.last_name, role.title AS role, department.name AS department, role.salary, CONCAT(m.first_name, ' ' , m.last_name) AS manager 
        FROM employee e
        INNER JOIN role ON e.role_id = role.id 
        INNER JOIN department ON role.department_id = department.id 
        LEFT JOIN employee m ON e.manager_id = m.id
        ORDER BY e.id ASC;
        `, (err, res) => {
              if (err) throw err;
              console.log('');
              console.table(res);
              start();
            }
        );
    }

//==================== function to handle 'VIEW ALL EMPLOYEES BY DEPARTMENT'
const viewEmployeesByDepartment = () => {
    connection.query(`SELECT e.id, e.first_name, e.last_name, department.name AS department 
    FROM employee e
    JOIN role ON e.role_id = role.id 
    JOIN department ON role.department_id = department.id 
    ORDER BY e.id;
    `, (err, res) => {
        if (err) throw err;
        console.log('');
        console.table(res);
        start();
        }
    );
}

//====================================== function to handle 'VIEW EMPLOYEES BY ROLES'
const viewEmployeeByRoles = () => {
    connection.query(`SELECT e.id, e.first_name, e.last_name, role.title AS roles
    FROM employee e
    JOIN role ON e.role_id = role.id
    ORDER BY role.id;`, 
        (err, res) => {
        if (err) throw err;
        console.log('');
        console.table(res);
        start();
        }
    )
}

//==================================function to handle 'VIEW DEPARTMENT BUDGET'

const viewDepartmentBudget = () => {
    connection.query(`SELECT department.name AS department, SUM( role.salary) AS total_depatment_budget 
    FROM role
    INNER JOIN department ON department.id = role.department_id
    GROUP BY department.name;
    `, (err, res) => {
        if (err) throw err;
        console.log('');
        console.table(res);
        start();
        }
    );
}

//===============================function to handle 'VIEW EMPLOYEES BY MANAGER'

const viewEmployeesByManager = () => {
    connection.query(`SELECT e.id, e.first_name, e.last_name, CONCAT(m.first_name, ' ' , m.last_name) AS manager
    FROM employee e
    INNER JOIN role ON e.role_id = role.id 
    INNER JOIN department ON role.department_id = department.id 
    LEFT JOIN employee m ON e.manager_id = m.id
    ORDER BY m.id DESC;

    `, (err, res) => {
        if (err) throw err;
        console.log('');
        console.table(res);
        start();
        }
    );
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
    WHERE manager_id IS NULL;
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
    ]).then((answer) => {
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
// create array to handle department queries for 'Add Roles'
let departmentArr = [];
var departmentChoices = () => {
    connection.query(`SELECT * 
    FROM department;
    `, (err, res) => {
        if (err) throw err
        for (let i = 0; i < res.length; i++) {
            departmentArr.push(res[i].name);
        }
    })
    return departmentArr;
}

//=========================================== function to handle 'ADD ROLE'
const addRole = () => {
    connection.query(`SELECT role.title AS title, role.salary AS salary, department.id AS department 
    FROM role
    INNER JOIN department ON department.id = role.department_id
    `, (err) => {
        if (err) throw err;
        console.log('');
        console.table();

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
            },
            {
                name: 'department',
                type: 'rawlist',
                message: "What is the department of the role to be added?",
                choices: departmentChoices()
            },
        ]).then((answer) => {
            let departmentId = departmentChoices().indexOf(answer.department) + 1
            connection.query("INSERT INTO role SET ?", 
            {
                title: answer.title,
                salary: answer.salary,
                department_id: departmentId
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
            name: 'dept_name',
            type: 'input',
            message: "What is the name of the department to be added?",
        }
    ]).then((answer) => {
        connection.query("INSERT INTO department SET ?", 
        {
            name: answer.dept_name  
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
    connection.query(`SELECT e.id, e.first_name, e.last_name, role.title AS role, e.role_id
    FROM employee e
    INNER JOIN role ON e.role_id = role.id
    ORDER BY e.id ASC;`, (err,res) => {
        if (err) throw err;
        console.log('');
        console.table(res);

        inquirer.prompt([
            {
                name: 'employeeId',
                type: 'input',
                message: "What is the id of the employee to be updated?",
            },
            {
                name: "roleId",
                type: "input",
                message: "What is the role id of the role being updated to? ",
            }
        ]).then((answer) => {
            connection.query("UPDATE employee SET role_id = ? WHERE id = ?", 
            [answer.roleId, answer.employeeId], 
            (err) => {
                if (err) throw err;
                console.table(answer);
                start();
            })
        });
    });
}

//================================ function to handle 'DELETE EMPLOYEE'

const deleteEmployee = () => {
    connection.query(`SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department, CONCAT(m.first_name, ' ' , m.last_name) AS manager 
    FROM employee e
    INNER JOIN role ON e.role_id = role.id 
    INNER JOIN department ON role.department_id = department.id 
    LEFT JOIN employee m ON e.manager_id = m.id
    ORDER BY m.id DESC;`, (err,res) => {
        if (err) throw err;
        console.log('');
        console.table(res);

        inquirer.prompt([
            {
                name: 'employeeId',
                type: 'input',
                message: "What is the id of the employee to be deleted?",
            },
        ]).then((answer) => {
            connection.query("DELETE FROM employee WHERE ?", 
            {
                id: answer.employeeId
            }, 
            (err) => {
                if (err) throw err;
                console.table(answer);
                start();
            })
        });
    });
}