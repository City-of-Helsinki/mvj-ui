// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import BoxItem from '$components/content/BoxItem';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import ListItem from '$components/content/ListItem';
import ListItems from '$components/content/ListItems';
import SubTitle from '$components/content/SubTitle';
import {getAttributes} from '$src/leases/selectors';
import {formatDate, formatNumber, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  planUnit: Object,
}

const PlanUnitItem = ({attributes, planUnit}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.type');
  const plotDivisionStateOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.plot_division_state');
  const planUnitTypeOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.plan_unit_type');
  const planUnitStateOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.plan_unit_state');
  const planUnitIntendedUseOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.plan_unit_intended_use');
  const addresses = get(planUnit, 'addresses', []);

  return (
    <BoxItem className='no-border-on-last-child'>
      <Row>
        <Column small={12} medium={6} large={6}>
          <FormTitleAndText
            title='Tunnus'
            text={planUnit.identifier || '-'}
          />
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormTitleAndText
            title='Määritelmä'
            text={getLabelOfOption(typeOptions, planUnit.type) || '-'}
          />
        </Column>
      </Row>
      <SubTitle>Osoite</SubTitle>
      {!addresses || !addresses.length && <p>Ei osoitteita</p>}
      {!!addresses.length &&
        <div>
          <Row>
            <Column small={6} large={6}>
              <FormTextTitle title='Osoite' />
            </Column>
            <Column small={3} large={3}>
              <FormTextTitle title='Postinumero' />
            </Column>
            <Column small={3} large={3}>
              <FormTextTitle title='Kaupunki' />
            </Column>
          </Row>
          <ListItems>
            {addresses.map((address) => {
              return (
                <Row key={address.id}>
                  <Column small={6} large={6}>
                    <ListItem>{address.address || '-'}</ListItem>
                  </Column>
                  <Column small={3} large={3}>
                    <ListItem>{address.postal_code || '-'}</ListItem>
                  </Column>
                  <Column small={3} large={3}>
                    <ListItem>{address.city || '-'}</ListItem>
                  </Column>
                </Row>
              );
            })}
          </ListItems>
        </div>
      }
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
