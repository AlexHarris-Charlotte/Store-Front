const mysql = require('mysql');
const inquirer = require('inquirer');

var connection = mysql.createConnection({
    host     : 'localhost',
    port     : 3306,
    user     : 'root',
    password : 'root',
    database : 'bamazon_DB'
  });
   
  connection.connect();
   
  connection.query('SELECT * FROM products', function (error, results, fields) {
    if (error) throw error;
    // console.log(results);
    const productsList = [];
    for(var i = 0; i < results.length; i++) {
        productsList.push(`ID: ${results[i].item_id} | Product: ${results[i].product_name} | Price: ${results[i].price}`)
    }
    promptUser (productsList);
  });



function promptUser (itemsArray) {
    inquirer.prompt([
        {
            type     : 'list',
            message  : 'Select an Item to purchase.',
            choices  : itemsArray,
            name     : 'userItemChoice'
        },
    
        {
            type     : 'input',
            message  : 'How many of those items would you like to purchase?',
            name     : 'userItemQuantity'
        }
    ]).then(answers => {
        const item = answers.userItemChoice;
        const purchaseQuantity = answers.userItemQuantity
        getItemId(item, purchaseQuantity);
    });
}

function getItemId(itemId, userQuantity) {
    const id = itemId.match(/\d+/)[0];
    connection.query('SELECT * FROM products WHERE item_id=?', [id], function (error, results, fields) {
        const stockQuantity = results[0].stock_quantity;
        const productPrice = results[0].price;
        const productName = results[0].product_name;
        if (userQuantity > stockQuantity) {
            console.log(`Sorry, but we currently do not have that many ${productName}s in stock.`)
        } else {
            const updatedQuantity = stockQuantity - userQuantity;
            updatePurchasedProduct(id, updatedQuantity);
            console.log(`The price will be ${productPrice * 2}`);
            console.log(`Before: ${stockQuantity}`);
            console.log(`after: ${updatedQuantity}`);
        }
    })
}

function updatePurchasedProduct(id, updatedQuantity) {
    connection.query(
        "UPDATE products SET ? WHERE ?",
    [
      {
        stock_quantity: updatedQuantity
      },
      {
        item_id: id
      }
    ],
    )

    connection.end();
}