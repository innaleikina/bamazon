CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
id INTEGER AUTO_INCREMENT NOT NULL,
product_name VARCHAR (200),
department_name VARCHAR (200),
price DECIMAL (10,2) NOT NULL,
stock_quantity INTEGER (30) NOT NULL,
PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price,  stock_quantity)
VALUES ("Pen", "office supplies", 2.50, 100),
               ("Grapes Of Wrath", "books", 12.99, 80),
               ("Diapers", "kids and baby", 30.00, 1000),
               ("iPhone", "technology and gadgets", 700, 20),
               ("Baby Wipes", "kids and baby", 9.99, 1000),
               ("Costco membership", "memberships", 110, 10),
               ("Canon 5D mkIII", "cameras", 2500, 100),
               ("Before We Were Yours", "books", 19.99, 2),
               ("Llama Llama Red Pajama", "books", 13.99, 10),
               ("We Need To Talk About Kevin", "books", 14.99, 100)
         

SELECT * FROM products;
SHOW COLUMNS FROM products;
               