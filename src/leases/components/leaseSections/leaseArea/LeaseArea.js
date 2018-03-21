// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import GreenBox from '$components/content/GreenBox';
import PlanUnitItem from './PlanUnitItem';
import PlotItem from './PlotItem';

import SubsectionContent from '$components/content/SubsectionContent';

type Props = {
  area: Object,
  attributes: Object,
}

const LeaseArea = ({area, attributes}: Props) => {
  return (
    <SubsectionContent>
      <h2>Kiinteistöt ja määräalat</h2>
      <Row>
        <Column small={12} medium={6}>
          <GreenBox className='full-height'>
            <h3>Kiinteistöt / määräalat sopimushetkellä</h3>
            {area.plots_contract && !!area.plots_contract.length
              ? (
                <div>
                  {area.plots_contract.map((item, index) =>
                    <PlotItem
                      key={index}
                      attributes={attributes}
                      plot={item}
                    />
                  )}
                </div>
              ) : (
                <p className='no-margin'>Ei kiinteistöjä / määräaloja sopimushetkellä</p>
              )
            }
          </GreenBox>
        </Column>
        <Column small={12} medium={6}>
          <GreenBox className='full-height'>
            <h3>Kiinteistöt / määräalat nykyhetkellä</h3>
            {area.plots_current && !!area.plots_current.length
              ? (
                <div>
                  {area.plots_current.map((item, index) =>
                    <PlotItem
                      key={index}
                      attributes={attributes}
                      plot={item}
                    />
                  )}
                </div>
              ) : (
                <p className='no-margin'>Ei kiinteistöjä / määräaloja nykyhetkellä</p>
              )
            }
          </GreenBox>
        </Column>
      </Row>
      <h2>Kaavayksiköt</h2>
      <Row>
        <Column small={12} medium={6}>
          <GreenBox className='full-height'>
            <h3>Kaavayksiköt sopimushetkellä</h3>
            {area.plan_units_contract && !!area.plan_units_contract.length
              ? (
                <div>
                  {area.plan_units_contract.map((item, index) =>
                    <PlanUnitItem
                      key={index}
                      attributes={attributes}
                      planUnit={item}
                    />
                  )}
                </div>
              ) : (
                <p className='no-margin'>Ei kaavayksiköitä sopimushetkellä</p>
              )
            }
          </GreenBox>
        </Column>
        <Column small={12} medium={6}>
          <GreenBox className='full-height'>
            <h3>Kaavayksiköt nykyhetkellä</h3>
            {area.plan_units_current && area.plan_units_current.length
              ? (
                <div>
                  {area.plan_units_current.map((item, index) =>
                    <PlanUnitItem
                      key={index}
                      attributes={attributes}
                      planUnit={item}
                    />
                  )}
                </div>
              ) : (
                <p className='no-margin'>Ei kaavayksiköitä nykyhetkellä</p>
              )
            }
          </GreenBox>
        </Column>
      </Row>
    </SubsectionContent>
  );
};

export default LeaseArea;
