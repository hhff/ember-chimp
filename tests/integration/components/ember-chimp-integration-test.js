import { moduleForComponent, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import seedEmail from '../../helpers/seed-email';
import hbs from 'htmlbars-inline-precompile';
import Ember from 'ember';

const testingFormAction = "//computer.us11.list-manage.com/subscribe/post?u=6e62b74d002f42a0e5350892e&amp;id=4e7effa6bd";

const SuccessAjaxServiceStub = Ember.Service.extend({
  request() {
    return Ember.RSVP.resolve({
      msg: "Almost finished... We need to confirm your email address. To complete the subscription process, please click the link in the email we just sent you.",
      result: "success"
    });
  }
});

const ErrorAjaxServiceStub = Ember.Service.extend({
  request() {
    return Ember.RSVP.resolve({
      msg: "0 - Please enter a value",
      result: "error"
    });
  }
});

moduleForComponent('ember-chimp', 'Integration | Component | chimp input', {
  integration: true,

  beforeEach: function() {
    this.set('testingFormAction', testingFormAction);
  }
});

test('is can set buttonText', function(assert) {
  this.render(hbs`{{ember-chimp formAction=testingFormAction
                                buttonText="RSVP"}}`);

  let emberChimp = this.$().find('form.ember-chimp');

  assert.equal(emberChimp.find('button').text(), 'RSVP', 'The Button Text is set correctly.');
});

test('is bubbles the request promise', function(assert) {
  this.register('service:ajax', SuccessAjaxServiceStub);

  this.set('seedEmail', seedEmail());

  this.render(hbs`{{ember-chimp formAction=testingFormAction
                                value=seedEmail
                                didSubmitAction="emberChimpDidSubmit"}}`);

  let emberChimp = this.$().find('form.ember-chimp');
  
  this.on('emberChimpDidSubmit', function(request) {
    assert.ok(request);
  });

  emberChimp.find('button').click();
});

test('it surfaces errors', function(assert) {
  this.register('service:ajax', ErrorAjaxServiceStub);

  this.render(hbs`{{ember-chimp label="Ember Chimp Input"
                                placeholder="Email"
                                formAction=testingFormAction
                                buttonText="Submit"
                                loadingText="Loading"}}`);

  let emberChimp = this.$().find('form.ember-chimp');

  assert.ok(emberChimp, "The component always has the ember-chimp classname.");
  assert.ok(emberChimp.hasClass('idle'), "The component has the idle classname when idle.");
  
  emberChimp.find('button').click();

  return wait()
    .then(() => {
      assert.ok(emberChimp.hasClass('error'), "The component applied the error classname.");
      assert.equal(emberChimp.find('.chimp-says').text(), "Please enter a valid email.", "The Error was surfaced.");
    });
});

test('it works', function(assert) {
  this.register('service:ajax', SuccessAjaxServiceStub);

  this.set('seedEmail', seedEmail());

  this.render(hbs`{{ember-chimp label="Ember Chimp Input"
                                placeholder="Email"
                                value=seedEmail
                                formAction=testingFormAction}}`);

  let emberChimp = this.$().find('form.ember-chimp');

  emberChimp.find('button').click();
  return wait()
    .then(() => {
      assert.ok(this.$('form .chimp-says').text().length > 0, 'It shows a Success Message.');
      assert.ok(this.$('form').hasClass('success'), 'It applies the Success Class Name.');
    });
});
