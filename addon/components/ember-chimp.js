import Ember from 'ember';
import defaultResponses from 'ember-chimp/lib/default-responses';

const {
  get,
  inject: { service },
  computed,
  Logger,
  Component
} = Ember;

/**
  A utility method for checking the end of a string
  for a certain value.

  @method endsWith 
  @param {String} string The string to check. 
  @param {String} suffix The suffix to check the string for.
  @private
  @return {Boolean} A boolean that indicates whether the suffix is present.
*/
function endsWith(string, suffix) {
  return string.indexOf(suffix, string.length - suffix.length) !== -1;
}
  
/**
  The EmberChimp component provides a simple, flexible
  email list signup form, specifically for integrating
  a Mailchimp form tightly with your Ember CLI Application.

  @class EmberChimp
  @module ember-chimp/components/ember-chimp
  @extends Ember.Component
*/
export default Component.extend({
  classNames:        ['ember-chimp'],
  classNameBindings: ['chimpState'],
  attributeBindings: ['novalidate'],
  novalidate:        true,
  tagName:           'form',
  value:             '',
  chimpState:        'idle',
  chimpSays:         null,
  buttonText:        'Submit',
  loadingText:       'Loading...',
  didSubmitAction:   null,
  responses:         defaultResponses,
  isLoading:         computed.equal('chimpState', 'loading'),
  ajax:              service(),

  actions: {
    valueDidChange() {
      this.setProperties({
        chimpState: 'idle',
        chimpSays:  null
      });
    }
  },

  /**
   The action that runs when the form is submitted.

    @method submit
    @param {Event} e The browser's Form Submit event.
  */
  submit(e) {
    e.preventDefault();

    let formAction = get(this, 'formAction');
    if (!formAction) { Logger.error('Ember Chimp: Can not submit without a formAction.'); }
    formAction = formAction.replace('/post?', '/post-json?').concat('&c=?');

    if (get(this, 'isLoading')) { return; }

    if (get(this, 'value').lenth === 0) { 
      this._triggerInvalid();
      return;
    }

    this.setProperties({
      chimpState: 'loading',
      chimpSays: get(this, 'loadingText')
    });

    let request = this.makeRequest(formAction)
      .then(response => {
        if (response.result === 'success') { this.set('value', ''); }
        this.setProperties({
          chimpState: response.result,
          chimpSays:  this._messageForResponse(response)
        });
      })
      .catch(() => this._triggerInvalid());

    if (this.get('didSubmitAction')) { this.sendAction('didSubmitAction', request); }
  },

  /**
    An Overwritable Hook for building the request to Mailchimp.
    Uses ember-ajax under the hood.  If you'd like to use a 
    different method to build this request, you can do so
    by overriding this method.

    @method makeRequest
    @param {String} formAction A string for the request submission URL.
    @return {Ember.RSVP.Promise} Returns the request promise.
  */
  makeRequest(formAction) {
    return get(this, 'ajax').request(formAction, {
      data: this._buildData(),
      dataType: 'jsonp'
    });
  },

  /**
    Returns a user facing string for a response.

    @method _messageForResponse 
    @private
    @param {Object} response The response from the Mailchimp API.
    @return {String} A string to display.
  */
  _messageForResponse(response) {
    let responses = get(this, 'responses');
    if (response.result === 'success') { return responses.success; }
    if (!isNaN(parseInt(response.msg.charAt(0)))) { return responses.invalidError; }
    if (endsWith(response.msg, "(#6592)")) { return responses.attemptsError; }
    return responses.error;
  },

  /**
   Trigger the component's error state.

    @method _triggerInvalid
    @private
  */
  _triggerInvalid() {
    this.setProperties({
      chimpSays:  get(this, 'responses.invalidError'),
      chimpState: 'error'
    });
  },

  /**
   Builds the data for the request from the form element.

    @method _buildData
    @private
  */
  _buildData() {
    const data = {};
    for (let item of this.$().serializeArray()) { data[item.name] = item.value; }
    return data;
  }
});
