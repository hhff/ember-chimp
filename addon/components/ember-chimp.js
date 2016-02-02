import Ember from 'ember';

const {
  get,
  set,
  inject: { service },
  computed,
  Component
} = Ember;

function endsWith(string, suffix) {
  return string.indexOf(suffix, string.length - suffix.length) !== -1;
}
  
export default Component.extend({
  classNames: 'ember-chimp',
  classNameBindings: ['chimpState'],
  attributeBindings: ['novalidate'],
  novalidate: true,
  tagName: "form",

  ajax: service(),

  chimpState: 'idle',
  chimpSays: null,
  action: null,
  value: "",
  buttonText: "Submit",
  loadingText: "Loading...",

  responses: {
    success: 'Almost finished... We need to confirm your email address. To complete the subscription process, please click the link in the email we just sent you.',
    error: 'Oops, something went wrong.  Please try again.',
    invalidError: 'Please enter a valid email.',
    attemptsError: "Too many subscribe attempts for this email address. Please try again in about 5 minutes.",
  },

  isLoading: computed.equal('chimpState', 'loading'),

  _buildData() {
    const data = {};

    let formData = this.$().serializeArray();
    let item;

    for (item of formData) {
      data[item.name] = item.value;
    }

    return data;
  },

  actions: {
    valueDidChange() {
      set(this, 'chimpState', 'idle');
      set(this, 'chimpSays', null);
    }
  },

  submit(e) {
    e.preventDefault();
    let msg;
    
    if (get(this, 'value').length) {
      set(this, 'chimpState', 'loading');
      set(this, 'chimpSays', get(this, 'loadingText'));

      let formAction = get(this, 'formAction'),
          data = this._buildData();

      if (!formAction) { 
        throw new Error("Ember Chimp: Please pass your Mailchimp list formAction to the ember-chimp component"); 
      } else {
        formAction = formAction.replace('/post?', '/post-json?').concat('&c=?');
      }

      let request = get(this, 'ajax').request(formAction, {
        data: data,
        dataType: 'jsonp'
      });

      request.then(response => {
        if (response.result === 'success') {
          this.set('value', null);
          msg = this.get('responses.success');
        } else {
          if (!isNaN(parseInt(response.msg.charAt(0)))) {
            msg = this.get('responses.invalidError');
          } else if (endsWith(response.msg, "(#6592)")) {
            msg = this.get('responses.attemptsError');
          } else {
            msg = this.get('responses.error');
          }
        }

        this.set('chimpState', response.result);
        this.set('chimpSays', msg);
      });
        
      request.catch(() => {
        this.set('chimpSays', get(this, 'responses.error'));
        this.set('chimpState', 'error');
      });
      
      if (this.get('action')) { this.sendAction('action', request); }
    } else {
      this.set('chimpSays', get(this, 'responses.invalidError'));
      this.set('chimpState', 'error');
    }
  }
});
