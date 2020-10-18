SELECT A.id, A.first_name, A.last_name, role.title, department.department_name, role.salary, CONCAT(B.first_name, " ", B.last_name )AS manager
FROM employee AS A
INNER JOIN role ON A.role_id = role.id
INNER JOIN department ON role.department_id = department.id
LEFT OUTER JOIN employee AS B ON A.manager_id = B.id;