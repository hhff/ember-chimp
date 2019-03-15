import faker from 'faker';

export default function seedEmail() {
  let seed = (faker.name.firstName() + faker.name.lastName()).replace(' ', '-');
  let random = Math.floor(Math.random() * 90 + 10);
  return `${seed}${random}@sanctuarycomputer.com`;
}
