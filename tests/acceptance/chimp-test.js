import Ember from 'ember';
import { module, test } from 'qunit';
import startApp from '../helpers/start-app';
import seedEmail from '../helpers/seed-email';

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
  visit('/test');
  let component;

  andThen(function() {
    component = find('.ember-chimp');
    assert.equal(currentPath(), 'test');
    assert.ok(component.hasClass('idle'));
    fillIn('input[Placeholder="Email"]', 'not@valid');
    click('button[type="submit"]');
  });

  andThen(function() {
    assert.ok(component.hasClass('error'), "The component applied the error classname.");
    let messages = component.find('.chimp-says').text();
    assert.equal(messages, 'Error Placeholder', "The Error was surfaced.");
  });
  
  andThen(function() {
    let value = find('input[Placeholder="Email"]').val();
    assert.equal(value, 'not@valid', "The errored value was not cleared.");
    fillIn('input[Placeholder="Email"]', '');
  });

  andThen(function() {
    assert.ok(component.hasClass('idle'), "The component applied the idle classname after an error.");
  });
});

test('it can submit successfully', function(assert) {
  visit('/test');

  andThen(function() {
    assert.equal(currentPath(), 'test');
    fillIn('input[Placeholder="Email"]', seedEmail());
    click('button[type="submit"]');
  });
});
