INSERT INTO department (name) VALUES
('Accounting'),
('I.T.'),
('Evil Schemes'),
('Alchemy');

INSERT INTO role (title, salary, department) VALUES
('Accountant', 75000, 1),
('Account Manager', 100000, 1),
('Tech Support', 50000, 2),
('grunt', 20000, 3),
('Evil Scientist', 600000, 3),
('Alchemist', 100000, 4),
('Grand Wizard', 500000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, 2),
('Jane', 'Doe', 2, null),
('Maurice', 'Moss', 3, null),
('Steve', 'Hunger', 4, 5),
('Doctor', 'Weird', 5, null),
('Err', 'Moon', 6, 7),
('Ignignokt', 'Moon', 7, null);