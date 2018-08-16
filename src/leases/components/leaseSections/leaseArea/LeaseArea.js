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
import SubTitle from '$components/content/SubTitle';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/leases/enums';
import {getFullAddress} from '$src/leases/helpers';
import {formatNumber, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getAttributes, getCollapseStateByKey} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  area: Object,
  areaCollapseState: boolean,
  attributes: Attributes,
  planUnitsContractCollapseState: boolean,
  planUnitsCurrentCollapseState: boolean,
  plotsContractCollapseState: boolean,
  plotsCurrentCollapseState: boolean,
  receiveCollapseStates: Function,
}

const LeaseArea = ({
  area,
  areaCollapseState,
  attributes,
  planUnitsContractCollapseState,
  planUnitsCurrentCollapseState,
  plotsContractCollapseState,
  plotsCurrentCollapseState,
  receiveCollapseStates,
}: Props) => {
  const handleAreaCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LEASE_AREAS]: {
          [area.id]: {
            area: val,
          },
        },
      },
    });
  };

  const handlePlanUnitContractCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LEASE_AREAS]: {
          [area.id]: {
            plan_units_contract: val,
          },
        },
      },
    });
  };

  const handlePlanUnitCurrentCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LEASE_AREAS]: {
          [area.id]: {
            plan_units_current: val,
          },
        },
      },
    });
  };

  const handlePlotsContractCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LEASE_AREAS]: {
          [area.id]: {
            plots_contract: val,
          },
        },
      },
    });
  };

  const handlePlotsCurrentCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LEASE_AREAS]: {
          [area.id]: {
            plots_current: val,
          },
        },
      },
    });
  };

  const locationOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.location');
  const typeOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.type');
  const addresses = get(area, 'addresses', []);

  return (
    <Collapse
      defaultOpen={areaCollapseState !== undefined ? areaCollapseState : true}
      header={
        <div>
          <Column>
            <span className='collapse__header-subtitle'>
              {getLabelOfOption(typeOptions, area.type) || '-'}
            </span>
          </Column>
          <Column>
            <span className='collapse__header-subtitle'>
              {getFullAddress(get(area, 'addresses[0]')) || '-'}
            </span>
          </Column>
          <Column>
            <span className='collapse__header-subtitle'>
              {formatNumber(area.area) || '-'} m<sup>2</sup>
            </span>
          </Column>
          <Column>
            <span className='collapse__header-subtitle'>
              {getLabelOfOption(locationOptions, area.location) || '-'}
            </span>
          </Column>
        </div>
      }
      headerTitle={<h3 className='collapse__header-title'>{area.identifier || '-'}</h3>}
      onToggle={handleAreaCollapseToggle}
    >
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
          <p>{area.area ? `${formatNumber(area.area)} m²` : '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormFieldLabel>Sijainti</FormFieldLabel>
          <p>{getLabelOfOption(locationOptions, area.location) || '-'}</p>
        </Column>
      </Row>

      <SubTitle>Osoite</SubTitle>
      {!addresses || !addresses.length && <p>Ei osoitteita</p>}
      {!!addresses.length &&
        <div>
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
            defaultOpen={plotsContractCollapseState !== undefined ? plotsContractCollapseState : true}
            headerTitle={<h4 className='collapse__header-title'>Kiinteistöt / määräalat sopimuksessa</h4>}
            onToggle={handlePlotsContractCollapseToggle}
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
            defaultOpen={plotsCurrentCollapseState !== undefined ? plotsCurrentCollapseState : true}
            headerTitle={<h4 className='collapse__header-title'>Kiinteistöt / määräalat nykyhetkellä</h4>}
            onToggle={handlePlotsCurrentCollapseToggle}
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
            defaultOpen={planUnitsContractCollapseState !== undefined ? planUnitsContractCollapseState : true}
            headerTitle={<h4 className='collapse__header-title'>Kaavayksiköt sopimuksessa</h4>}
            onToggle={handlePlanUnitContractCollapseToggle}
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
            defaultOpen={planUnitsCurrentCollapseState !== undefined ? planUnitsCurrentCollapseState : true}
            headerTitle={<h4 className='collapse__header-title'>Kaavayksiköt nykyhetkellä</h4>}
            onToggle={handlePlanUnitCurrentCollapseToggle}
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
    </Collapse>
  );
};

export default connect(
  (state, props) => {
    const id = props.area.id;

    return {
      areaCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LEASE_AREAS}.${id}.area`),
      attributes: getAttributes(state),
      planUnitsContractCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LEASE_AREAS}.${id}.plan_units_contract`),
      planUnitsCurrentCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LEASE_AREAS}.${id}.plan_units_current`),
      plotsContractCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LEASE_AREAS}.${id}.plots_contract`),
      plotsCurrentCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LEASE_AREAS}.${id}.plots_current`),
    };
  },
  {
    receiveCollapseStates,
  }
)(LeaseArea);
