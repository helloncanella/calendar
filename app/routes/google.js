var express = require('express');
var router = express.Router();
var google = require('googleapis');
var calendar = google.calendar('v3');

/* GET google calendar data */
router.get('/calendar', function(req, res, next) {
  getCalendarData().then(function(calendar){
    res.send(calendar);
    console.log('AQUI');
  }).catch(function(error){
    console.log('TECO',error);
    res.sendStatus(403);
  });
});

router.get('/direction', function(req, res, next){
  var origin = req.query.origin;
  var destiny = req.query.destiny;

  getTravelTime(origin, destiny).then(function(travelTime){
    res.send(travelTime);
  }).catch(function(error){
    res.sendStatus(500);
  });

});


function getTravelTime (){

}


function getCalendarData() {
  return new Promise(function(resolve, reject){
    authorize().then(function(authClient){
      calendar.events.list({
        auth: authClient,
        calendarId: 'primary'
      }, function(err, resp){
        if(err){
          console.log(err);
          reject(err);
        }else{
          console.log(resp);
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

module.exports = router;
