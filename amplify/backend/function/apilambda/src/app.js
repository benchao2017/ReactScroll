const AWS = require('aws-sdk');
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');
var bodyParser = require('body-parser');
var express = require('express');

AWS.config.update({ region: process.env.TABLE_REGION });

const dynamodbClient = new AWS.DynamoDB.DocumentClient();
const dynamodbService = new AWS.DynamoDB({ apiVersion: '2012-08-10' });

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

  var sendEmail = function (email, ccEmail = null, message) {

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

    return ses.sendEmail(params).promise();

  }

  var sendText = function (phoneNumber, message) {
    // Following code is to send TEXT MESSAGE
    var params = {
      Message: message, /* required */
      PhoneNumber: phoneNumber,
    };

    // Create promise and SNS service object
    return new AWS.SNS({ apiVersion: '2010-03-31' }).publish(params).promise();

  }

  var sendMessages = function (user, callback) {

    let phone = null;
    if (user) {
      phone = user.phone;
    }


    let messagePhone = `The user ${putItemParams.Item.email} just clicked the email link and is visiting the website (${now}) User phone: not registered`;

    let messageEmail = `The user <b>${putItemParams.Item.email}</b> just clicked the email link and is visiting the website (${now})<br> User phone: not registered`;

    if (phone) {
      messageEmail = `The user <b>${putItemParams.Item.email}</b> just clicked the email link and is visiting the website (${now}) <br> User phone: <b>${phone}</b>`;
      messagePhone = `The user ${putItemParams.Item.email} just clicked the email link and is visiting the website (${now}) User phone: ${phone}`;
    }

    console.log("Email & Text message ", messageEmail, messagePhone);
    let p1 = sendEmail('sophie@glidaa.com', 'michael@glidaa.com', messageEmail);
    let p2 = sendEmail('gog1withme@gmail.com', null, messageEmail);
    let p3 = sendText('+61414623616', messagePhone);
    let p4 = sendText('+61404068926', messagePhone);
    let p5 = sendText('+919911731169', messagePhone);

    Promise.all([
      p1, p2, p3, p4, p5
    ])
      .then(() => {
        console.log("Promises fullfilled");
        callback(user);
      })
      .catch(() => {
        console.log('Something went wrong')
        callback(user);
      })

  }

  // Storing the user data
  dynamodbClient.put(putItemParams, (err, _data) => {
    if (err) {
      res.statusCode = 500;
      res.json({ error: err, url: req.url, body: req.body });
    } else {
      // console.log('New user visit recorded.')

      //*************** */
      let params = {
        TableName: tableClients,
        Key: {
          "email": req.query.email
        }
      };

      console.log("DDB param: ", params);
      dynamodbClient.get(params, function (err, data) {
        if (err) {
          console.error("Unable to read item. Error JSON:", JSON.stringify(err));
        } else {
          console.log("ddb data: ", data);

          let user = data.Item;
          if (!req.query.existingUser) {
            sendMessages(user, (userData) => {
              res.json({ data: userData });
            });
          } else {
            res.json({ data: user });
          }
        }
      });
      //*************** */
    }
  });




});

app.post(pathCSVUpload, function (req, res) {
  console.log(pathCSVUpload + "request start with data", req);
  console.log(pathCSVUpload + "request body: ", req.body);

  var data = req.body;

  let params = {
    RequestItems: {
      [tableClients]: [

      ]
    }
  }

  for (let i = 0; i < data.length; i++) {
    let phone = data[i].data[0];
    let email = data[i].data[1];

    params.RequestItems[tableClients].push({
      PutRequest: {
        Item: {
          "phone": {
            S: phone
          },
          "email": {
            S: email
          }
        }
      }
    })

  }

  console.log("post params: ", params);

  dynamodbService.batchWriteItem(params, function (err, data) {
    if (err) {
      console.log(err, err.stack); // an error occurred
    }
    else {
      console.log(data);
      res.json({
        statusCode: 200,
      });          // successful response
    }
  });
});

app.listen(3000, function () {
  console.log('App started');
});

module.exports = app;