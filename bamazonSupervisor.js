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
    choices: ["View Sales By Deaprtment", "Create New Department"]
}]).then(function (answer) {
    if (answer.whichAction == "View Sales By Deaprtment") {
        //display the dept id, name,overhead costs, sales, and profit
        displaySales();
        
    } else if (answer.whichAction == "Create New Department") {
        addDepartment();
    }
    //    connection.end();
})

function addDepartment() {
    displayDepartments();
    connection.query("SELECT * FROM departments", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([{
                    name: "newDepartmentName",
                    type: "input",
                    message: "What department would you like to add?",
                },
                {
                    name: "newDepartmentOverhead",
                    type: "input",
                    message: "What is the overhead cost for this department?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ]).then(function (answer) {

                connection.query(
                    "INSERT INTO departments SET ?", {
                        department_name: answer.newDepartmentName,
                        overhead_costs: answer.newDepartmentOverhead,

                    },
                    function (err) {
                        if (err) throw err;
                        console.log("Your department was added successfully!");
                        displayDepartments();
                    }
                );

            })
    })
    // connection.end();
}

function displayDepartments() {
    var data = [];
    connection.query("SELECT * FROM departments", function (err, results) {
        if (err) throw err;
        //get results from database
        for (var i = 0; i < results.length; i++) {
            data.push({
                //save variables to data array so it can be displayed as a table
                id: results[i].department_id,
                name: results[i].department_name,
                overhead: results[i].overhead_costs,

            })
        }

        //easy-table npm syntax to create a table from the results
        var t = new Table

        data.forEach(function (product) {

            t.cell('Department Id', product.id)
            t.cell('Department Name', product.name)
            t.cell('Overhead Costs', product.overhead)
            t.newRow()
        })

        console.log(t.toString())
    })
}



function displaySales() {
    var data = [];

    connection.query("SELECT departments.department_id, departments.department_name, departments.overhead_costs, sum(products.product_sales) AS total_sales FROM products INNER JOIN departments ON departments.department_name = products.department_name GROUP BY departments.department_id", function (err, results) {
        if (err) throw err;
        // console.log(results);
        for (var i = 0; i < results.length; i++) {

            data.push({
               id: results[i].department_id,
               name:results[i].department_name,
               overhead:results[i].overhead_costs,
               sales: results[i].total_sales,
               profit: results[i].total_sales - results[i].overhead_costs
            })

        }


        var t = new Table

        data.forEach(function (product) {

            t.cell('Department Id', product.id)
            t.cell('Department Name', product.name)
            t.cell('Overhead Costs', product.overhead)
            t.cell('Product Sales', product.sales)
            t.cell('Total Profit', Math.round(product.profit * 100)/100 )
            t.newRow()
        })

        console.log(t.toString())


    })
    connection.end();
}