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