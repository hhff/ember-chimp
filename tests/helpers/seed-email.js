import faker from 'faker';

export default function seedEmail() {
  let seed = (faker.name.firstName() + faker.name.lastName()).replace(' ', '-');
  return `${seed}@sanctuarycomputer.com`;
}
