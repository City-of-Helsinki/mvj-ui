// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import {capitalize} from 'lodash';

import Collapse from '$components/collapse/Collapse';
import LeaseArea from './LeaseArea';
import {getAttributeFieldOptions, getLabelOfOption}  from '$util/helpers';

type Props = {
  areas: Array<Object>,
  attributes: Object,
}

const LeaseAreas = ({areas, attributes}: Props) => {
  const locationOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.location');
  const typeOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.type');

  const getFullAddress = (area: Object) => {
    return `${capitalize(area.address)}, ${area.postal_code} ${capitalize(area.city)}`;
  };

  const getAreaLabel = (area: Object) => {
    return (
      <span>{area.area} m<sup>2</sup> / {getLabelOfOption(locationOptions, area.location) || '-'}</span>
    );
  };

  return (
    <div>
      {!areas || !areas.length && <p className='no-margin'>Ei vuokra-alueita</p>}
      {areas && !!areas.length &&
        areas.map((area, index) =>
          <Collapse
            key={index}
            defaultOpen={true}
            header={
              <Row>
                <Column small={3}>
                  <h3 className='collapse__header-title'>{area.identifier || '-'}</h3>
                </Column>
                <Column small={3}>
                  <span className='collapse__header-subtitle'>
                    {getLabelOfOption(typeOptions, area.type) || '-'}
                  </span>
                </Column>
                <Column small={3}>
                  <span className='collapse__header-subtitle'>
                    {getFullAddress(area)}
                  </span>
                </Column>
                <Column small={3}>
                  <span className='collapse__header-subtitle'>
                    {getAreaLabel(area)}
                  </span>
                </Column>
              </Row>
            }
          >
            <LeaseArea
              area={area}
              attributes={attributes}
            />
          </Collapse>
        )
      }
    </div>
  );
};

export default LeaseAreas;
