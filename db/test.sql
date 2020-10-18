SELECT title, role.id, department.department_name, salary
FROM role
INNER JOIN department ON role.department_id = department.id;