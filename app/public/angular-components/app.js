angular.module('app', ['ngLocale']).factory('Library', [
  '$window',
  function($window) {
    return {
      calendar: $window.Calendar,
      direction: $window.Direction,
      classInformation: $window.ClassInformation,
      dayInformation: $window.DayInformation
    };
  },
]).factory('Direction', [
  '$window',
  function($window) {
    return $window.Calendar;
  },
]).controller('appController', [
  '$scope',
  '$http',
  'Library',
  function($scope, $http, Library) {

    $scope.days = [];

    var dayInformation = Library.dayInformation;
    var calendar = new Library.calendar(dayInformation);
    $scope.calendarEvents = new Map();

    if ($scope.calendarEvents.size === 0) {
      $scope.calendarIsLoading = true;
      calendar.getGoogleCalendarData().then(function(data) {
        var calendarItems = JSON.parse(data).items;
        var organized = calendar.organizeGoogleData(calendarItems);

        $scope.calendarIsLoading = false;
        $scope.$apply();

        $scope.calendarEvents = organized;

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

    $scope.calculateAvailability = function(address) {
      $scope.chosenAddress = true;
      $scope.address = address;
      var allEvents = $scope.calendarEvents;
      var meeting = new Meeting(address, Library.classInformation.duration);

      return new Promise(function(resolve, reject) {
        var now = new Date();

        var today = {
          year: now.getFullYear(),
          month: now.getMonth(),
          day: now.getUTCDate()
        };

        for (var i = 0; i < 14; i++) {
          $scope.days[i] = new Date(today.year, today.month, today.day + i);
          var dateString = $scope.days[i].toDateString();

          if (!allEvents.has(dateString)) {
            allEvents.set(dateString, []);
          }

        }

        console.log(allEvents.size);
        console.log(meeting);
        calendar.getClassPossibilities(meeting, allEvents).then(function(classPossibilities) {
          $scope.calculatingAvailability = false;
          $scope.$apply();
          console.log(classPossibilities);
        });

      });

    };


  },
]);
