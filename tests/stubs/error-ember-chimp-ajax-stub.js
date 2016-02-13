import Ember from 'ember';

export default Ember.Service.extend({
  request() {
    return Ember.RSVP.resolve({
      msg: "0 - Please enter a value",
      result: "error"
    });
  }
});
