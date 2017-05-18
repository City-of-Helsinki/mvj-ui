import {BaseValidator} from '../../../components/form/validation';

export default ({
                  type,
                  area,
                  use,
                  contact_name,
                  contact_phone,
                  contact_email,
                }) => {

  const customConditions = {};

  return BaseValidator({
    type,
    area,
    use,
    contact_name,
    contact_phone,
    contact_email,
  }, customConditions);
};
