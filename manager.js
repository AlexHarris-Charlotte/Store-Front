const inquirer = require('inquirer');
const mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : 'root',
    database : 'bamazon_DB'
  });
   
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    promptManager();
});



function promptManager() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'Select an action.',
            name: 'managerAction',
            choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
        }
    ]).then(answers => {
        const managerResponse = answers.managerAction;
        switch (managerResponse){
            case 'View Products for Sale':
                viewProducts();
                break;
            case 'View Low Inventory':
                lowInventory();
                break;
            case 'Add to Inventory':
                addToInventory();                
                break;
            case 'Add New Product':
                addNewProductPrompt();
                break;
        }
    });
};


function viewProducts() {
    connection.query('SELECT * FROM products', function (error, results, fields) {
        // if (error) throw error;
        for(var i = 0; i < results.length; i++) {
            console.log(`ID: ${results[i].item_id} | Product: ${results[i].product_name} | Price: ${results[i].price} | Stock: ${results[i].stock_quantity}`);
        }
    });
    connection.end();

}

function lowInventory() {
    const inventory = 30;
    const query = `SELECT product_name FROM products WHERE stock_quantity < ${inventory.toString()}`;
    connection.query(query, function (error, results, fields) {
        // if (error) throw error;
        for(var i = 0; i < results.length; i++) {
            console.log(`${results[i].product_name} has less than ${inventory} units in stock.`);
        }
    });
    connection.end();

}

function addToInventory() {
    connection.query('SELECT * FROM products', function (error, results, fields) {
        const item_list = [];
        for(var i = 0; i < results.length; i++) {
            item_list.push(`${results[i].product_name}: current inventory ${results[i].stock_quantity}`);
        }
        increaseInventoryPrompt(item_list);
    });   
}

function increaseInventoryPrompt(items_array) {
    inquirer.prompt([
        {
            type     : 'list',
            message  : 'Which items do you wish to increase the inventory?',
            name     : 'inventoryIncrease',
            choices  : items_array
        },

        {
            type     : 'input',
            message  : 'How much do you wish to increase the stock by?',
            name     : 'increaseNumber'
        }
    ]).then(answers => {
        const currentQuantity = parseInt(answers.inventoryIncrease.match(/\d+/));
        const itemToUpdate = answers.inventoryIncrease.split(':')[0];
        const increaseNumber = parseInt(answers.increaseNumber);
        updateInventory(itemToUpdate, increaseNumber, currentQuantity);
    })
}

function updateInventory(item, number, currentStock) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: currentStock + number
          },
          {
            product_name: item
          }
        ],
        function(error, result) {
        console.log(result.affectedRows + " products updated!\n");
        
    });
    connection.end();

}


function addNewProductPrompt() {
    inquirer.prompt([
        {
            type     : 'input',
            message  : 'What New Item would you like to add?',
            name     : 'newItem',
        },

        {
            type     : 'input',
            message  : 'What Department does this item belong to?',
            name     : 'itemDepartment'
        },

        {
            type     : 'input',
            message  : 'What is the default price for this item?',
            name     : 'itemPrice'
        },

        {
            type     : 'input',
            message  : 'How many of these items would you like to place in stock?',
            name     : 'stockQuantity'
        }
    ]).then(answers => {
        const newItem = answers.newItem;
        const itemDepartment = answers.itemDepartment;
        const itemPrice = parseFloat(answers.itemPrice);
        const itemStock = parseFloat(answers.stockQuantity);
        addNewProduct(newItem, itemDepartment, itemPrice, itemStock);
    })
}

function addNewProduct(item, dept, price, stock) {
    connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: item,
          department_name: dept,
          price: price,
          stock_quantity: stock
        },
      );
      connection.end();

}




