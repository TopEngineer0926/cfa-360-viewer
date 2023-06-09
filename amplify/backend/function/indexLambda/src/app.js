/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/




var express = require('express')
var bodyParser = require('body-parser')
var awsServerlessExpressMiddleware = require('aws-serverless-express/middleware')

// declare a new express app
var app = express()
app.use(bodyParser.json())
app.use(awsServerlessExpressMiddleware.eventContext())

// Enable CORS for all methods
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "*")
  next()
});


var AWS = require('aws-sdk');
var docClient = new AWS.DynamoDB.DocumentClient();

app.get('/index/users', function (req, res) {
  docClient.scan({
    TableName: 'cfa-dev-users',
    FilterExpression: "#user_status = :statusACTIVE OR #user_status = :statusCONFIRMED",
    ExpressionAttributeValues: {
      ':statusACTIVE': 'ACTIVE',
      ':statusCONFIRMED': 'CONFIRMED'
    },
    ExpressionAttributeNames: {
      "#user_status": "status"
    }
  }, function (err, data) {
    if (err) {
      console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
      res.status(500).json(err)
    } else {
      res.json(data.Items);
    }
  });

});

app.post('/index/design-inventory', function (req, res) {
  var params = {
    TableName: 'cfa-dev-inventory',
    FilterExpression: '#cfaPrototypeName = :prototypeName and #cfaPrototypePortfolio = :prototypeEdition',
    ExpressionAttributeValues: {
      ':prototypeName': req.body.prototypeName,
      ':prototypeEdition': req.body.prototypeEdition
    }, ExpressionAttributeNames: {
      "#cfaPrototypeName": "cfaPrototypeName",
      "#cfaPrototypePortfolio": "cfaPrototypePortfolio",
    }
  };

  docClient.scan(params, function (err, data) {
    if (err) {
      console.error("Unable to scan the table. Error JSON:", JSON.stringify(err, null, 2));
      res.status(500).json(err)
    } else {
      res.json(data.Items);
    }
  });

});

// app.get('/index/auth', function (req, res) {
//   docClient.get({
//     TableName: 'cfa-dev-users',
//     Key: { id: req.query.id }
//   }, function (err, data) {
//     if (err) {
//       res.json({ err: err, url: req.url, id: req.query.id });
//     } else {
//       res.json({ success: data.Item, url: req.url, id: req.query.id });
//     }
//   });

// });


// /**********************
//  * Example get method *
//  **********************/

// app.get('/index', function(req, res) {
//   // Add your code here
//   res.json({success: 'get call succeed!', url: req.url});
// });

// app.get('/index/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'get call succeed!', url: req.url});
// });

// /****************************
// * Example post method *
// ****************************/

// app.post('/index', function(req, res) {
//   // Add your code here
//   res.json({success: 'post call succeed!', url: req.url, body: req.body})
// });

// app.post('/index/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'post call succeed!', url: req.url, body: req.body})
// });

// /****************************
// * Example put method *
// ****************************/

// app.put('/index', function(req, res) {
//   // Add your code here
//   res.json({success: 'put call succeed!', url: req.url, body: req.body})
// });

// app.put('/index/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'put call succeed!', url: req.url, body: req.body})
// });

// /****************************
// * Example delete method *
// ****************************/

// app.delete('/index', function(req, res) {
//   // Add your code here
//   res.json({success: 'delete call succeed!', url: req.url});
// });

// app.delete('/index/*', function(req, res) {
//   // Add your code here
//   res.json({success: 'delete call succeed!', url: req.url});
// });

app.listen(3000, function () {
  console.log("App started")
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app
