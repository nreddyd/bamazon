CREATE DATABASE bamazon;
USE bamazon;

drop table products;

create table products (
item_id integer(10) not null auto_increment,
product_name varchar(100),
department_name varchar(50),
price decimal(20,2),
stock_quantity integer(20),
primary key(item_id)
);

insert into products (item_id, product_name, department_name, price, stock_quantity)
values (01, "iphone8", "electronics", 899.00, 5),
(02, "dot a art", "arts and crafts", 38.00, 100),
(03, "handbag", "women", 50.00, 6),
(04, "solar lights outdoor", "home improvement", 39.99, 150),
(05, "echo dot", "bmazon devices", 49.99, 65),
(06, "Wireless Security Camera Indoor", "Electronics", 42.49, 35),
(07, "The Alchemist", "Books", 12.79, 500),
(08, "Quiet", "Books", 15.50, 300),
(09, "Blender", "appliance", 49.00, 16),
(10, "pens", "stationary", 4.00, 500);