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

    var calendar = new Library.calendar();

    if($scope.calendarEvents.size === 0){
      $scope.calendarIsLoading = true;
      calendar.getGoogleCalendarData().then(function(data){
        var calendarItems = JSON.parse(data).items;
        var organized = calendar.organizeGoogleData(calendarItems);

        $scope.calendarIsLoading = false;
        $scope.$apply();
      });

    }



    $scope.sugestedAdresses = [];
    $scope.chosenAddress = false;

    $scope.getAddress = function(input) {

      $scope.chosenAddress = false;

      $http.get('./google/address', {
        params: {
          input: input
        }
      }).then(function(response) {
        var predictions = response.data.predictions;

        predictions.forEach(function(content, index) {
          $scope.sugestedAdresses[index] = content.description;
        });

      });

    };

    $scope.calculatingAvailability = true;

    $scope.calculateTravelTime = function(destiny){


      var direction = Library.direction;

      var origin = 'Rua Diomedes Trota, 349';
      $scope.address = destiny;
      $scope.chosenAddress = true;
      $scope.sugestedAdresses = [];

      direction.getTravelTime(origin, destiny).then(function(timeValue){
        console.log(parseFloat(timeValue));
      }).catch(function(error){
        console.log(error);
      });
    };
  },
]);
