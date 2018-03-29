// @flow
import React from 'react';
import Collapse from '$components/collapse/Collapse';
import ConstructabilityItem from './ConstructabilityItem';
import {Row, Column} from 'react-foundation';

import {getAttributeFieldOptions, getLabelOfOption} from '$src/util/helpers';
import MapIcon from '$components/icons/MapIcon';

import type {Attributes} from '$src/leases/types';
import type {UserList} from '$src/users/types';

type Props = {
  areas: Array<Object>,
  attributes: Attributes,
  users: UserList,
}

const Constructability = ({areas, attributes, users}: Props) => {
  const getFullAddress = (item: Object) => {
    return `${item.address}, ${item.postal_code} ${item.city}`;
  };

  const locationOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.location');
  const typeOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.type');

  return (
    <div>
      {!areas || !areas.length &&
        <p className='no-margin'>Ei vuokra-alueita</p>
      }
      {areas && !!areas.length && areas.map((area) =>
        <Collapse key={area.id}
          defaultOpen={true}
          header={
            <Row>
              <Column medium={4} className='collapse__header-title'>
                <MapIcon />
                <span>
                  <span>{area.identifier || '-'}</span>
                  &nbsp;&nbsp;
                  <span className='collapse__header-subtitle'>
                    ({getLabelOfOption(typeOptions, area.type) || '-'})
                  </span>
                </span>
              </Column>
              <Column medium={4} className='collapse__header-subtitle'>
                <span>{getFullAddress(area)}</span>
              </Column>
              <Column medium={4} className='collapse__header-subtitle'>
                <span>{area.area} m<sup>2</sup> / {getLabelOfOption(locationOptions, area.location)}</span>
              </Column>
            </Row>
          }
        >
          <ConstructabilityItem
            area={area}
            attributes={attributes}
            users={users}
          />
        </Collapse>
      )}
    </div>
  );
};

export default Constructability;
