angular.module('app',[])

.controller('appController', ['$scope','$http',function($scope,$http){
  $scope.locationInput =  '';
  $scope.calculatingAvailability = false;
  $scope.downloadingAgenda = true;

  $scope.donwnloadAgenda = function(){
    return new Promise(function(resolve, reject){
      $http.get('/agenda').then(function(data){
        resolve();
      }).then(function(){
        $scope.downloadingAgenda = false;
      });
    });
  };

  $scope.selectAddress = function(address){
    $scope.suggestions = [];
    $scope.chosenAddress = address;
    $scope.calculateAvailability();
  };

  $scope.calculateAvailability = function(){
    return new Promise(function (resolve, reject) {
      $scope.calculatingAvailability = true;
      $scope.$apply();
      resolve();
    }).then(function(){
      $scope.calculatingAvailability = false;
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
