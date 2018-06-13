// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormFieldLabel from '$components/form/FormFieldLabel';
import ListItems from '$components/content/ListItems';
import PlanUnitItem from './PlanUnitItem';
import PlotItem from './PlotItem';
import {formatNumber, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  area: Object,
  attributes: Attributes,
}

const LeaseArea = ({area, attributes}: Props) => {
  const locationOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.location');
  const typeOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.type');
  const addresses = get(area, 'addresses', []);

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Tunnus</FormFieldLabel>
          <p>{area.identifier || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Määritelmä</FormFieldLabel>
          <p>{getLabelOfOption(typeOptions, area.type) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Pinta-ala</FormFieldLabel>
          <p>{formatNumber(area.area) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Sijainti</FormFieldLabel>
          <p>{getLabelOfOption(locationOptions, area.location) || '-'}</p>
        </Column>
      </Row>

      <Row>
        <Column small={6} large={4}>
          <FormFieldLabel>Osoite</FormFieldLabel>
        </Column>
        <Column small={3} large={2}>
          <FormFieldLabel>Postinumero</FormFieldLabel>
        </Column>
        <Column small={3} large={2}>
          <FormFieldLabel>Kaupunki</FormFieldLabel>
        </Column>
      </Row>
      {!addresses.length &&
        <Row>
          <Column small={6} large={4}>
            <p>-</p>
          </Column>
          <Column small={3} large={2}>
            <p>-</p>
          </Column>
          <Column small={3} large={2}>
            <p>-</p>
          </Column>
        </Row>
      }
      {!!addresses.length &&
        <div>
          <ListItems>
            {addresses.map((address) => {
              return (
                <Row key={address.id}>
                  <Column small={6} large={4}>
                    <p className='no-margin'>{address.address || '-'}</p>
                  </Column>
                  <Column small={3} large={2}>
                    <p className='no-margin'>{address.postal_code || '-'}</p>
                  </Column>
                  <Column small={3} large={2}>
                    <p className='no-margin'>{address.city || '-'}</p>
                  </Column>
                </Row>
              );
            })}
          </ListItems>
        </div>
      }

      <Row>
        <Column small={12} large={6}>
          <Collapse
            className='collapse__secondary'
            defaultOpen={true}
            headerTitle={
              <h4 className='collapse__header-title'>Kiinteistöt / määräalat sopimuksessa</h4>
            }
          >
            <BoxItemContainer>
              {!area.plots_contract || !area.plots_contract.length &&
                <p>Ei kiinteistöjä/määräaloja sopimuksessa</p>
              }
              {area.plots_contract.map((item, index) =>
                <PlotItem
                  key={index}
                  plot={item}
                />
              )}
            </BoxItemContainer>
          </Collapse>
        </Column>
        <Column small={12} large={6}>
          <Collapse
            className='collapse__secondary'
            defaultOpen={true}
            headerTitle={
              <h4 className='collapse__header-title'>Kiinteistöt / määräalat nykyhetkellä</h4>
            }
          >
            {!area.plots_current || !area.plots_current.length &&
              <p>Ei kiinteistöjä/määräaloja nykyhetkellä</p>
            }
            <BoxItemContainer>
              {area.plots_current.map((item, index) =>
                <PlotItem
                  key={index}
                  plot={item}
                />
              )}
            </BoxItemContainer>
          </Collapse>
        </Column>
      </Row>

      <Row>
        <Column small={12} large={6}>
          <Collapse
            className='collapse__secondary'
            defaultOpen={true}
            headerTitle={
              <h4 className='collapse__header-title'>Kaavayksiköt sopimuksessa</h4>
            }
          >
            <BoxItemContainer>
              {!area.plan_units_contract || !area.plan_units_contract.length &&
                <p>Ei kaavayksiköitä sopimuksessa</p>
              }
              {area.plan_units_contract.map((item, index) =>
                <PlanUnitItem
                  key={index}
                  planUnit={item}
                />
              )}
            </BoxItemContainer>
          </Collapse>
        </Column>
        <Column small={12} large={6}>
          <Collapse
            className='collapse__secondary'
            defaultOpen={true}
            headerTitle={
              <h4 className='collapse__header-title'>Kaavayksiköt nykyhetkellä</h4>
            }
          >
            <BoxItemContainer>
              {!area.plan_units_current || !area.plan_units_current.length &&
                <p>Ei kaavayksiköitä nykyhetkellä</p>
              }
              {area.plan_units_current.map((item, index) =>
                <PlanUnitItem
                  key={index}
                  planUnit={item}
                />
              )}
            </BoxItemContainer>
          </Collapse>
        </Column>
      </Row>
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  }
)(LeaseArea);
