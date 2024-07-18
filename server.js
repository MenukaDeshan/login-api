const EXPRESS = require("express");
var WebApp = EXPRESS();

const dataBase = require("./database.js");
const bodyParser = require("body-parser");

const {request, response} = require("express");

WebApp.use(bodyParser.json());

let HTTP_PORT = 8080;
WebApp.listen(HTTP_PORT, function(){
    console.log(`Node.js server is listening at port :${HTTP_PORT}`);

});
WebApp.post("/api/customer/register/", function(request, response, next){   
    try{
    if(!request.body){
        console.log("Invalid POST request body!");
    }else{
        console.log("An http POST request has been received by the Node server!")
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
    } = request.body;
    
    var query =  `INSERT INTO customer (name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv, timeStamp) VALUES(?,?,?,?,?,?,?,?,?,?,?)`;
    var record = [name, address, email, dateOfBirth, gender, age, cardHolderName, cardNumber, expiryDate, cvv,
        timeStamp]; 
    if (cardNumber.toString().length != 12){    // credit card number must be of 12 digits
        console.log(`Registration of user ${name} was rejected due to invalid credit card number!`)
        response.status(400).json({
            "message": "Invalid credit card number",
            "status":"Registration failed"
        });
    }else if (email.indexOf("@") == -1 || email.length < 10 || email.indexOf(".") == -1){   
       console.log(`Registration of user ${name} was rejected due to invalid email address!`)
        response.status(400).json({
           "message": "Invalid email address",
            "status": "Registration failed"
        });
    }else{ 
        dataBase.table.run(query, record, function(error, result){
        if(error){
            console.error(error);
            response.status(400).json({
                "error": error.message
            });
            return;
        }else{
            console.log(`A new record for customer ${name} has been created!`);
            response.status(201).json({
                "message": `Customer ${name} has registered!`,
                "customerId": this.lastID
            });
        }
    });
    }
}
}catch(Error){
    response.status(400).send(Error);
    console.error(Error.message);
}
});

