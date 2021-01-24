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
      CcAddresses: ['manage2@glidaa.com'], // A secondary email address to receive the notification
      ToAddresses: ['manager@glidaa.com'], // A primary email address to receive the notification
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
    Source: 'authorized@email.com',
  };

  ses.sendEmail(params, function (err, data) {
    if (err) console.log(err, err.stack);
    else console.log(data);
  });
});

app.listen(3000, function () {
  console.log('App started');
});

module.exports = app;
