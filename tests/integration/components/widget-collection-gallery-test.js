import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('widget-collection-gallery', 'Integration | Component | widget collection gallery', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{widget-collection-gallery}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#widget-collection-gallery}}
      template block text
    {{/widget-collection-gallery}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
