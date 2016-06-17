function Calendar(dayInformation) {
  this.dayInformation = dayInformation;
}

Calendar.prototype.getGoogleData = function(url) {

  console.log('aqui'); 

  return new Promise(function(resolve, reject) {
    var xhttp = new XMLHttpRequest();
    var address = url || '/google/calendar';

    xhttp.onreadystatechange = function() {

      if (xhttp.status == 200 && xhttp.readyState == 4) {
        resolve(xhttp.responseText);
      }
    };

    xhttp.open('GET', address, true);
    xhttp.send();

  });
};


Calendar.prototype.organizeGoogleData = function(data){

  var organizedData = new Map();

  data.forEach(function(item){
    var key = new Date(item.start.dateTime).toDateString();

    if(!organizedData.has(key)){
      organizedData.set(key,[item]);
    }else{
      var merged = organizedData.get(key).concat(item);
      organizedData.set(key, merged);
    }
  });

  return organizedData;
};



Calendar.prototype.getClassPossibilities = function(meeting, allEvents) {

  var self = this,
    tasks = [],
    Day = this.dayInformation;

  allEvents.forEach(function(dayEvents, day){
    var lastCommitment;

    var startDay = {
      location: Day.start.location,
      end: {
        dateTime:new Date(day).setHours(Day.start.hour, Day.start.minute)
      }
    };


    var endDay = {
      location: Day.end.location,
      start:{
        dateTime: new Date(day).setHours(Day.end.hour, Day.end.minute)
      }
    };


    dayEvents = [].concat(startDay, dayEvents, endDay);


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
      var classPossibilities = object.classPossibilities;

      if(!allStartPossibilities.get(day)){
        allStartPossibilities.set(day,classPossibilities);
      }else{
        var array = allStartPossibilities.get(day);
        var merged = array.concat(classPossibilities);

        allStartPossibilities.set(day,merged);
      }
    });

    return allStartPossibilities;
  });


};


function getTask(day, lastCommitment, nextCommitment, meeting) {
  return new Promise(function(resolve, reject) {

    var
      classPossibilities = [],
      startHour,
      lastStartHour;

    var
      come = Direction.getTravelTime(lastCommitment.location, meeting.location),
      go = Direction.getTravelTime(meeting.location, nextCommitment.location);


    Promise.all([come, go,]).then(function(travelTime) {

      //time to get to the first commitment from client local
      var comeTime = parseFloat(travelTime[0]);

      //time to get to the last commitment
      var goTime = parseFloat(travelTime[1]);

      nextCommitment.start.hour = new Date(nextCommitment.start.dateTime).getHours();
      lastCommitment.end.hour = new Date(lastCommitment.end.dateTime).getHours();

      var time = lastCommitment.end.hour + comeTime + meeting.duration.total() + goTime;
      while (time <= nextCommitment.start.hour) {
        startHour = time - (meeting.duration.total() + goTime);

        if (classPossibilities.length === 0 || 1 <= (startHour - lastStartHour)) {
          classPossibilities.push({start:startHour, end:startHour+meeting.duration.value});
          lastStartHour = startHour;
        }

        time += 0.5;
      }


      resolve({'day':day,'classPossibilities':classPossibilities});
    });
  });
}
