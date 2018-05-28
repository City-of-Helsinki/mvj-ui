// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  buttonTitle: string,
  title: string,
  fields: any,
}

const PlanUnitItemsEdit = ({attributes, buttonTitle, title, fields}: Props) => {
  return (
    <div>
      <Collapse
        className='collapse__secondary'
        defaultOpen={true}
        headerTitle={
          <h4 className='collapse__header-title'>{title}</h4>
        }
      >
        <BoxItemContainer>
          {fields.map((planunit, index) =>
            <BoxItem className='no-border-on-first-child' key={planunit.id ? planunit.id : `index_${index}`}>
              <BoxContentWrapper>
                <RemoveButton
                  className='position-topright'
                  onClick={() => fields.remove(index)}
                  title="Poista kaavayksikkö"
                />
                <Row>
                  <Column small={12} medium={6} large={6}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.identifier')}
                      name={`${planunit}.identifier`}
                      overrideValues={{
                        label: 'Tunnus',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.type')}
                      name={`${planunit}.type`}
                      overrideValues={{
                        label: 'Määritelmä',
                      }}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={12} medium={12} large={6}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.address')}
                      name={`${planunit}.address`}
                      overrideValues={{
                        label: 'Osoite',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.postal_code')}
                      name={`${planunit}.postal_code`}
                      overrideValues={{
                        label: 'Postinumero',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.city')}
                      name={`${planunit}.city`}
                      overrideValues={{
                        label: 'Kaupunki',
                      }}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.area')}
                      name={`${planunit}.area`}
                      overrideValues={{
                        label: 'Kokonaisala',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.section_area')}
                      name={`${planunit}.section_area`}
                      overrideValues={{
                        label: 'Leikkausala',
                      }}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.detailed_plan_identifier')}
                      name={`${planunit}.detailed_plan_identifier`}
                      overrideValues={{
                        label: 'Asemakaava',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.detailed_plan_latest_processing_date')}
                      name={`${planunit}.detailed_plan_latest_processing_date`}
                      overrideValues={{
                        label: 'Asemakaavan viimeisin käsittelypvm',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.detailed_plan_latest_processing_date_note')}
                      name={`${planunit}.detailed_plan_latest_processing_date_note`}
                      overrideValues={{
                        label: 'Asemakaavan viimeisin käsittelypvm selite',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>

                  </Column>
                </Row>
                <Row>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plot_division_identifier')}
                      name={`${planunit}.plot_division_identifier`}
                      overrideValues={{
                        label: 'Tonttijaon tunnus',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plot_division_date_of_approval')}
                      name={`${planunit}.plot_division_date_of_approval`}
                      overrideValues={{
                        label: 'Tonttijaon hyväksymispvm',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plot_division_state')}
                      name={`${planunit}.plot_division_state`}
                      overrideValues={{
                        label: 'Tonttijaon olotila',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>

                  </Column>
                </Row>
                <Row>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plan_unit_type')}
                      name={`${planunit}.plan_unit_type`}
                      overrideValues={{
                        label: 'Kaavayksikön laji',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plan_unit_state')}
                      name={`${planunit}.plan_unit_state`}
                      overrideValues={{
                        label: 'Kaavayksikön olotila',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}>
                    <FormField
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plan_unit_intended_use')}
                      name={`${planunit}.plan_unit_intended_use`}
                      overrideValues={{
                        label: 'Kaavayksikön käyttötarkoitus',
                      }}
                    />
                  </Column>
                  <Column small={12} medium={6} large={3}></Column>
                </Row>
              </BoxContentWrapper>
            </BoxItem>
          )}
        </BoxItemContainer>
        <Row>
          <Column>
            <AddButtonSecondary
              label={buttonTitle}
              onClick={() => fields.push({})}
              title={buttonTitle}
            />
          </Column>
        </Row>
      </Collapse>
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  }
)(PlanUnitItemsEdit);
