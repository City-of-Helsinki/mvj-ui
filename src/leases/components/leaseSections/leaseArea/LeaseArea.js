// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import PlanUnitItem from './PlanUnitItem';
import PlotItem from './PlotItem';
import {getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';

type Props = {
  area: Object,
  attributes: Object,
}

const LeaseArea = ({area, attributes}: Props) => {
  const locationOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.location');
  const typeOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.type');
  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <label>Tunnus</label>
          <p>{area.identifier || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Selite</label>
          <p>{getLabelOfOption(typeOptions, area.type) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Pinta-ala</label>
          <p>{area.area || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Sijainti</label>
          <p>{getLabelOfOption(locationOptions, area.location) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column small={12} medium={12} large={4}>
          <label>Osoite</label>
          <p>{area.address || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Postinumero</label>
          <p>{area.postal_code || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Kaupunki</label>
          <p>{area.city || '-'}</p>
        </Column>
      </Row>

      {area.plots_contract && !!area.plots_contract.length &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={true}
          header={
            <Row>
              <Column small={12}>
                <h4 className='collapse__header-title'>Kiinteistöt / määräalat sopimushetkellä</h4>
              </Column>
            </Row>
          }
        >
          <BoxItemContainer>
            {area.plots_contract.map((item, index) =>
              <PlotItem
                key={index}
                attributes={attributes}
                plot={item}
              />
            )}
          </BoxItemContainer>
        </Collapse>
      }
      {area.plots_current && !!area.plots_current.length &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={true}
          header={
            <Row>
              <Column small={12}>
                <h4 className='collapse__header-title'>Kiinteistöt / määräalat nykyhetkellä</h4>
              </Column>
            </Row>
          }
        >
          <BoxItemContainer>
            {area.plots_current.map((item, index) =>
              <PlotItem
                key={index}
                attributes={attributes}
                plot={item}
              />
            )}
          </BoxItemContainer>
        </Collapse>
      }
      {area.plan_units_contract && !!area.plan_units_contract.length &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={true}
          header={
            <Row>
              <Column small={12}>
                <h4 className='collapse__header-title'>Kaavayksiköt sopimushetkellä</h4>
              </Column>
            </Row>
          }
        >
          <BoxItemContainer>
            {area.plan_units_contract.map((item, index) =>
              <PlanUnitItem
                key={index}
                attributes={attributes}
                planUnit={item}
              />
            )}
          </BoxItemContainer>
        </Collapse>
      }
      {area.plan_units_current && !!area.plan_units_current.length &&
        <Collapse
          className='collapse__secondary'
          defaultOpen={true}
          header={
            <Row>
              <Column small={12}>
                <h4 className='collapse__header-title'>Kaavayksiköt nykyhetkellä</h4>
              </Column>
            </Row>
          }
        >
          <BoxItemContainer>
            {area.plan_units_current.map((item, index) =>
              <PlanUnitItem
                key={index}
                attributes={attributes}
                planUnit={item}
              />
            )}
          </BoxItemContainer>
        </Collapse>
      }
    </div>
  );
};

export default LeaseArea;
