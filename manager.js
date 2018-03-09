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
                console.log(managerResponse);
                // call function here
                break;
        }
        connection.end();
    });
};


function viewProducts() {
    connection.query('SELECT * FROM products', function (error, results, fields) {
        // if (error) throw error;
        for(var i = 0; i < results.length; i++) {
            console.log(`ID: ${results[i].item_id} | Product: ${results[i].product_name} | Price: ${results[i].price} | Stock: ${results[i].stock_quantity}`);
        }
    });
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
        const itemToUpdate = answers.inventoryIncrease.split(':')[0];
        console.log(itemToUpdate, typeof(itemToUpdate));
        const increaseNumber = answers.increaseNumber;
        updateInventory(itemToUpdate, increaseNumber);
    })
}

function updateInventory(item, number) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
          {
            stock_quantity: number
          },
          {
            product_name: item
          }
        ],
        function(error, result) {
        console.log(result.affectedRows + " products updated!\n");
        
    });
}



// Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store. (update)
// Add New Product, it should allow the manager to add a completely new product to the store. (Create)



