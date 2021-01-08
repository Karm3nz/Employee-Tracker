-- Design the following database schema containing three tables:

-- * **department**:
--       * **id** - INT PRIMARY KEY
--       * **name** - VARCHAR(30) to hold department name

-- * **role**:
--       * **id** - INT PRIMARY KEY
--       * **title** -  VARCHAR(30) to hold role title
--       * **salary** -  DECIMAL to hold role salary
--       * **department_id** -  INT to hold reference to department role belongs to

-- * **employee**:
--       * **id** - INT PRIMARY KEY
--       * **first_name** - VARCHAR(30) to hold employee first name
--       * **last_name** - VARCHAR(30) to hold employee last name
--       * **role_id** - INT to hold reference to role employee has
--       * **manager_id** - INT to hold reference to another employee that manages the employee being Created. This field may be null if the employee has no manager

DROP DATABASE IF EXISTS employeeTracker_DB;
CREATE DATABASE employeeTracker_DB;

USE employeeTracker_DB;

CREATE TABLE department (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE role (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES department(id)
);


CREATE TABLE employee (
  id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES role(id),
  FOREIGN KEY (manager_id) REFERENCES employee(id)
);

INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUE ("Sales Lead", 100000.00, 1), ("Sales Person", 80000, 1), ("Lead Engineer", 150000, 2), ("Software Engineer", 120000, 2), ("Accountant", 125000, 3), ("Legal Team Lead", 250000, 4), ("Lawyer", 190000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Ashley", "Rodriquez", 3, null), ("Malia", "Brown", 5, null), ("Sarah", "Lourd", 6, null), ("John", "Doe", 2, 3), ("Mike", "Chan", 1, 1), ("Tom", "Allen", 7, 6), ("Christian", "Eckenrode", 3, 2);