describe('Calendar', function() {
  var calendar,
    data,
    googleData;

  describe('Testing arragenment system', function() {

    var local,
      duration,
      meeting;

    beforeAll(function() {
      calendar = new Calendar();

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

      calendar.events = [
        {
          location: 'Rua Diomedes Trota - Ramos',
          end: {
            dateTime: new Date('Fri Jun 10 2016 08:00:00 GMT-0300 (BRT)').toISOString()
          },
        }, {
          location: 'Rua Diomedes Trota - Ramos',
          start: {
            dateTime: new Date('Fri Jun 10 2016 23:00:00 GMT-0300 (BRT)').toISOString()
          },
        },
      ];

      calendar.getStartPossibilities(meeting).then(function(startPossibilities) {
        expect(startPossibilities.length).toBe(11);
        done();
      });
    });

    it('test with two events in the same day', function(done) {

      calendar.events = [
        {
          location: 'Rua Diomedes Trota - Ramos',
          end: {
            dateTime: new Date('Fri Jun 10 2016 08:00:00 GMT-0300 (BRT)').toISOString()
          },
        }, {
          location: 'Rua Diomedes Trota - Ramos',
          start: {
            dateTime: new Date('Fri Jun 10 2016 23:00:00 GMT-0300 (BRT)').toISOString()
          },
        },
      ];

      calendar.getStartPossibilities(meeting).then(function(startPossibilities) {
        expect(startPossibilities.length).toBe(11);
        done();
      });
    });

  });
});
