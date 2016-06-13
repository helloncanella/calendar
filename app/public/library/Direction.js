var Direction = {

  getTravelTime: function(origin, destiny) {

    return new Promise(function(resolve, reject) {
      origin = encodeURI(origin);
      destiny = encodeURI(destiny);
      var http = new XMLHttpRequest();

      var url = "./google/traveltime?origin="+origin+"&destiny="+destiny;


      http.onreadystatechange = function() {
        if (http.status == 200 && http.readyState==4) {
          resolve(http.responseText);
        } 
      };

      http.open("GET", url, true);
      http.send();
    });

  }
};
