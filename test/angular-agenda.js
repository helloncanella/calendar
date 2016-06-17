describe('Scheduling class', function() {

  var scope,
    http,
    ctrl,
    window;

  beforeEach(module('app'));


  beforeEach(inject(function($controller, $rootScope, $window,$httpBackend) {
    http = $httpBackend;
    scope = $rootScope.$new();
    ctrl = $controller('appController', {$scope: scope});
    window = $window;
  }));

  describe('address finder', function() {
    var request;

    describe('suggestions', function() {
      it('not show if input is empty', function(done) {
        scope.locationInput = '';
        setRequest(scope.locationInput);

        scope.lookForAddress().then(function() {
          expect(scope.suggestions.length).toBe(0);
          done();
        });

        http.flush();
      });

      it('show when the input is not empyt', function(done) {
        scope.locationInput = 'Grajaú';
        setRequest(scope.locationInput);

        scope.lookForAddress().then(function() {
          expect(scope.suggestions.length).toBe(2);
          done();
        });

        http.flush();

      });

      function setRequest(locationInput) {
        var response;

        locationInput = window.encodeURI(locationInput).replace(/%20/g, "+");

        if (locationInput) {
          response = {
            predictions: [
              {
                'description': ''
              }, {
                'description': ''
              },
            ]
          };
        } else {
          response = {
            predictions: []
          };
        }

        response = JSON.stringify(response);
        http.when('GET', '/address?input=' + locationInput).respond(200, response);
      }

    });

    describe('suggestions when clicked', function() {
      var address;

      beforeEach(function() {
        spyOn(scope, 'calculateAvailability').and.callThrough();
        address = 'Rua das Marrecas';
        scope.suggestions = ['', '',]; //simulate the existence of sugestions
        scope.calculatingAvailability = false;
        scope.selectAddress(address);
      });

      it('set chosen address', function() {
        scope.selectAddress(address);
        expect(scope.chosenAddress).toBe(address);
      });

      it('it disapears', function() {
        scope.selectAddress(address);
        expect(scope.suggestions.length).toBe(0);
      });

      it('it triggers the calculation of availability', function(done) {
        expect(scope.calculatingAvailability).toBeTruthy();
        expect(scope.calculateAvailability).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('load spinner', function() {
    describe('agenda loader', function() {
      it('works when the the calendar events isn\'t downloaded', function() {
        expect(scope.downloadingAgenda).toBeTruthy();
      });
      it('stops when the the calendar events is downloaded', function(done) {
        http.when('GET','/agenda').respond(200,'{"items":[]}');

        scope.donwnloadAgenda().then(function() {
          expect(scope.downloadingAgenda).toBeFalsy();
          done();
        });

        http.flush();
      });
    });
    describe('availability loader', function() {
      it('works when the the availability is being loaded', function() {
        // already tested
      });
      it('not works when the the availability is calculated', function(done) {
        scope.calculatingAvailability = true;
        scope.calculateAvailability().then(function(){
          expect(scope.calculatingAvailability).toBeFalsy();
          done();
        });
      });
    });
  });

  describe('agenda', function() {
    xit('just appears when the availability is ', function() {});

    describe('days row', function() {

      it('is just calculated when the availability is ready', function(done){
        spyOn(scope, 'setDaysRow').and.callThrough();

        scope.calculateAvailability().then(function(){
          expect(scope.setDaysRow).toHaveBeenCalled();
          done();
        });
      });

      describe('calculation', function(){
        var numberOfDays;

        beforeEach(function(){
          scope.setDaysRow();
        });

        describe('by default', function(){
          it('shows 14 days', function() {
            expect(scope.days.length).toBe(14);
          });

          it('shows 14 subsequents days', function(){
            var days = scope.days;

            var period = Math.round((new Date(days[days.length-1]).getTime() - new Date(days[0]).getTime())/(1000*3600*24))+1;

            expect(period).toBe(14);
          });
        });
      });

      describe('day', function() {

        describe('when clicked', function(){

        });

        it('show row of respective availability', function() {

          // var downloadedCalendar =

        });
      });
    });
    describe('availability row', function() {
      it('is shown when the respective day is chosen', function() {});
    });
  });
  describe('schedule button', function() {
    it('if a day is chosen, when clicked trigger the process of scheduling', function() {});
  });

  describe('success page', function() {
    it('when the class is scheduled with success', function() {});
  });

  describe('error page', function() {
    it('when no class is arranged', function() {});
  });
});
