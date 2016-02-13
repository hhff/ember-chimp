import Ember from 'ember';

export default Ember.Service.extend({
  request() {
    return Ember.RSVP.resolve({
      msg: "Almost finished... We need to confirm your email address. To complete the subscription process, please click the link in the email we just sent you.",
      result: "success"
    });
  }
});
