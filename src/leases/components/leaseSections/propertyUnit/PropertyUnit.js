// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import {capitalize} from 'lodash';

import Collapse from '$components/collapse/Collapse';
import MapIcon from '$components/icons/MapIcon';
import PropertyUnitPlot from './PropertyUnitPlot';
import {
  districtItemExplanationOptions,
  districtItemPositionOptions,
} from '../../../../constants';
import {getLabelOfOption}  from '$util/helpers';

type Props = {
  areas: Array<Object>,
}

const PropertyUnit = ({areas}: Props) => {
  return (
    <div>
      {areas && areas.length > 0 && areas.map((area, index) =>
        <Collapse key={index}
          defaultOpen={true}
          header={
            <Row>
              <Column medium={4} className='collapse__header-title'>
                <MapIcon />
                <span>{`${area.municipality}-${area.district}-${area.group_number}-${area.unit_number}`}</span>
                &nbsp;&nbsp;<span className='collapse__header-subtitle'>{`(${getLabelOfOption(districtItemExplanationOptions, area.explanation) || '-'})`}</span>
              </Column>
              <Column medium={4} className='collapse__header-subtitle'>
                <span>{`${capitalize(area.address)}, ${area.zip_code} ${capitalize(area.town)}`}</span>
              </Column>
              <Column medium={4} className='collapse__header-subtitle'>
                <span>{area.full_area} m<sup>2</sup> / {getLabelOfOption(districtItemPositionOptions, area.position) || '-'}</span>
              </Column>
            </Row>
          }
        >
          <PropertyUnitPlot area={area}/>
        </Collapse>)
      }
    </div>
  );
};

export default PropertyUnit;
