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
        }
      };

      meeting = new Meeting(local, duration);

    });

    it('first test', function(done) {

      calendar.events = [
        {
          location: 'Rua Diomedes Trota - Ramos',
          end: {
            dateTime: ISODateString(new Date('Fri Jun 10 2016 08:00:00 GMT-0300 (BRT)'))
          }
        }, {
          location: 'Rua Diomedes Trota - Ramos',
          start: {
            dateTime: ISODateString(new Date('Fri Jun 10 2016 23:00:00 GMT-0300 (BRT)'))
          }
        },
      ];

      calendar.getStartPossibilities(meeting).then(function(startPossibilities) {
        expect(startPossibilities.length).toBe(19);
        done();
      });
    });
  });
});

/* use a function for the exact format desired... */
function ISODateString(d) {
  function pad(n) {
    return n < 10
      ? '0' + n
      : n;
  }
  return d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + ':' + pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds()) + 'Z'
}

var d = new Date();
