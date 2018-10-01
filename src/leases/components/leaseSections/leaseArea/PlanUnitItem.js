// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import BoxItem from '$components/content/BoxItem';
import FormTitleAndText from '$components/form/FormTitleAndText';
import {getAttributes} from '$src/leases/selectors';
import {formatDate, formatNumber, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  planUnit: Object,
}

const PlanUnitItem = ({attributes, planUnit}: Props) => {
  const plotDivisionStateOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.plot_division_state');
  const planUnitTypeOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.plan_unit_type');
  const planUnitStateOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.plan_unit_state');
  const planUnitIntendedUseOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.plan_unit_intended_use');

  return (
    <BoxItem className='no-border-on-last-child'>
      <Row>
        <Column small={12} medium={6} large={6}>
          <FormTitleAndText
            title='Tunnus'
            text={planUnit.identifier || '-'}
          />
        </Column>
      </Row>

      <Row>
        <Column small={12} medium={6} large={3}>
          <FormTitleAndText
            title='Kokonaisala'
            text={planUnit.area ? `${formatNumber(planUnit.area)} m²` : '-'}
          />
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormTitleAndText
            title='Leikkausala'
            text={planUnit.section_area ? `${formatNumber(planUnit.section_area)} m²` : '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column small={12} medium={6} large={3}>
          <FormTitleAndText
            title='Asemakaava'
            text={planUnit.detailed_plan_identifier}
          />
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormTitleAndText
            title='Asemakaavan viimeisin käsittelypvm'
            text={formatDate(planUnit.detailed_plan_latest_processing_date) || '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column>
          <FormTitleAndText
            title='Asemakaavan viimeisin käsittelypvm huomautus'
            text={planUnit.detailed_plan_latest_processing_date_note || '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column small={12} medium={6} large={3}>
          <FormTitleAndText
            title='Tonttijaon tunnus'
            text={planUnit.plot_division_identifier || '-'}
          />
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormTitleAndText
            title='Tonttijaon olotila'
            text={getLabelOfOption(plotDivisionStateOptions, planUnit.plot_division_state) || '-'}
          />
        </Column>
        <Column small={12} medium={12} large={6}>
          <FormTitleAndText
            title='Tonttijaon hyväksymispvm'
            text={formatDate(planUnit.plot_division_date_of_approval) || '-'}
          />
        </Column>
      </Row>
      <Row>
        <Column small={12} medium={6} large={3}>
          <FormTitleAndText
            title='Kaavayksikön laji'
            text={getLabelOfOption(planUnitTypeOptions, planUnit.plan_unit_type) || '-'}
          />
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormTitleAndText
            title='Kaavayksikön olotila'
            text={getLabelOfOption(planUnitStateOptions, planUnit.plan_unit_state) || '-'}
          />
        </Column>
        <Column small={12} medium={12} large={6}>
          <FormTitleAndText
            title='Kaavayksikön käyttötarkoitus'
            text={getLabelOfOption(planUnitIntendedUseOptions, planUnit.plan_unit_intended_use) || '-'}
          />
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
