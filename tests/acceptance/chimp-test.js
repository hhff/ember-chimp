import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import seedEmail from '../helpers/seed-email';

import SuccessAjaxServiceStub from '../stubs/success-ember-chimp-ajax-stub';
import ErrorAjaxServiceStub from '../stubs/error-ember-chimp-ajax-stub';

var application;

module('Acceptance | ember-chimp test', {
  beforeEach: function() {
    application = startApp();
  },

  afterEach: function() {
    Ember.run(application, 'destroy');
  }
});

test('it surfaces errors', function(assert) {
  application.register('service:ajax', ErrorAjaxServiceStub);
  let component;

  visit('/test');
  andThen(() => {
    assert.equal(currentPath(), 'test');

    component = find('form.ember-chimp');
    assert.ok(component.hasClass('idle'));

    fillIn('input[Placeholder="Email"]', 'not@valid');
    click('button[type="submit"]');
  });

  andThen(() => {
    assert.ok(component.hasClass('error'), 'The component applied the error classname.');
    assert.equal(
      component.find('.chimp-says').text(),
      'Please enter a valid email.', 
      'The Error was surfaced.'
    );
  });
});

test('it can submit successfully', function(assert) {
  application.register('service:ajax', SuccessAjaxServiceStub);
  let component;

  visit('/test');
  andThen(() => {
    assert.equal(currentPath(), 'test');

    component = find('form.ember-chimp');
    assert.ok(component.hasClass('idle'));

    fillIn('input[Placeholder="Email"]', seedEmail());
    click('button[type="submit"]');
  });

  andThen(() => {
    assert.ok(component.hasClass('success'), "The component applied the success classname.");
    assert.equal(
      component.find('.chimp-says').text(),
      'Almost finished... We need to confirm your email address. To complete the subscription process, please click the link in the email we just sent you.', 
      'The Error was surfaced.'
    );
  });
});
