// @flow
import React from 'react';
import {capitalize} from 'lodash';
import Collapse from '$components/collapse/Collapse';
import ConstructionEligibilityItem from './ConstructionEligibilityItem';
import {Row, Column} from 'react-foundation';

import MapIcon from '$components/icons/MapIcon';

type Props = {
  areas: Array<Object>,
}
const ConstructionEligibility = ({areas}: Props) => {
  return (
    <div>
      {areas && areas.length > 0 && areas.map((area, index) =>
        <Collapse key={index}
          defaultOpen={true}
          header={
            <Row>
              <Column medium={4} className='collapse__header-title'>
                <MapIcon />
                {areas && areas.length > index &&
                  <span>
                    <span>{`${areas[index].municipality}-${areas[index].district}-${areas[index].group_number}-${areas[index].unit_number}`}</span>
                    &nbsp;&nbsp;
                    <span className='collapse__header-subtitle'>{`(${areas[index].explanation})`}</span>
                  </span>
                }
              </Column>
              <Column medium={4} className='collapse__header-subtitle'>
                {areas && areas.length > index &&  <span>{`${capitalize(areas[index].address)}, ${areas[index].zip_code} ${capitalize(areas[index].town)}`}</span>}
              </Column>
              <Column medium={4} className='collapse__header-subtitle'>
                {areas && areas.length > index &&  <span>{areas[index].full_area} m<sup>2</sup> / {capitalize(areas[index].position)}</span>}
              </Column>
            </Row>
          }
        >
          <ConstructionEligibilityItem eligibility={area.construction_eligibility} />
        </Collapse>
      )}
    </div>
  );
};

export default ConstructionEligibility;
