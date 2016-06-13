angular.module('app', [])

.factory('Library', ['$window',function($window){
  return {
    calendar : $window.Calendar,
    direction : $window.Direction
  };
}])

.factory('Direction', ['$window',function($window){
  return $window.Calendar;
}])

.controller('appController', ['$scope', '$http', 'Library', function($scope, $http, Library) {
    $scope.calendarEvents = new Map();

    console.log($scope.calendarEvents);

    var calendar = new Library.calendar();
    var direction = Library.direction;

    if($scope.calendarEvents.size === 0){
      $scope.isLoading = true;
      calendar.getGoogleCalendarData().then(function(data){
        var calendarItems = JSON.parse(data).items;
        var organized = calendar.organizeGoogleData(calendarItems);
        console.log(organized);

        $scope.isLoading = false;
        $scope.$apply();
        // return organized;
      });




    }




    // var direction = new Library.direction();

    $scope.addresses = [];

    $scope.haveValidAdress = false;

    $scope.getAddress = function(input) {

      $http.get('./google/address', {
        params: {
          input: input
        }
      }).then(function(response) {
        var predictions = response.data.predictions;

        if(predictions.length===0){
          $scope.addresses = [];
          $scope.haveValidAdress = false;
        }else{
          $scope.haveValidAdress = true;
        }

        predictions.forEach(function(content, index) {
          $scope.addresses[index] = content.description;
        });

      });

    };

    $scope.calculateTravelTime = function(){
      if(!$scope.haveValidAdress){alert('hello');}
      else{
        var origin = 'Rua Diomedes Trota, 349';
        var destiny = $scope.address;

        direction.getTravelTime(origin, destiny).then(function(timeValue){
          console.log(parseFloat(timeValue));
        }).catch(function(error){
          console.log(error);
        });
      }
    };
  },
]);
