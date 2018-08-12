var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("easy-table");

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



function start() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                    name: "whichId",
                    type: "input",
                    message: "Input an id for the item you want to buy",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "howMany",
                    type: "input",
                    message: "Input how many of the item you would like to buy",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }

                }
            ]).then(function (answer) {
                var whichId = answer.whichId
                var howMany = answer.howMany;
                var quantity;
                var price;
                var dbTotal;
                console.log("You chose item with id " + whichId);
                for (var i = 0; i < results.length; i++) {
                    if (results[i].id == whichId) {
                        quantity = results[i].stock_quantity
                        price = parseFloat(results[i].price)
                        dbTotal = parseFloat(results[i].product_sales)

                    }
                }

                checkQuantity(howMany, quantity, whichId, price, dbTotal );
            })

    });
}

function checkQuantity(requestQuantity, databaseQuantity, id, price, databaseTotal) {
    if (requestQuantity <= databaseQuantity) {
        var newQuantity = databaseQuantity - requestQuantity;
       
        newQuantity = parseFloat(newQuantity);
        var total = requestQuantity * price;
        var newTotal = databaseTotal + total;
        connection.query(
            "UPDATE products SET ? WHERE ?", [{
                    stock_quantity: newQuantity,
                    product_sales: newTotal
                },
                {
                    id: id
                },
            ])
        displayItems();
        console.log(" ");
        console.log(" --- Your total is $" + total);
        console.log(" ");

    } else {
        console.log("Insufficient quantity!");
    }

    connection.end();
}


function displayItems() {
    var data = []

    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            data.push({
                id: results[i].id,
                name: results[i].product_name,
                price: results[i].price,
                quantity: results[i].stock_quantity,
                total: results[i].product_sales
            })
        }
        var t = new Table

        data.forEach(function (product) {

            t.cell('Product Id', product.id)
            t.cell('Product Name', product.name)
            t.cell('Price, USD', product.price, Table.number(2))
            t.cell('Quantity', product.quantity)
            t.cell("Total Sales", product.total)
            t.newRow()
        })

        console.log(t.toString())
    })
}