import Ember from 'ember';
import ajax from 'ic-ajax';

export default Ember.Component.extend({
  chimpState: 'idle',
  chimpSays: null,
  action: null,
  value: "",
  buttonText: "Submit",
  loadingText: "Loading...",
  classNames: 'ember-chimp',
  classNameBindings: ['chimpState'],
  tagName: "form",
  attributeBindings: ['novalidate'],
  novalidate: true,

  responses: {
    success: 'Almost finished... We need to confirm your email address. To complete the subscription process, please click the link in the email we just sent you.',
    error: 'Oops, something went wrong.  Please try again.',
    invalidError: 'Please enter a valid email.',
    attemptsError: "Too many subscribe attempts for this email address. Please try again in about 5 minutes.",
  },

  isLoading: Ember.computed('chimpState', function() {
    return this.get('chimpState') === 'loading' ? true : false;
  }),

  valueDidChange: Ember.observer('value', function() {
    this.set('chimpState', 'idle');
    this.set('chimpSays', null);
  }),

  _buildData() {
    const data = {};
    
    let formData = this.$().serializeArray();
    let item;

    for (item of formData) {
      data[item.name] = item.value;
    }

    return data;
  },

  endsWith(string, suffix) {
    return string.indexOf(suffix, string.length - suffix.length) !== -1;
  },

  submit(e) {
    e.preventDefault();
    let msg;

    if (this.get('value').length) {
      this.set('chimpState', 'loading');
      this.set('chimpSays', this.get('loadingText'));

      let _this      = this;
      let formAction = this.get('formAction');
      let data       = this._buildData();

      if (!formAction) { 
        throw new Error("Ember Chimp: Please pass your Mailchimp list formAction to the ember-chimp component"); 
      } else {
        formAction = formAction.replace('/post?', '/post-json?').concat('&c=?');
      }

      const request = ajax({
        url: formAction,
        data: data,
        dataType: 'jsonp'
      });
      
      request.then(
        (response) => {
          if (response.result === 'success') {
            _this.set('value', null);
            msg = this.get('responses.success');
          } else {
            if (!isNaN(parseInt(response.msg.charAt(0)))) {
              msg = this.get('responses.invalidError');
            } else if (this.endsWith(response.msg, "(#6592)")) {
              msg = this.get('responses.attemptsError');
            } else {
              msg = this.get('responses.error');
            }
          }
          _this.set('chimpState', response.result);
          _this.set('chimpSays', msg);
        }, () => {
          let errorMessage = this.get('responses.error');
          _this.set('chimpSays', errorMessage);
          _this.set('chimpState', 'error');
        }
      );
      
      if (this.get('action')) {
        this.sendAction('action', request);
      }
    } else {
      msg = this.get('responses.invalidError');
      this.set('chimpSays', msg);
      this.set('chimpState', 'error');
    }
  }
});
