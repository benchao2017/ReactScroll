const AWS = require('aws-sdk');
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
var bodyParser = require('body-parser');
var express = require('express');

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodb = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES();

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

  // Notifying the manager
  // IMPORTANT! - The sender must be first manually verified in AWS SES Console.
  var params = {
    Destination: {
      BccAddresses: [],
      CcAddresses: ['michael@glidaa.com'], // A secondary email address to receive the notification
      ToAddresses: ['sophie@glidaa.com'], // A primary email address to receive the notification
    },
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          // This is the HTML content for the email
          Data: `The user <b>${putItemParams.Item.email}</b> just clicked the email link and is visiting the website (${now})`,
        },
        Text: {
          Charset: 'UTF-8',
          // This is the text content for the email
          Data: `The user ${putItemParams.Item.email} just clicked the email link and is visiting the website (${now})`,
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

  
 let sendText = function (phoneNumber){
 // Following code is to send TEXT MESSAGE
 var params = {
    Message: `The user ${putItemParams.Item.email} just clicked the email link and is visiting the website (${now})`, /* required */
    PhoneNumber: phoneNumber,
  };
  
  // Create promise and SNS service object
  var publishTextPromise = new AWS.SNS({apiVersion: '2010-03-31'}).publish(params).promise();
  
  // Handle promise's fulfilled/rejected states
  publishTextPromise.then(
    function(data) {
      console.log("MessageID is " + data.MessageId);
    }).catch(
      function(err) {
      console.error(err, err.stack);
    });
 }

 sendText('+61414623616');
 sendText('+61404068926');


});

app.listen(3000, function () {
  console.log('App started');
});

module.exports = app;