import { resolve } from 'rsvp';
import Service from '@ember/service';

export default Service.extend({
  request() {
    return resolve({
      msg: "0 - Please enter a value",
      result: "error"
    });
  }
});
