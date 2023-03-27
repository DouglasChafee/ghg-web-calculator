// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { YearResult, Group, Admin, User } = initSchema(schema);

export {
  YearResult,
  Group,
  Admin,
  User
};