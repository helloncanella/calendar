describe('Calendar', function() {
  var calendar,
    data,
    googleData,
    allEvents,
    meeting;

  beforeEach(function() {
    calendar = new Calendar();
    allEvents = new Map();
  });

  describe('Get organize data from google Calendar', function() {


    beforeAll(function(){
      var dummyData = [
        {
          start: {
            dateTime: new Date('Fri Jun 11 2016 15:00:00 GMT-0300 (BRT)').toISOString()
          },
          end: {
            dateTime: new Date('Fri Jun 11 2016 17:00:00 GMT-0300 (BRT)').toISOString()
          },
        }, {
          start: {
            dateTime: new Date('Fri Jun 12 2016 15:00:00 GMT-0300 (BRT)').toISOString()
          },
          end: {
            dateTime: new Date('Fri Jun 12 2016 17:00:00 GMT-0300 (BRT)').toISOString()
          },
        }, {
          start: {
            dateTime: new Date('Fri Jun 12 2016 15:00:00 GMT-0300 (BRT)').toISOString()
          },
          end: {
            dateTime: new Date('Fri Jun 12 2016 17:00:00 GMT-0300 (BRT)').toISOString()
          },
        }
      ];


      Calendar.prototype.getGoogleCalendarData = function() {
        return new Promise(function(resolve, reject){
          resolve(dummyData);
        });
      };



    });


    describe('turn response object from google calendar into map', function(){
      var organized, calendar, firstDay, secondDay;

      beforeEach(function(done){
        calendar = new Calendar();
        firstDay = new Date('Fri Jun 11 2016 15:00:00 GMT-0300 (BRT)').toDateString();
        secondDay = new Date('Fri Jun 12 2016 15:00:00 GMT-0300 (BRT)').toDateString();

        calendar.getGoogleCalendarData().then(function(data){
          organized = calendar.organizeGoogleData(data);
          done();
        });

      });


      it('verify if returned organized data is an Map', function() {
        expect(organized.constructor == Map).toBeTruthy();
      });

      it('verify if proposed days Jun 11, Jun 12 exists as key', function(){
        expect(organized.has(firstDay)).toBeTruthy();
        expect(organized.has(secondDay)).toBeTruthy();
      });

      it('verify number of keys for Jun 11, Jun 12 is correct', function(){
        expect(organized.get(firstDay).length).toBe(1);
        expect(organized.get(secondDay).length).toBe(2);
      });

    });




  });

  describe('Scheduling in a unique day', function() {

    var local,
      duration;

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

    it('test with no events in the same day', function(done) {

      allEvents.set(new Date("2016-06-10T11:00:00.000Z").toDateString(), []);

      calendar.getClassPossibilities(meeting, allEvents).then(function(map) {
        var classPossibilities = map.get(new Date("2016-06-10T11:00:00.000Z").toDateString());

        expect(classPossibilities.length).toBe(11);
        done();
      });
    });

    it('test with one in the same day', function(done) {

      allEvents.set(new Date("2016-06-10T11:00:00.000Z").toDateString(), [
        {
          location: 'II',
          start: {
            dateTime: new Date('Fri Jun 10 2016 15:00:00 GMT-0300 (BRT)').toISOString()
          },
          end: {
            dateTime: new Date('Fri Jun 10 2016 17:00:00 GMT-0300 (BRT)').toISOString()
          },
        }
      ]);

      calendar.getClassPossibilities(meeting, allEvents).then(function(map) {
        var classPossibilities = map.get(new Date("2016-06-10T11:00:00.000Z").toDateString());

        expect(classPossibilities.length).toBe(5);
        done();
      });
    });

    it('star', function(done) {

      allEvents.set(new Date("2016-06-10T11:00:00.000Z").toDateString(), [
        {
          location: 'II',
          start: {
            dateTime: new Date('Fri Jun 10 2016 15:00:00 GMT-0300 (BRT)').toISOString()
          },
          end: {
            dateTime: new Date('Fri Jun 10 2016 17:00:00 GMT-0300 (BRT)').toISOString()
          },
        }
      ]);

      calendar.getClassPossibilities(meeting, allEvents).then(function(map) {
        var classPossibilities = map.get(new Date("2016-06-10T11:00:00.000Z").toDateString());

        classPossibilities.forEach(function(possibility){
          expect(possibility.hasOwnProperty('start')).toBeTruthy();
          expect(possibility.hasOwnProperty('end')).toBeTruthy();
        });

        done();
      });
    });


  });
});
