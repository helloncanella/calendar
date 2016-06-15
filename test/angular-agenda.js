describe('Scheduling class', function () {

  var scope, ctrl;

  beforeEach(module('app'));

  beforeEach(inject(function($controller, $rootScope){
    scope = $rootScope.$new();
    ctrl = $controller('appController',{$scope:scope});
  }));

  describe('address finder', function () {
    describe('suggestions', function () {
      it('not show if input is empty', function () {
        scope.lookForAddress().then(function(){
          expect(scope.suggestions.length).toBe(0);
        });
      });

      xit('show when the input isn\'t empty',function(){
        expect(scope.suggestions.length).toEqual(0);
        scope.locationInput = 'Rua da';
        var camilo = scope.lookForAddress();
        expect(scope.suggestions.length).toBeGreaterThan(0);
      });
    });




    describe('suggestions when clicked', function () {
      it('set the address as chosen', function () {

      });
      it('it disapears', function () {

      });
      it('it triggers the agenda loading', function () {

      });
    });
  });

  describe('load spinner', function () {
    describe('agenda loader', function () {
      it('works when the the calendar events isn\'t downloaded', function () {
      });
    });
    describe('availability loader', function () {
      it('works when the the availability isn\'t calculated', function () {
      });
    });
  });

  describe('agenda', function () {
    it('just appears when the address is chose', function () {

    });

    describe('dayLines', function () {
      it('shows 15 from now', function () {

      });

      describe('day', function () {
        it('when clicked, show row of respective availability', function () {

        });
      });
    });
    describe('availability row', function () {
      it('is shown when the respective day is chosen', function () {

      });
    });
  });
  describe('schedule button', function () {
    it('if a day is chosen, when clicked trigger the process of scheduling', function () {

    });
  });

  describe('success page', function () {
    it('when the class is scheduled with success', function () {

    });
  });

  describe('error page', function () {
    it('when no class is arranged', function () {

    });
  });

});
