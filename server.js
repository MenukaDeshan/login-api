const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const SQLite3 = require("sqlite3").verbose();
const dbase = "SQLiteDB";
let table = new SQLite3.Database(dbase, function(error) {
    if (error) {
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
                if (error) {
                    console.error(error.message);
                } else {
                    console.log("Table has just been created!");
                }
            }
        );
    }
});

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const PORT = 8080;
app.listen(PORT, function() {
    console.log(`Node.js server is listening at port: ${PORT}`);
});

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post("/api/customer/register/", function(req, res, next) {
    try {
        if (!req.body) {
            console.log("Invalid POST request body!");
        } else {
            console.log("An HTTP POST request has been received by the Node server!")
            console.log("Processing the request...........")

            const {
                name,
                address,
                email,
                dateOfBirth,
                gender,
                age,
                cardHolderName,
                cardNumber,
                expiryDate,
                cvv,
                timeStamp
            } = req.body;

            var query = `INSERT INTO customer (name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv, timeStamp) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
            var record = [name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv, timeStamp];
            
            if (cardNumber.toString().length != 12) { 
                console.log(`Registration of user ${name} was rejected due to invalid credit card number!`)
                res.status(400).json({
                    "message": "Invalid credit card number",
                    "status": "Registration failed"
                });
            } else if (email.indexOf("@") == -1 || email.length < 10 || email.indexOf(".") == -1) { 
                console.log(`Registration of user ${name} was rejected due to invalid email address!`)
                res.status(400).json({
                    "message": "Invalid email address",
                    "status": "Registration failed"
                });
            } else { 
                table.run(query, record, function(error, result) {
                    if (error) {
                        console.error(error);
                        res.status(400).json({
                            "error": error.message
                        });
                        return;
                    } else {
                        console.log(`A new record for customer ${name} has been created!`);
                        res.status(201).json({
                            "message": `Customer ${name} has registered!`,
                            "customerId": this.lastID
                        });
                    }
                });
            }
        }
    } catch (Error) {
        res.status(400).send(Error);
        console.error(Error.message);
    }
});

module.exports = { table };
