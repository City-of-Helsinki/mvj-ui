// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {Link, withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import CollapseHeaderTitle from '$components/collapse/CollapseHeaderTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import ListItem from '$components/content/ListItem';
import ListItems from '$components/content/ListItems';
import PlanUnitItem from './PlanUnitItem';
import PlotItem from './PlotItem';
import SubTitle from '$components/content/SubTitle';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/leases/enums';
import {formatNumber, getAttributeFieldOptions, getLabelOfOption, getSearchQuery} from '$util/helpers';
import {getAttributes, getCollapseStateByKey, getIsEditMode} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  area: ?Object,
  attributes: Attributes,
  isActive: boolean,
  isEditMode: boolean,
  planUnitsContractCollapseState: boolean,
  planUnitsCurrentCollapseState: boolean,
  plotsContractCollapseState: boolean,
  plotsCurrentCollapseState: boolean,
  receiveCollapseStates: Function,
  router: Object,
}

const LeaseArea = ({
  area,
  attributes,
  isActive,
  isEditMode,
  planUnitsContractCollapseState,
  planUnitsCurrentCollapseState,
  plotsContractCollapseState,
  plotsCurrentCollapseState,
  receiveCollapseStates,
  router,
}: Props) => {
  const handlePlanUnitContractCollapseToggle = (val: boolean) => {
    if(!area || !area.id) {
      return;
    }
    receiveCollapseStates({
      [isEditMode ? ViewModes.EDIT : ViewModes.READONLY]: {
        [FormNames.LEASE_AREAS]: {
          [area.id]: {
            plan_units_contract: val,
          },
        },
      },
    });
  };

  const handlePlanUnitCurrentCollapseToggle = (val: boolean) => {
    if(!area || !area.id) {
      return;
    }
    receiveCollapseStates({
      [isEditMode ? ViewModes.EDIT : ViewModes.READONLY]: {
        [FormNames.LEASE_AREAS]: {
          [area.id]: {
            plan_units_current: val,
          },
        },
      },
    });
  };

  const handlePlotsContractCollapseToggle = (val: boolean) => {
    if(!area || !area.id) {
      return;
    }

    receiveCollapseStates({
      [isEditMode ? ViewModes.EDIT : ViewModes.READONLY]: {
        [FormNames.LEASE_AREAS]: {
          [area.id]: {
            plots_contract: val,
          },
        },
      },
    });
  };

  const handlePlotsCurrentCollapseToggle = (val: boolean) => {
    if(!area || !area.id) {
      return;
    }

    receiveCollapseStates({
      [isEditMode ? ViewModes.EDIT : ViewModes.READONLY]: {
        [FormNames.LEASE_AREAS]: {
          [area.id]: {
            plots_current: val,
          },
        },
      },
    });
  };

  const getMapLinkUrl = () => {
    const {location: {pathname, query}} = router;
    const tempQuery = {...query};
    delete tempQuery.plan_unit;
    delete tempQuery.plot;
    tempQuery.lease_area = area ? area.id : undefined,
    tempQuery.tab = 7;

    return `${pathname}${getSearchQuery(tempQuery)}`;
  };

  const locationOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.location');
  const typeOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.type');
  const addresses = get(area, 'addresses', []);
  const mapLinkUrl = getMapLinkUrl();

  if(!area){return null;}

  return (
    <div>
      <Row>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Kohteen tunnus'
            text={area.identifier || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Määritelmä'
            text={getLabelOfOption(typeOptions, area.type) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Pinta-ala'
            text={(area.area || area.area === 0) ? `${formatNumber(area.area)} m²` : '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormTitleAndText
            title='Sijainti'
            text={getLabelOfOption(locationOptions, area.location) || '-'}
          />
        </Column>
        <Column small={6} medium={4} large={2}>
          {(isActive && !isEmpty(area.geometry)) && <Link to={mapLinkUrl}>Karttalinkki</Link>}
        </Column>
      </Row>

      <SubTitle>Osoite</SubTitle>
      {!addresses || !addresses.length && <FormText>Ei osoitteita</FormText>}
      {!!addresses.length &&
        <div>
          <Row>
            <Column small={6} large={4}>
              <FormTextTitle title='Osoite' />
            </Column>
            <Column small={3} large={2}>
              <FormTextTitle title='Postinumero' />
            </Column>
            <Column small={3} large={2}>
              <FormTextTitle title='Kaupunki' />
            </Column>
          </Row>
          <ListItems>
            {addresses.map((address) => {
              return (
                <Row key={address.id}>
                  <Column small={6} large={4}>
                    <ListItem>{address.address || '-'}</ListItem>
                  </Column>
                  <Column small={3} large={2}>
                    <ListItem>{address.postal_code || '-'}</ListItem>
                  </Column>
                  <Column small={3} large={2}>
                    <ListItem>{address.city || '-'}</ListItem>
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
            headerTitle={<CollapseHeaderTitle>Kiinteistöt / määräalat sopimuksessa</CollapseHeaderTitle>}
            onToggle={handlePlotsContractCollapseToggle}
          >
            <BoxItemContainer>
              {!area.plots_contract || !area.plots_contract.length &&
                <FormText>Ei kiinteistöjä/määräaloja sopimuksessa</FormText>
              }
              {area.plots_contract && !!area.plots_contract.length && area.plots_contract.map((item, index) =>
                <PlotItem
                  key={index}
                  isAreaActive={isActive}
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
            headerTitle={<CollapseHeaderTitle>Kiinteistöt / määräalat nykyhetkellä</CollapseHeaderTitle>}
            onToggle={handlePlotsCurrentCollapseToggle}
          >
            {!area.plots_current || !area.plots_current.length &&
              <FormText>Ei kiinteistöjä/määräaloja nykyhetkellä</FormText>
            }
            <BoxItemContainer>
              {area.plots_current && !!area.plots_current.length && area.plots_current.map((item, index) =>
                <PlotItem
                  key={index}
                  isAreaActive={isActive}
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
            headerTitle={<CollapseHeaderTitle>Kaavayksiköt sopimuksessa</CollapseHeaderTitle>}
            onToggle={handlePlanUnitContractCollapseToggle}
          >
            <BoxItemContainer>
              {!area.plan_units_contract || !area.plan_units_contract.length &&
                <FormText>Ei kaavayksiköitä sopimuksessa</FormText>
              }
              {area.plan_units_contract && !!area.plan_units_contract.length && area.plan_units_contract.map((item, index) =>
                <PlanUnitItem
                  key={index}
                  isAreaActive={isActive}
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
            headerTitle={<CollapseHeaderTitle>Kaavayksiköt nykyhetkellä</CollapseHeaderTitle>}
            onToggle={handlePlanUnitCurrentCollapseToggle}
          >
            <BoxItemContainer>
              {!area.plan_units_current || !area.plan_units_current.length &&
                <FormText>Ei kaavayksiköitä nykyhetkellä</FormText>
              }
              {area.plan_units_current && !!area.plan_units_current.length && area.plan_units_current.map((item, index) =>
                <PlanUnitItem
                  key={index}
                  isAreaActive={isActive}
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

export default flowRight(
  withRouter,
  connect(
    (state, props) => {
      const id = get(props, 'area.id');
      const isEditMode = getIsEditMode(state);

      return {
        attributes: getAttributes(state),
        isEditMode: isEditMode,
        planUnitsContractCollapseState: getCollapseStateByKey(state, `${isEditMode ? ViewModes.EDIT : ViewModes.READONLY}.${FormNames.LEASE_AREAS}.${id}.plan_units_contract`),
        planUnitsCurrentCollapseState: getCollapseStateByKey(state, `${isEditMode ? ViewModes.EDIT : ViewModes.READONLY}.${FormNames.LEASE_AREAS}.${id}.plan_units_current`),
        plotsContractCollapseState: getCollapseStateByKey(state, `${isEditMode ? ViewModes.EDIT : ViewModes.READONLY}.${FormNames.LEASE_AREAS}.${id}.plots_contract`),
        plotsCurrentCollapseState: getCollapseStateByKey(state, `${isEditMode ? ViewModes.EDIT : ViewModes.READONLY}.${FormNames.LEASE_AREAS}.${id}.plots_current`),
      };
    },
    {
      receiveCollapseStates,
    }
  ),
)(LeaseArea);
