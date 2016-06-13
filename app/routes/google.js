var express = require('express');
var router = express.Router();
var google = require('googleapis');
var calendar = google.calendar('v3');
var request = require('request');

/* GET google calendar data */
router.get('/calendar', function(req, res, next) {
  getCalendarData().then(function(calendar){
    res.send(calendar);
  }).catch(function(error){
    res.sendStatus(403);
  });
});

router.get('/traveltime', function(req, res, next){
  var origin = encodeURI(req.query.origin);
  var destiny = encodeURI(req.query.destiny);
  var key = 'AIzaSyABG4cZ3QZDOm_d9BDvTR3r2kBPK5-uFGE';
  var departureTime = Math.round(new Date().setHours(14)/1000); //set departure time to 14h
  var url= "https://maps.googleapis.com/maps/api/directions/json?origin="+origin+"&destination="+destiny+"&mode=transit&region=br&region=br&language=pt_BR&alternatives=true&key=+"+key+"&departure_time="+departureTime;

  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      if(JSON.parse(body).routes.length>0){
        var travelTime = JSON.parse(body).routes[0].legs[0].duration.value/3600;
        res.send(travelTime.toString());
      }else {
        res.sendStatus(500);
      }
    }
  });
});

router.get('/address', function(req, res, next) {

  var key = 'AIzaSyCyPG9VnaE5zYA8r8fvQDmjjlIXiQRtoE4',
    input = encodeURI(req.query.input);
    console.log(req.query);

  request('https://maps.googleapis.com/maps/api/place/autocomplete/json?key=' + key + '&input=' + input, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(body); // Show the HTML for the Google homepage.
    }
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
