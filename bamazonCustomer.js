var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected to the database");
    displayItems();
    start();
});


var idArr = []
var chosenItem;



function start() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                    name: "whichId",
                    type: "input",
                    message: "Input an id for the item you want to buy",
                },
                {
                    name: "howMany",
                    type: "input",
                    message: "Input how many of the item you would like to buy",

                }
            ]).then(function (answer) {
                var whichId = answer.whichId
                var howMany = answer.howMany;
                var quantity;
                var price;
                 console.log("You chose item with id " + whichId);
                for (var i = 0; i < results.length; i++) {
                    if (results[i].id == whichId) {
                        chosenItem = results[i]
                        quantity = results[i].stock_quantity
                        price = parseFloat(results[i].price)
                        //console.log(chosenItem);
                    }
                }

                checkQuantity(howMany, quantity, whichId, price);
            })

    });
}

function checkQuantity(requestQuantity, databaseQuantity, id, price){
  if (requestQuantity <= databaseQuantity){
      var newQuantity = databaseQuantity - requestQuantity;
      newQuantity = parseFloat(newQuantity);
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: newQuantity 
          },
          {
            id: id
          }
        ])
        console.log("Your total is $" + requestQuantity * price );
  } else {
    console.log("Insufficient quantity!");
  }
}


function displayItems() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {

            idArr.push(results[i].id);
            console.log("----------------------");
            console.log("id : " + results[i].id);
            console.log("product name : " + results[i].product_name);
            console.log("department name : " + results[i].department_name);
            console.log("price : " + results[i].price);
            console.log("stock quantity : " + results[i].stock_quantity);
            console.log("----------------------");
            console.log(" ");
        }
    })
}