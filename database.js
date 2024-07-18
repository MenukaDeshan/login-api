const SQLite3 = require("sqlite3").verbose();       // load in the sqlite3 library

// a local SQLite database where to store data & retrieve data from
const dbase = "SQLiteDB";

// create a SQLite database table
let table = new SQLite3.Database(dbase, function(error){
    if(error){
        console.error(error.message);
        throw error;
    } else {
        console.log("Web application has successfully connected to the SQLite database!");
        table.run(
            `CREATE TABLE IF NOT EXISTS customer(
            customerId INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            address TEXT,
            email TEXT,
            dateOfBirth TEXT,
            gender TEXT,
            age INTEGER,
            cardHolderName TEXT,
            cardNumber INTEGER,
            expiryDate TEXT,
            cvv INTEGER,
            timestamp TEXT)`,
            function(error) {
                if(error){
                    console.error(error.message);
                } else {
                    // table has just been created
                    console.log("Table has just been created!");
                }
            }
        );
    }
});

module.exports = {table};
