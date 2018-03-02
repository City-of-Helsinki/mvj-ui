// @flow
import React from 'react';
import {capitalize} from 'lodash';
import Collapse from '../../../../components/collapse/Collapse';
import ConstructionEligibilityItem from './ConstructionEligibilityItem';
import {Row, Column} from 'react-foundation';

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
                <svg className='map-icon' viewBox="0 0 30 30">
                  <path d="M28.5 2.06v21.52l-.7.28-7.88 3.37-.42.22-.42-.15-8.58-3.23-7.45 3.16-1.55.71V6.42l.7-.28 7.88-3.37.42-.22.42.15 8.58 3.23L27 2.77zM9.38 5.44L3.75 7.83v16.73l5.63-2.39zm2.24-.07V22.1l6.76 2.53V7.9zm14.63.07l-5.63 2.39v16.73l5.63-2.39z"/>
                </svg>
                {areas && areas.length > index && <span><span>{`${areas[index].municipality}-${areas[index].district}-${areas[index].group_number}-${areas[index].unit_number}`}</span>&nbsp;&nbsp;<span className='collapse__header-subtitle'>{`(${areas[index].explanation})`}</span></span>
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
