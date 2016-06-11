var express = require('express');
var api = express.Router();
var google = require('googleapis');
var calendar = google.calendar('v3');

/* GET home page. */
api.get('/calendar', function(req, res, next) {
  fetchCalendar().then(function(calendar){
    console.log(calendar);
    res.send(calendar);
  }).catch(function(error){
    res.sendStatus(403);
  });
});

function fetchCalendar() {
  return new Promise(function(resolve, reject){
    authorize().then(function(authClient){
      calendar.events.list({
        auth: authClient,
        calendarId: 'primary'
      }, function(err, resp){
        if(err){
          reject(err);
        }else{
          resolve(resp);
        }
      });
    }).catch(function(error){
      console.log(error);
    });
  });
}

function authorize() {
  return new Promise(function(resolve, reject) {
    var
      ACCOUNT = 'server-server@avian-cogency-133523.iam.gserviceaccount.com',
      KEY = 'key.pem',
      SCOPE = ['https://www.googleapis.com/auth/calendar']
      ;

    var authClient = new google.auth.JWT(ACCOUNT, KEY, null,SCOPE, '');

    authClient.authorize(function(err, tokens){
      if(err){
        reject(err);
      }else{
        resolve(authClient);
      }
    });

    resolve(authClient);
  });
}

module.exports = api;
