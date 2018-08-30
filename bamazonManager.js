var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "password",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  displayMenu();
});

function displayMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "Menu",
        message: "Choose you option from the below menu???",
        choices: [
          "a: View Products for Sale",
          "b: View Low Inventory",
          "c: Add to Inventory",
          "d: Add New Product"
        ]
      }
    ])
    .then(function(choice) {
      switch (choice.Menu) {
        case "a: View Products for Sale":
          viewProductsForSale();
          break;
        case "b: View Low Inventory":
          viewLowInventory();
          break;
        case "c: Add to Inventory":
          addToInventory();
          break;
        case "d: Add New Product":
          addNewProduct();
          break;
      }
    });
}

function viewProductsForSale() {
  console.log("viewProductsForSale");
  var sql =
    "select item_id,product_name, price, stock_quantity from products where stock_quantity>0";
  connection.query(sql, function(err, res) {
    if (err) throw err;
    console.log("Items available for Sale");
    console.log("Id \t Name \t Price \t Quantity\n");
    for (var i = 0; i < res.length; i++) {
      console.log(
        res[i].item_id +
          "\t" +
          res[i].product_name +
          "\t" +
          res[i].price +
          "\t" +
          res[i].stock_quantity +
          "\n"
      );
    }
  });
  connection.end();
}

function viewLowInventory() {
  var sql =
    "select item_id,product_name, price, stock_quantity from products where stock_quantity<10";
  connection.query(sql, function(err, res) {
    if (err) throw err;
    console.log("Items with inventory count lower than five.");
    console.log("Id \t Name \t Price \t Quantity\n");
    for (var i = 0; i < res.length; i++) {
      console.log(
        res[i].item_id +
          "\t" +
          res[i].product_name +
          "\t" +
          res[i].price +
          "\t" +
          res[i].stock_quantity +
          "\n"
      );
    }
  });
  connection.end();
}

function addToInventory() {
  var sql = "select item_id, product_name from products";
  var choicesArray = [];
  connection.query(sql, function(err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
      console.log(res[i].item_id + "\t" + res[i].product_name);
      choicesArray.push(res[i].item_id + "," + res[i].product_name);
    }
  });
  inquirer
    .prompt([
      {
        type: "input",
        name: "product",
        message: "Select the item number to add more to inventory??"
      },
      {
        type: "input",
        name: "quantity",
        message: "How many items would like to add to invenotry??"
      }
    ])
    .then(function(answer) {
      var purchaseItemId = answer.product;
      connection.query(
        "select stock_quantity from products where item_id = ?",
        [purchaseItemId],
        function(err, res) {
          if (err) throw err;
          var updateQuantity =
            res[0].stock_quantity + parseFloat(answer.quantity);
          connection.query(
            "update products set ? where ?",
            [
              {
                stock_quantity: updateQuantity
              },
              {
                item_id: purchaseItemId
              }
            ],
            function(err, res) {
              if (err) throw err;
            }
          );

          connection.end();
        }
      );
    });
  //   connection.end();
}

function addNewProduct() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "product_name",
        message: "Enter the name of product to add??"
      },
      {
        type: "input",
        name: "department_name",
        message: "Enter the department of product to add??"
      },
      {
        type: "input",
        name: "price",
        message: "Enter the price of product to add??"
      },
      {
        type: "input",
        name: "stock_quantity",
        message: "Enter the quantity of product to add??"
      }
    ])
    .then(function(answer) {
      var newrow = {
        product_name: answer.product_name,
        department_name: answer.department_name,
        price: answer.price,
        stock_quantity: answer.stock_quantity
      };
      var sql = "insert into products set ?";
      connection.query(sql, newrow, function(err, res) {
        if (err) throw err;
        console.log(res);
      });
    });
  connection.end();
}