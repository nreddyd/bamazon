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
  displayItemsForSale();
});

function displayItemsForSale() {
  connection.query(
    "select item_id,product_name, price from products where stock_quantity>0",
    function(err, res) {
      if (err) throw err;
      console.log("Id \t Name \t Price \n");
      for (var i = 0; i < res.length; i++) {
        console.log(
          res[i].item_id +
            "\t" +
            res[i].product_name +
            "\t" +
            res[i].price +
            "\n"
        );
      }
      promptQuestions(res.length);
    }
  );
}

function promptQuestions(length) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "purcase_item_id",
        message: "Enter the Item_id of the product you would like to buy???"
      },
      {
        type: "input",
        name: "quantity",
        message: "how many units of the product would you like to buy???"
      }
    ])
    .then(function(answer) {
      var purchaseItemId = answer.purcase_item_id;
      if (
        purchaseItemId > length + 1 ||
        isNaN(purchaseItemId) ||
        isNaN(answer.quantity)
      ) {
        console.log("Invalid Input");
        connection.end();
      } else {
        connection.query(
          "select stock_quantity, price from products where item_id = ?",
          [purchaseItemId],
          function(err, res) {
            if (err) throw err;
            if (answer.quantity > res[0].stock_quantity) {
              console.log("Insufficient quantity!");
            } else {
              var updateQuantity =
                res[0].stock_quantity - parseFloat(answer.quantity);
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
              var totalCost = res[0].price * answer.quantity;
              console.log(
                "The total price of the purchase : " + totalCost.toFixed(2)
              );
            }
            connection.end();
          }
        );
      }
    });
}
