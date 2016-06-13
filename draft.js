Calendar.prototype.getClassPossibilities = function(meeting, allEvents) {

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


lastCommitment = {
  end: {
    dateTime:new Date(day).setHours(Day.start.hour, Day.start.minute)
  }
};

nextCommitment = {
  start:{
    dateTime: new Date(day).setHours(Day.end.hour, Day.end.minute)
  }
};
