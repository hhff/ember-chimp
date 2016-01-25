import { moduleForComponent, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import seedEmail from '../../helpers/seed-email';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ember-chimp', 'Integration | Component | chimp input', {
  integration: true
});

/*
test('it surfaces errors', function(assert) {
  this.render(hbs`{{ember-chimp label="Ember Chimp Input"
                                placeholder="Email"
                                formAction="//computer.us11.list-manage.com/subscribe/post?u=6e62b74d002f42a0e5350892e&amp;id=4e7effa6bd"
                                buttonText="Submit"
                                loadingText="Loading"}}`);


  let emberChimp = this.$().find('form.ember-chimp');

  assert.ok(emberChimp, "The component always has the ember-chimp classname.");
  assert.ok(emberChimp.hasClass('idle'), "The component has the idle classname when idle.");
  
  emberChimp.find('button').click();

  return wait()
    .then(() => {
      // No Async Happens here as the form is blank.  There's actually no need for wait() here - but will be soon.
      assert.ok(emberChimp.hasClass('error'), "The component applied the error classname.");
      assert.equal(emberChimp.find('.chimp-says').text(), "Please enter a valid email.", "The Error was surfaced.");
    });
});
*/
test('it works', function(assert) {
  this.set('seedEmail', seedEmail());

  this.render(hbs`{{ember-chimp label="Ember Chimp Input"
                                placeholder="Email"
                                value=seedEmail
                                formAction="//computer.us11.list-manage.com/subscribe/post?u=6e62b74d002f42a0e5350892e&amp;id=4e7effa6bd"
                                buttonText="Submit"
                                loadingText="Loading"}}`);

  let emberChimp = this.$().find('form.ember-chimp');
  emberChimp.find('button').click();

  return wait()
    .then(() => {
      assert.ok(this.$('form').hasClass('success'));
      assert.ok(this.$('form .chimp-says').text().length > 0);
    });
});
