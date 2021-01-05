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

INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUE ("Sales Lead", 100000.00, 1), ("Sales Person", 80000, 1), ("Lead Engineer", 150000, 2), ("Software Engineer", 120000, 2), ("Accountant", 125000, 3), ("Legal Team Lead", 250000, 4), ("Lawyer", 190000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUE ("Ashley", "Rodriquez", 3, null), ("Malia", "Brown", 5, null), ("Sarah", "Lourd", 6, null) ("John", "Doe", 2, 3), ("Mike", "Chan", 1, 1), ("Tom", "Allen", 7, 6), ("Christian", "Eckenrode", 3, 2);
