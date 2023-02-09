// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { Facility, YearResult, Group, Admin, User } = initSchema(schema);

export {
  Facility,
  YearResult,
  Group,
  Admin,
  User
};