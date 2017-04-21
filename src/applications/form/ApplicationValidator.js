import {BaseValidator} from '../../components/form/validation';

export default ({
                  type,
                  location,
                  address,
                  map_link,
                  usage,
                  area,
                  start,
                  stop,
                }) => {
  const conditions = {};

  return BaseValidator({type, location, address, map_link, usage, area, start, stop}, conditions);
};
