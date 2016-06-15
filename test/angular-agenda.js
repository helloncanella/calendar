describe('Scheduling class', function() {

  var scope,
    http,
    ctrl,
    window;

  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope, $window) {
    scope = $rootScope.$new();
    ctrl = $controller('appController', {$scope: scope});
    window = $window;
  }));

  describe('address finder', function() {
    var request;

    beforeEach(inject(function($httpBackend) {
      http = $httpBackend;
    }));

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

        if(locationInput){
          response = {predictions:[{'description':''},{'description':''}]};
        }else{
          response = {predictions:[]};
        }

        response = JSON.stringify(response);
        http.when('GET', '/address?input=' + locationInput).respond(200, response);
      }

    });

    describe('suggestions when clicked', function() {
      var address;

      beforeEach(function(){
        spyOn(scope,'calculateAvailability').and.callThrough();
        address = 'Rua das Marrecas';
        scope.suggestions = ['','']; //simulate the existence of sugestions
        scope.agendaIsLoading = false;
        scope.selectAddress(address);
      });


      it('set chosen address', function(done) {
        expect(scope.chosenAddress).toBe(address);
        done();
      });

      it('it disapears', function(done) {
        expect(scope.suggestions.length).toBe(0);
        done();
      });

      it('it triggers the agenda loading', function(done) {
        expect(scope.calculateAvailability).toHaveBeenCalled();
        expect(scope.agendaIsLoading).toBeTruthy();
        done();
      });
    });
  });

  describe('load spinner', function() {
    describe('agenda loader', function() {
      it('works when the the calendar events isn\'t downloaded', function() {});
    });
    describe('availability loader', function() {
      it('works when the the availability isn\'t calculated', function() {});
    });
  });

  describe('agenda', function() {
    it('just appears when the address is chose', function() {});

    describe('dayLines', function() {
      it('shows 15 from now', function() {});

      describe('day', function() {
        it('when clicked, show row of respective availability', function() {});
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
