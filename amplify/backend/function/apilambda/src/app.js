const AWS = require('aws-sdk');
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
var bodyParser = require('body-parser');
var express = require('express');

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();

let tableClients = 'clients';
const pathCSVUpload = '/csvupload';

let tableName = 'UserVisits';
if (process.env.ENV && process.env.ENV !== 'NONE') {
  tableName = tableName + '-' + process.env.ENV;
}

const path = '/visit';

var app = express();
app.use(bodyParser.json());
app.use(awsServerlessExpressMiddleware.eventContext());

// CORS
app.use(function (_req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get(path, function (req, res) {
  if (!req.query.email) {
    res.json({
      statusCode: 400,
    });
  }

  let now = new Date().toISOString();

  let item = {
    time: now,
    email: req.query.email,
  };
  let putItemParams = {
    TableName: tableName,
    Item: item,
  };

  // Storing the user data
  dynamodb.put(putItemParams, (err, _data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body });
    } else {
      // console.log('New user visit recorded.')
    }
  });



  let sendEmail = function (email, ccEmail = null, message) {

    // Notifying the manager
    // IMPORTANT! - The sender must be first manually verified in AWS SES Console.
    var params = {
      Destination: {
        BccAddresses: [],
        CcAddresses: [ccEmail], // A secondary email address to receive the notification
        ToAddresses: [email], // A primary email address to receive the notification
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            // This is the HTML content for the email
            Data: message,
          },
          Text: {
            Charset: 'UTF-8',
            // This is the text content for the email
            Data: message,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          // This is the subject
          Data: 'New visit from at website',
        },
      },
      // This is the email you have authorized in AWS SES
      Source: 'michael@glidaa.com',
    };

    ses.sendEmail(params, function (err, data) {
      if (err) console.log(err, err.stack);
      else console.log(data);
    });

  }

  let sendText = function (phoneNumber, message) {
    // Following code is to send TEXT MESSAGE
    var params = {
      Message: message, /* required */
      PhoneNumber: phoneNumber,
    };

    // Create promise and SNS service object
    var publishTextPromise = new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

    // Handle promise's fulfilled/rejected states
    publishTextPromise.then(
      function (data) {
        console.log("MessageID is " + data.MessageId);
      }).catch(
        function (err) {
          console.error(err, err.stack);
        });
  }

  var params = {
    TableName: tableClients,
    Select: "ALL_ATTRIBUTES",
    Key : { 
      "email" : {
        "S" : putItemParams.Item.email
      }
    }
  };

  dynamodb.scan(params, function (err, data) {
    if (err) {      
      console.error("Unable to read item. Error JSON:", JSON.stringify(err));
    } else {
       console.log("ddb data: ", data);
      
      let user = data.Items[0];

        let phone = user.phone;
        let email = user.email;


        let message = `The user <b>${putItemParams.Item.email}</b> just clicked the email link and is visiting the website (${now})<br> User phone: not register`;

        if (phone) {
          `The user <b>${putItemParams.Item.email}</b> just clicked the email link and is visiting the website (${now}) <br> User phone: <b>${phone}</b>`;
        }              
       
        console.log("Email & Text message ", message);
        sendEmail('sophie@glidaa.com', 'michael@glidaa.com', message);
        sendEmail('gog1withme@gmail.com', null, message);
        sendText('+61414623616', message);
        sendText('+61404068926', message);
      
    }
  });


});

app.post(pathCSVUpload, function (req, res) {
  console.log(pathCSVUpload + "request start with data", req);
  console.log(pathCSVUpload + "request body: ", req.body);

  var data = req.body;

  for (let i = 1; i < data.length; i++) {
    let phone = data[i].data[0];
    let email = data[i].data[1];

    let item = {
      email: email,
      phone: phone,
    };
    let putItemParams = {
      TableName: tableClients,
      Item: item,
    };

    // Storing the client data
    dynamodb.put(putItemParams, (err, _data) => {
      if (err) {
        console.log("error from ddb: ", err);
        res.statusCode = 500;
        res.json({ error: err, url: req.url, body: req.body });
      } else {
        // console.log('Data saved')
      }
    });

  }
});

app.listen(3000, function () {
  console.log('App started');
});

module.exports = app;
