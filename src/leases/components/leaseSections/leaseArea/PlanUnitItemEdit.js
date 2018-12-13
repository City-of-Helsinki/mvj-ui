// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {Link, withRouter} from 'react-router';
import {formValueSelector} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {FormNames} from '$src/leases/enums';
import {getSearchQuery} from '$util/helpers';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  field: string,
  geometry: ?Object,
  id: number,
  isSaveClicked: boolean,
  onRemove: Function,
  router: Object,
}

const PlanUnitItemEdit = ({
  attributes,
  field,
  geometry,
  id,
  isSaveClicked,
  onRemove,
  router,
}: Props) => {
  const getMapLinkUrl = () => {
    const {location: {pathname, query}} = router;

    const tempQuery = {...query};
    delete tempQuery.lease_area;
    delete tempQuery.plot;
    tempQuery.plan_unit = id,
    tempQuery.tab = 7;

    return `${pathname}${getSearchQuery(tempQuery)}`;
  };
  const mapLinkUrl = getMapLinkUrl();

  return (
    <BoxItem>
      <BoxContentWrapper>
        <ActionButtonWrapper>
          <RemoveButton
            onClick={onRemove}
            title="Poista kaavayksikkö"
          />
        </ActionButtonWrapper>
        <Row>
          <Column small={12} medium={6} large={6}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.identifier')}
              name={`${field}.identifier`}
              overrideValues={{
                label: 'Kohteen tunnus',
              }}
            />
          </Column>
          <Column small={12} medium={3} large={3}>
            {!isEmpty(geometry) && <Link to={mapLinkUrl}>Karttalinkki</Link>}
          </Column>
        </Row>

        <Row>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.area')}
              name={`${field}.area`}
              unit='m²'
              overrideValues={{
                label: 'Kokonaisala',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.section_area')}
              name={`${field}.section_area`}
              unit='m²'
              overrideValues={{
                label: 'Leikkausala',
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.detailed_plan_identifier')}
              name={`${field}.detailed_plan_identifier`}
              overrideValues={{
                label: 'Asemakaava',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.detailed_plan_latest_processing_date')}
              name={`${field}.detailed_plan_latest_processing_date`}
              overrideValues={{
                label: 'Asemakaavan viimeisin käsittelypvm',
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.detailed_plan_latest_processing_date_note')}
              name={`${field}.detailed_plan_latest_processing_date_note`}
              overrideValues={{
                label: 'Asemakaavan viimeisin käsittelypvm huomautus',
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plot_division_identifier')}
              name={`${field}.plot_division_identifier`}
              overrideValues={{
                label: 'Tonttijaon tunnus',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plot_division_state')}
              name={`${field}.plot_division_state`}
              overrideValues={{
                label: 'Tonttijaon olotila',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plot_division_date_of_approval')}
              name={`${field}.plot_division_date_of_approval`}
              overrideValues={{
                label: 'Tonttijaon hyväksymispvm',
              }}
            />
          </Column>
        </Row>
        <Row>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plan_unit_type')}
              name={`${field}.plan_unit_type`}
              overrideValues={{
                label: 'Kaavayksikön laji',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plan_unit_state')}
              name={`${field}.plan_unit_state`}
              overrideValues={{
                label: 'Kaavayksikön olotila',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plan_units.child.children.plan_unit_intended_use')}
              name={`${field}.plan_unit_intended_use`}
              overrideValues={{
                label: 'Kaavayksikön käyttötarkoitus',
              }}
            />
          </Column>
        </Row>
      </BoxContentWrapper>
    </BoxItem>
  );
};

const formName = FormNames.LEASE_AREAS;
const selector = formValueSelector(formName);

export default flowRight(
  withRouter,
  connect(
    (state, props) => {
      return {
        geometry: selector(state, `${props.field}.geometry`),
        id: selector(state, `${props.field}.id`),
      };
    }
  ),
)(PlanUnitItemEdit);
