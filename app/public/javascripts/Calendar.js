function Calendar(){}

Calendar.prototype.fetchGoogleData = function(url){

  return new Promise(function(resolve,reject){
    var xhttp = new XMLHttpRequest();
    var address = url || '/api/calendar';

    xhttp.onreadystatechange = function(){
      if(xhttp.readyState==4 && xhttp.status ==200){
        resolve({status:200, data: xhttp.response});
      }else{
        resolve({status:403});
      }
    };

    xhttp.open('GET', address, true);
    xhttp.send();

  });
};


Calendar.prototype.getStartPossibilities = function(meeting){
  var self = this, startPossibilities = [], startHour,lastStartHour;

  var lastCommitment = this.events[0];
  var nextCommitment = this.events[1];

  var come = Direction.getTravelTime(lastCommitment.local, meeting.local);
  var go = Direction.getTravelTime(meeting.local,nextCommitment.local);

  return Promise.all([come,go]).then(function(travelTime){
    //time to get to the first commitment from client local
    var comeTime = travelTime[0];

    //time to get to the last commitment
    var goTime = travelTime[1];

    lastCommitment.end.hour = new Date(lastCommitment.end.dateTime).getHours();
    nextCommitment.start.hour = new Date(nextCommitment.start.dateTime).getHours();

    var time = lastCommitment.end.hour+comeTime+meeting.duration.total()+goTime;

    while(time<=nextCommitment.start.hour){
      startHour  = time-(meeting.duration.total()+goTime);

      if(startPossibilities.length===0 || 1<=(startHour-lastStartHour)){
        startPossibilities.push(startHour);
        lastStartHour = startHour;
      }
      time += 0.5;
    }


    return(startPossibilities);
  });

};
