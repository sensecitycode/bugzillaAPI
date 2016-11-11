// Dependencies
var express = require('express');
var router = express.Router();
// var fs = require('fs');
var request = require('request');

var config = require('app-config');

//Bugzilla login
var bugUrl = config.config.bugUrl;

var loginData =
{
"method": "User.login",
"params": [{"login":config.config.login,"password":config.config.pwd}],
"id": 1
};

var bugToken="";
request({
    url: bugUrl,
    method: "POST",
    json: loginData
}, function (error, response, body) {
        if (!error && response.statusCode === 200) {
						bugToken = body.result.token;
						var test = loginData.params.login;
						console.log("Login in bugzilla as: "+loginData.params[0].login);
						console.log("And assigned token: "+body.result.token);
        }
        else {
            console.log("error: " + error);
            console.log("response.statusCode: " + response.statusCode);
            console.log("response.statusText: " + response.statusText);
        }
});



//POST router
router.post('/search', function (req,res){
  //  console.log("/update router");
   req.body.params[0].token = bugToken;
   
   console.log(req.body);
   
   request({
    url: config.config.bugUrl,
    method: "POST",
    headers: {'content-type': 'application/json'},
    json: req.body
    }, function (error, response, body) {
        if (!error && response.statusCode === 200) {

            console.log(req.body);
            if (response.body.result !== null )
            {
				console.log("<<<<   BUGS  ================>"+response.body.result);
              console.log("problem reported " + response.body.result.bugs.length);
              res.send(response.body.result.bugs);
            }
            else
            {
              console.log(response.body.error);
              res.send([response.body.error]);
            }

        }
        else {
            console.log("error: " + error);
        }
    });
});










// Return router
module.exports = router;
