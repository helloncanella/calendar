describe('Calendar', function() {
  var calendar,
    data,
    googleData,
    meeting;

  beforeEach(function(){
    calendar = new Calendar();
  });

  describe('Testing arragenment system for the same day', function() {

    var local, duration;

    beforeAll(function() {

      Direction.getTravelTime = function() {
        return new Promise(function(resolve, reject) {
          resolve(1);
        });
      };

      local = 'Rua Monsenhor Felix, 39. Humaitá';

      duration = {
        value: 2,
        error: 1,
        total: function() {
          return this.value + this.error;
        },
      };

      meeting = new Meeting(local, duration);

    });

    it('test with two events in the same day', function(done) {

      var events = [
        {
          location: 'Rua Diomedes Trota - Ramos',
          end: {
            dateTime: new Date('Fri Jun 10 2016 08:00:00 GMT-0300 (BRT)').toISOString()
          },
        },
        {
          location: 'Rua Diomedes Trota - Ramos',
          start: {
            dateTime: new Date('Fri Jun 10 2016 23:00:00 GMT-0300 (BRT)').toISOString()
          },
        },
      ];

      calendar.getStartPossibilities(meeting, events).then(function(startPossibilities) {
        expect(startPossibilities.length).toBe(11);
        done();
      });
    });

    it('test with three events in the same day', function(done) {

      var events = [
        {
          location: 'I',
          end: {
            dateTime: new Date('Fri Jun 10 2016 08:00:00 GMT-0300 (BRT)').toISOString()
          },
        },
        {
          location: 'II',
          start: {
            dateTime: new Date('Fri Jun 10 2016 15:00:00 GMT-0300 (BRT)').toISOString()
          },
          end: {
            dateTime: new Date('Fri Jun 10 2016 17:00:00 GMT-0300 (BRT)').toISOString()
          },
        },
        {
          location: 'III',
          start: {
            dateTime: new Date('Fri Jun 10 2016 23:00:00 GMT-0300 (BRT)').toISOString()
          },
        },
      ];

      calendar.getStartPossibilities(meeting, events).then(function(startPossibilities) {
        expect(startPossibilities.length).toBe(5);
        done();
      });
    });



  });
});
