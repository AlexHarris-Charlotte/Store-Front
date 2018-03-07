DROP DATABASE IF EXISTS bamazon_DB;

CREATE DATABASE bamazon_DB;

USE bamazon_db;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT(10) NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Laptop", "Electronics", 899.99, 75);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Flat Screen Television", "Electronics", 499.99, 40);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Cell Phone", "Electronics", 99.99, 125);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Nikes", "Apparel", 125.99, 60);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Suits", "Apparel", 299.99, 40);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Pants", "Apparel", 35.99, 75);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Refridgeratro", "Appliances", 449.99, 30);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Stove", "Appliances", 399.99, 25);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Waser", "Appliances", 349.99, 20);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Dryer", "Appliances", 349.99, 20);

SELECT * FROM products