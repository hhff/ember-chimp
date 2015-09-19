import { moduleForComponent, test } from 'ember-qunit';
import Ember from 'ember';

moduleForComponent('ember-chimp', 'Unit | Component | chimp input', {
  unit: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Creates the component instance
  var component = this.subject();
  assert.equal(component._state, 'preRender');

  // Renders the component to the page
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('it can set label & placeholder', function(assert) {
  assert.expect(2);

  var component = this.subject();
  component.set('label', 'Signup:');
  component.set('placeholder', 'Email Address');
  this.render();

  assert.equal(component.$().find('label').text(), "Signup:", "Label is set correctly");
  assert.equal(component.$().find('input[type="email"]').attr('placeholder'), "Email Address", "Placeholder is set correctly");  
});

test('it can set buttonText', function(assert) {
  assert.expect(1);

  var component = this.subject();
  component.set('buttonText', 'RSVP');
  this.render();

  assert.equal(component.$().find('button').text(), "RSVP", "Button Text is set correctly.");
});

