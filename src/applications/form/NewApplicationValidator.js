import {BaseValidator} from '../../components/form/validation';

export default ({
                  address,
                  area,
                  billing_info,
                  location,
                  map_link,
                  start,
                  stop,
                  type,
                  usage,
                }) => {
  const customConditions = {};

  return BaseValidator({billing_info, type, location, address, map_link, usage, area, start, stop}, customConditions);
};
