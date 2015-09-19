export default function seedEmail() {
  let seed = (new Date()).valueOf().toString();
  return 'ember-chimp-'+seed+'@example.com';
}
