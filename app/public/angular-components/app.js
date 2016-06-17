angular.module('app',[])

.factory('Library', ['$window',function($window){
  return{
    calendar: $window.Calendar,
    dayInformation: $window.dayInformation
  };
}])

.controller('appController', ['$scope','$http', 'Library', function($scope,$http,Library){
  $scope.locationInput =  '';
  $scope.calculatingAvailability = false;


  $scope.setDaysRow = function (numberOfDays) {

    if(!numberOfDays){
      numberOfDays = 14;
    }

    $scope.days = [];
    var now = new Date();

    var today = {
      year: now.getFullYear(),
      month: now.getMonth(),
      day: now.getUTCDate()
    };

    for(var i = 0; i<numberOfDays; i++){
      $scope.days.push(new Date(today.year, today.month, today.day+i).toString());
    }
  };

  // $scope.donwnloadAgenda = function(){
  //   return new Promise(function(resolve, reject){
  //     $http.get('/agenda').then(function(data){
  //       resolve();
  //     }).then(function(){
  //       $scope.downloadingAgenda = false;
  //     });
  //   });
  // };

  $scope.selectAddress = function(address){
    $scope.suggestions = [];
    $scope.chosenAddress = address;
    $scope.calculateAvailability();
  };

  $scope.calculateAvailability = function(){
    return new Promise(function (resolve, reject) {
      $scope.calculatingAvailability = true;

      var calendar = new Library.calendar(Library.dayInformation);
      calendar.getGoogleData().then(function(){
        $scope.$apply();
        resolve();
      });

    }).then(function(){
      $scope.calculatingAvailability = false;
      $scope.setDaysRow();
      $scope.$apply();
    });
  };

  $scope.lookForAddress = function(){
    return new Promise(function(resolve,reject){
      $http({
        method: 'get',
        url: '/address',
        params: {
          input:$scope.locationInput
        }
      }).then(function(response){
        $scope.suggestions = [];

        var predictions = response.data.predictions;

        predictions.forEach(function(content, index){
          $scope.suggestions[index] = content.description;
        });

        resolve();

      });
    });




  };
}])

;
