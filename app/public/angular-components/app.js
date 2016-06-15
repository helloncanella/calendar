angular.module('app',[])

.controller('appController', ['$scope','$http',function($scope,$http){
  $scope.locationInput =  '';
  $scope.agendaIsLoading = false;

  $scope.selectAddress = function(address){
    $scope.suggestions = [];
    $scope.chosenAddress = address;
    $scope.calculateAvailability();
  };

  $scope.calculateAvailability = function(){
    return new Promise(function (resolve, reject) {
      $scope.agendaIsLoading = true;
      $scope.$apply();
      resolve();
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
        var predictions = response.data.predictions;
        $scope.suggestions = [];

        predictions.forEach(function(content, index){
          $scope.suggestions[index] = content.description;
        });

        resolve();

      });
    });




  };
}])

;
