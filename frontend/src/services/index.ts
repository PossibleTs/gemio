import auth from '@app/services/auth';
import collections from '@app/services/collections';
import companies from '@app/services/companies';
import localStorage from '@app/services/localStorage';
import register from '@app/services/register';
import assets from '@app/services/assets';
import profile from '@app/services/profile'

const services = {
  auth,
  collections,
  companies,
  localStorage,
  register,
  assets,
  profile
};
export default services;
