// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import capitalize from 'lodash/capitalize';

import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import GreenBoxItem from '$components/content/GreenBoxItem';
import MapLink from '$components/content/MapLink';

type Props = {
  attributes: Object,
  planUnit: Object,
}

const PlanUnitItem = ({attributes, planUnit}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.type');
  const planUnitTypeOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.plan_unit_type');
  const planUnitStateOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plan_units.child.children.plan_unit_state');

  const getIdentifier = (item: Object) => {
    return `Kaavayksikkö ${item.identifier || '-'}`;
  };
  const getFullAddress = (item: Object) => {
    return `${capitalize(item.address)}, ${item.postal_code} ${item.city}`;
  };

  return (
    <GreenBoxItem>
      <Row>
        <Column medium={12}>
          <MapLink
            label={getIdentifier(planUnit)}
            onClick={() => console.log('Open map')}
            title={getIdentifier(planUnit)}
          />
        </Column>
      </Row>
      <Row>
        <Column medium={6}>
          <label>Osoite</label>
          <p>{getFullAddress(planUnit)}</p>

          <label>Tonttijaon tunnus</label>
          <p>{planUnit.plot_division_identifier || '-'}</p>

          <label>Tonttijaon hyväksymispäivämäärä</label>
          <p>{formatDate(planUnit.plot_division_date_of_approval) || '-'}</p>

          <label>Asemakaava</label>
          <p>{planUnit.detailed_plan_identifier}</p>

          <label>Asemakaavan vahvistumispvm</label>
          <p>{formatDate(planUnit.detailed_plan_date_of_approval) || '-'}</p>

          <label>Kaavayksikön laji</label>
          <p className='no-margin'>{getLabelOfOption(planUnitTypeOptions, planUnit.plan_unit_type) || '-'}</p>
        </Column>
        <Column medium={6}>
          <label>Kokonaisala</label>
          <p>{planUnit.area} m<sup>2</sup></p>

          <label>Leikkausala</label>
          <p>{planUnit.section_area} m<sup>2</sup></p>

          {/* <label>Olotila</label>
          <p>{getLabelOfOption(planUnitStateOptions, item.state) || '-'}</p> */}

          <label>Käyttötarkoitus</label>
          <p>{getLabelOfOption(typeOptions, planUnit.type) || '-'}</p>

          <label>Kaavayksikön olotila</label>
          <p className='no-margin'>{getLabelOfOption(planUnitStateOptions, planUnit.plan_unit_state) || '-'}</p>
        </Column>
      </Row>
    </GreenBoxItem>
  );
};

export default PlanUnitItem;
