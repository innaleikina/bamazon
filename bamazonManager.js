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

inquirer.prompt([{
    name: "whichAction",
    type: "list",
    message: "What would you like to do?",
    choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
}]).then(function (answer) {
    if (answer.whichAction == "View Products for Sale") {
        viewItems();
    } else if (answer.whichAction == "View Low Inventory") {
        viewLowInventory();
    } else if (answer.whichAction == "Add to Inventory") {
        addInventory();
    } else if (answer.whichAction == "Add New Product") {
        addNewItem();

    }
    //  connection.end();
});

function viewItems() {
    var data = [];
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            data.push({
                id: results[i].id,
                name: results[i].product_name,
                department: results[i].department_name,
                price: results[i].price,
                quantity: results[i].stock_quantity,

            })
        }
        var t = new Table

        data.forEach(function (product) {

            t.cell('Product Id', product.id)
            t.cell('Product Name', product.name)
            t.cell('Department', product.department)
            t.cell('Price, USD', product.price, Table.number(2))
            t.cell('Quantity', product.quantity)
            t.newRow()
        })

        console.log(t.toString())
    })
    connection.end();
}

function viewLowInventory() {
    var data = [];
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        for (var i = 0; i < results.length; i++) {
            if (results[i].stock_quantity < 5) {
                data.push({
                    id: results[i].id,
                    name: results[i].product_name,
                    department: results[i].department_name,
                    price: results[i].price,
                    quantity: results[i].stock_quantity,

                })
            }
        }
        var t = new Table

        data.forEach(function (product) {

            t.cell('Product Id', product.id)
            t.cell('Product Name', product.name)
            t.cell('Department', product.department)
            t.cell('Price, USD', product.price, Table.number(2))
            t.cell('Quantity', product.quantity)
            t.newRow()
        })

        console.log(t.toString())
    })
    connection.end();
}


function addNewItem() {
    console.log("adding inventory");
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                    name: "newItemDepartment",
                    type: "list",
                    message: "What department is the item from?",
                    choices: ["books", "office supplies", "kids and baby", "technology and gadgets", "memberships"]
                },
                {
                    name: "itemName",
                    type: "input",
                    message: "Enter your item"
                },
                {
                    name: "price",
                    type: "input",
                    message: "Enter item's price ",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "quantity",
                    type: "input",
                    message: "Enter the quantity",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function (answer) {
                //console.log("item not added to the database yet");
                connection.query(
                    "INSERT INTO products SET ?", {
                        department_name: answer.newItemDepartment,
                        product_name: answer.itemName,
                        price: answer.price,
                        stock_quantity: answer.quantity
                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Your item was added successfully!");
                        viewItems();
                    }
                );
            })

    })
}

function addInventory() {
    console.log("adding items");
    inquirer
        .prompt([{
                name: "id_name",
                type: "input",
                message: "Enter the id of the item you want to replenish",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                name: "quantityAdd",
                type: "input",
                message: "How many items would you like to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
        ]).then(function (answer) {

            var selectedId = "";
            var selectedItem = "an id that does not exist";
            var newQuantity = 0;
            connection.query("SELECT * FROM products", function (err, results) {
                if (err) throw err;
                for (var i = 0; i < results.length; i++) {
                    if (parseFloat(answer.id_name) == parseFloat(results[i].id)) {
                        selectedId += results[i].id;
                        selectedItem = results[i].product_name;
                        // quantity = results[i].stock_quantity;
                    }
                }
                console.log("you selected " + selectedItem);
                console.log("old quantity " + parseFloat(results[selectedId - 1].stock_quantity));
                console.log("to add quantity " + parseFloat(answer.quantityAdd));
                newQuantity = parseFloat(results[selectedId - 1].stock_quantity) + parseFloat(answer.quantityAdd);
                console.log(parseFloat(results[selectedId - 1].stock_quantity) + parseFloat(answer.quantityAdd));

                console.log("id is " + selectedId);
                connection.query("UPDATE products SET ? WHERE ?", [{
                        stock_quantity: newQuantity
                    },
                    {
                        id: selectedId
                    }
                ]);

                viewItems();
            })
        });
}