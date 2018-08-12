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
               
               
CREATE TABLE departments (
department_id INTEGER AUTO_INCREMENT NOT NULL,
department_name VARCHAR (200),
overhead_costs DECIMAL (10,2) NOT NULL,
PRIMARY KEY (department_id)
);

ALTER TABLE products 
ADD product_sales  DECIMAL (10,2) NOT NULL;


INSERT INTO departments (department_name, overhead_costs)
VALUES ("office supplies", 2000),
               ( "books", 800),
               ("kidds and baby", 1000),
               ("technology and gadgets",  20),
                 ( "memberships", 110),
               ("cameras",10000)

SELECT * FROM departments;
SELECT * FROM products;


SELECT 
   departments.department_id,
   departments.department_name,
   departments.overhead_costs,
   sum(products.product_sales) AS total_sales
   

 FROM
   products
	  INNER JOIN
        departments ON departments.department_name = products.department_name
        GROUP BY
departments.department_id




         