function Calendar() {}

Calendar.prototype.fetchGoogleData = function(url) {

  return new Promise(function(resolve, reject) {
    var xhttp = new XMLHttpRequest();
    var address = url || '/api/calendar';

    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        resolve({status: 200, data: xhttp.response,});
      } else {
        resolve({status: 403});
      }
    };

    xhttp.open('GET', address, true);
    xhttp.send();

  });
};





Calendar.prototype.getStartPossibilities = function(meeting, allEvents) {

  var self = this,
    tasks = [],
    lastCommitment;

  allEvents.forEach(function(dayEvents, day){
    dayEvents.forEach(function(event, index) {
      if (!lastCommitment) {
        lastCommitment = event;
      } else {
        var nextCommitment = event;

        tasks.push(getTask(day,lastCommitment, nextCommitment, meeting));

        lastCommitment = event;
      }
    }, self);
  });

  return Promise.all(tasks).then(function(daysStartPossibilities) {

    var allStartPossibilities = new Map();

    daysStartPossibilities.forEach(function(object){
      var day = object.day;
      var startPossibilities = object.startPossibilities;

      if(!allStartPossibilities.get(day)){
        allStartPossibilities.set(day,startPossibilities);
      }else{
        var array = allStartPossibilities.get(day);
        var merged = array.concat(startPossibilities);

        allStartPossibilities.set(day,merged);
      }
    });

    return allStartPossibilities;
  });


};

function getTask(day, lastCommitment, nextCommitment, meeting) {
  return new Promise(function(resolve, reject) {

    var
      startPossibilities = [],
      startHour,
      lastStartHour;

    var
      come = Direction.getTravelTime(lastCommitment.location, meeting.location),
      go = Direction.getTravelTime(meeting.location, nextCommitment.location);


    Promise.all([come, go,]).then(function(travelTime) {

      //time to get to the first commitment from client local
      var comeTime = travelTime[0];

      //time to get to the last commitment
      var goTime = travelTime[1];

      nextCommitment.start.hour = new Date(nextCommitment.start.dateTime).getHours();
      lastCommitment.end.hour = new Date(lastCommitment.end.dateTime).getHours();

      var time = lastCommitment.end.hour + comeTime + meeting.duration.total() + goTime;

      while (time <= nextCommitment.start.hour) {
        startHour = time - (meeting.duration.total() + goTime);

        if (startPossibilities.length === 0 || 1 <= (startHour - lastStartHour)) {
          startPossibilities.push(startHour);
          lastStartHour = startHour;
        }

        time += 0.5;
      }

      resolve({'day':day,'startPossibilities':startPossibilities});
    });
  });
}
