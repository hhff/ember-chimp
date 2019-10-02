import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled, find } from '@ember/test-helpers';
import seedEmail from '../../helpers/seed-email';
import hbs from 'htmlbars-inline-precompile';

import SuccessAjaxServiceStub from '../../stubs/success-ember-chimp-ajax-stub';
import ErrorAjaxServiceStub from '../../stubs/error-ember-chimp-ajax-stub';

const testingFormAction = "//computer.us11.list-manage.com/subscribe/post?u=6e62b74d002f42a0e5350892e&amp;id=4e7effa6bd";

module('Integration | Component | chimp input', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.actions = {};
    this.send = (actionName, ...args) => this.actions[actionName].apply(this, args);
  });

  hooks.beforeEach(function() {
    this.set('testingFormAction', testingFormAction);
  });

  test('is can set buttonText', async function(assert) {
    await render(hbs`{{ember-chimp formAction=testingFormAction
                                  buttonText="RSVP"}}`);

    let emberChimp = this.$().find('form.ember-chimp');

    assert.equal(emberChimp.find('button').text(), 'RSVP', 'The Button Text is set correctly.');
  });

  test('is bubbles the request promise', async function(assert) {
    this.owner.register('service:ajax', SuccessAjaxServiceStub);

    this.set('seedEmail', seedEmail());

    this.actions.emberChimpDidSubmit = function(request) {
      assert.ok(request);
    };

    await render(hbs`{{ember-chimp formAction=testingFormAction
                                  value=seedEmail
                                  didSubmitAction=(action "emberChimpDidSubmit")}}`);

    let emberChimp = this.$().find('form.ember-chimp');
    
    emberChimp.find('button').click();
  });

  test('it surfaces errors', async function(assert) {
    this.owner.register('service:ajax', ErrorAjaxServiceStub);

    await render(hbs`{{ember-chimp label="Ember Chimp Input"
                                  placeholder="Email"
                                  formAction=testingFormAction
                                  buttonText="Submit"
                                  loadingText="Loading"}}`);

    let emberChimp = this.$().find('form.ember-chimp');

    assert.ok(emberChimp, "The component always has the ember-chimp classname.");
    assert.ok(emberChimp.hasClass('idle'), "The component has the idle classname when idle.");
    
    emberChimp.find('button').click();

    return settled()
      .then(() => {
        assert.ok(emberChimp.hasClass('error'), "The component applied the error classname.");
        assert.equal(emberChimp.find('.chimp-says').text(), "Please enter a valid email.", "The Error was surfaced.");
      });
  });

  test('it works', async function(assert) {
    this.owner.register('service:ajax', SuccessAjaxServiceStub);

    this.set('seedEmail', seedEmail());

    await render(hbs`{{ember-chimp label="Ember Chimp Input"
                                  placeholder="Email"
                                  value=seedEmail
                                  formAction=testingFormAction}}`);

    let emberChimp = this.$().find('form.ember-chimp');

    emberChimp.find('button').click();
    return settled()
      .then(() => {
        assert.ok(find('form .chimp-says').textContent.length > 0, 'It shows a Success Message.');
        assert.dom('form').hasClass('success', 'It applies the Success Class Name.');
      });
  });
});
