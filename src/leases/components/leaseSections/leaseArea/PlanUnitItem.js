// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import BoxItem from '$components/content/BoxItem';
import {getAttributes} from '$src/leases/selectors';
import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  planUnit: Object,
}

const PlanUnitItem = ({attributes, planUnit}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.type');
  const planUnitTypeOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.plan_unit_type');
  const planUnitStateOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.plan_unit_state');

  return (
    <BoxItem className='no-border-on-first-child'>
      <Row>
        <Column small={6} medium={4} large={2}>
          <label>Tunnus</label>
          <p><strong>{planUnit.identifier || '-'}</strong></p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Käyttötarkoitus</label>
          <p>{getLabelOfOption(typeOptions, planUnit.type) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Kokonaisala</label>
          <p>{planUnit.area || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Leikkausala</label>
          <p>{planUnit.section_area || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column small={12} medium={12} large={4}>
          <label>Osoite</label>
          <p>{planUnit.address || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Postinumero</label>
          <p>{planUnit.postal_code || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Kaupunki</label>
          <p>{planUnit.city || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={4} large={2}>
          <label>Tonttijaon tunnus</label>
          <p>{planUnit.plot_division_identifier || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Tonttijaon hyväksymispvm</label>
          <p>{formatDate(planUnit.plot_division_date_of_approval) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Asemakaava</label>
          <p>{planUnit.detailed_plan_identifier}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Asemakaavan vahvistumispvm</label>
          <p>{formatDate(planUnit.detailed_plan_date_of_approval) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column small={6} medium={6} large={4}>
          <label>Kaavayksikön laji</label>
          <p>{getLabelOfOption(planUnitTypeOptions, planUnit.plan_unit_type) || '-'}</p>
        </Column>
        <Column small={6} medium={6} large={2}>
          <label>Kaavayksikön olotila</label>
          <p>{getLabelOfOption(planUnitStateOptions, planUnit.plan_unit_state) || '-'}</p>
        </Column>
      </Row>
    </BoxItem>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  }
)(PlanUnitItem);
