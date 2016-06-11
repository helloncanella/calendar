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
  var self = this, startPossibilities = [];

  var lastCommitment = this.events[0];
  var nextCommitment = this.events[1];

  var come = Direction.getTravelTime(lastCommitment.local, meeting.local);
  var go = Direction.getTravelTime(meeting.local,nextCommitment.local);

  return Promise.all([come,go]).then(function(travelTime){
    var comeTime = travelTime[0];
    var goTime = travelTime[1];

    var time = lastCommitment.start.end+comeTime+meeting.duration.total()+goTime;

    while(time<=nextCommitment){

    }


    return(data);
  });

};
