import { Meteor } from 'meteor/meteor';
import seeder from '@cleverbeagle/seeder';
import faker from 'faker';

const wipeData = false;
const environments = ['development', 'staging', 'production'];

const databaseSeed = () => {
  seeder(Meteor.users, {
    environments,
    wipe: wipeData,
    noLimit: true,
    modelCount: 6,
    model(index) {
      const user =
        index === 0
          ? {
              email: 'admin@admin.com',
              password: 'clave',
              profile: {
                name: {
                  first: 'Playtime',
                  last: 'Argentina',
                },
              },
              fake: true,
              roles: ['admin'],
            }
          : {
              email: `user${index}@test.com`,
              password: 'clave',
              profile: {
                name: {
                  first: faker.name.firstName(),
                  last: faker.name.lastName(),
                },
              },
              fake: true,
              roles: ['registered'],
            };

      return user;
    },
  });
};

databaseSeed();
