import { click, fillIn, currentURL, visit, find } from '@ember/test-helpers';
import { module, test } from 'qunit';
import seedEmail from '../helpers/seed-email';

import SuccessAjaxServiceStub from '../stubs/success-ember-chimp-ajax-stub';
import ErrorAjaxServiceStub from '../stubs/error-ember-chimp-ajax-stub';

import { setupApplicationTest } from 'ember-qunit';

module('Acceptance | ember-chimp test', function(hooks) {
  setupApplicationTest(hooks);

  test('it surfaces errors', async function(assert) {
    this.owner.register('service:ajax', ErrorAjaxServiceStub);
    let component;

    await visit('/test');
    assert.equal(currentURL(), '/test');

    component = find('form.ember-chimp');
    assert.ok(component.classList.contains('idle'));

    await fillIn('input[Placeholder="Email"]', 'not@valid');
    await click('button[type="submit"]');
    assert.ok(component.classList.contains('error'), 'The component applied the error classname.');
    assert.equal(
      component.querySelector('.chimp-says').textContent,
      'Please enter a valid email.', 
      'The Error was surfaced.'
    );
  });

  test('it can submit successfully', async function(assert) {
    this.owner.register('service:ajax', SuccessAjaxServiceStub);
    let component;

    await visit('/test');
    assert.equal(currentURL(), '/test');

    component = find('form.ember-chimp');
    assert.ok(component.classList.contains('idle'));

    await fillIn('input[Placeholder="Email"]', seedEmail());
    await click('button[type="submit"]');
    assert.ok(component.classList.contains('success'), "The component applied the success classname.");
    assert.equal(
      component.querySelector('.chimp-says').textContent,
      'Almost finished... We need to confirm your email address. To complete the subscription process, please click the link in the email we just sent you.', 
      'The Error was surfaced.'
    );
  });
});
