import { resolve } from 'rsvp';
import Service from '@ember/service';

export default Service.extend({
  request() {
    return resolve({
      msg: "Almost finished... We need to confirm your email address. To complete the subscription process, please click the link in the email we just sent you.",
      result: "success"
    });
  }
});
