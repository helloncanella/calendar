angular.module('app',[])

.controller('appController', ['$scope',function($scope){
  $scope.suggestions = [];
  $scope.locationInput =  '';
  $scope.lookForAddress = function(){
    if(!$scope.locationInput){
      scope.suggestions = [];
    }else
  };
}])

;
