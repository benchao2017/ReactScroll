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
  if (!req.query.email && !req.query.getAllClient) {
    res.json({
      statusCode: 400,
    });
  }

  let now = new Date().toISOString();

  let item = {
    time: now,
    email: !req.query.existingUser ? req.query.email : 'admin.admin',
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

    if (!phone) {
      phone = "Not registered";
    }

    let email = putItemParams.Item.email;

    let messagePhone = `The user ${email} just clicked the email link and is visiting the website (${now}) User phone: ${phone}  click here to see page https://explainerpage.com/admin/control/${email}`;

    let messageEmail = `The user <b>${email}</b> just clicked the email link and is visiting the website (${now})<br> User phone: ${phone} <br> click here to see page https://explainerpage.com/admin/control/${email}`;



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

  if (req.query.getAllClient) {

     //Get all client data
    let params = {};
    console.log("Recieved Param: ", req.query.params);
    if(req.query.params)
    {
      var newStr = req.query.params.replace(/\[/g, '{');
      let anotherString = newStr.replace(/]/g, '}');

      console.log("Replaced string: ", anotherString);

      params = JSON.parse(anotherString);
    }
    
    params['TableName'] = tableClients;
     
    console.log("Param: ", params);

    dynamodbClient.scan(params, (err, data) => {
      if (err) {
        console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
        res.statusCode = 500;
        res.json({ error: err, url: req.url, body: req.body });
      } else {
        res.json({
          "statusCode": 200,
          "body": JSON.stringify(data.Items),
          "isBase64Encoded": false
        });
      }
    });
  } else {
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
        dynamodbClient.get(params, (err, data) => {
          if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err));
          } else {
            console.log("ddb data: ", data);

            var user = data.Item;
            if (!req.query.existingUser) {
              sendMessages(user, (userData) => {
                res.json({
                  "statusCode": 200,
                  "body": JSON.stringify(user),
                  "isBase64Encoded": false
                });
              });
            } else {
              console.log("Old user: ", user);
              res.json({
                "statusCode": 200,
                "body": JSON.stringify(user),
                "isBase64Encoded": false
              });
            }
          }
        });
        //*************** */
      }
    });
  }




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

  for (let i = 1; i < data.length; i++) {

    var _item = {};
    for (let j = 0; j < data[0].data.length; j++) {

      let column = data[0].data[j].toLowerCase(); 
      let val = data[i].data[j];
      if(val == undefined){
        val = "";
      }    

      _item[column] = { S: val };
    

    }
  

    params.RequestItems[tableClients].push({
      PutRequest: {

        Item: _item


      }
    })

  }

  console.log("Post parm string: ", JSON.stringify(params));

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