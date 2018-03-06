// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import capitalize from 'lodash/capitalize';
import get from 'lodash/get';

import {formatDate, getLabelOfOption} from '$util/helpers';
import GreenBoxItem from '$components/content/GreenBoxItem';
import MapLink from '$components/content/MapLink';

import {
  planUnitConditionOptions,
  planUnitStateOptions,
  planUnitTypeOptions,
  planUnitUseOptions,
} from '../../../../constants';

type Props = {
  item: Object,
}

const PropertyUnitPlanPlotItem = (props: Props) => {
  const {item} = props;

  const getIdentifier = (item: Object) => {
    return `${capitalize(get(item, 'explanation', ''))} ${get(item, 'municipality', '')}-${get(item, 'district', '')}-${get(item, 'group_number', '')}-${get(item, 'unit_number', '')}`;
  };

  return (
    <GreenBoxItem>
      <Row>
        <Column medium={12}>
          <MapLink
            label={getIdentifier(item)}
            onClick={() => console.log('Open map')}
            title={getIdentifier(item)}
          />
        </Column>
      </Row>
      <Row>
        <Column medium={6}>
          <label>Osoite</label>
          <p>{`${capitalize(item.address)}, ${item.zip_code} ${item.town}`}</p>

          <label>Tonttijaon tunnus</label>
          <p>{item.plot_division_id}</p>

          <label>Tonttijaon hyväksymispäivämäärä</label>
          <p>{formatDate(item.plot_division_approval_date) || '-'}</p>

          <label>Asemakaava</label>
          <p>{item.plan}</p>

          <label>Asemakaavan vahvistumispäivämäärä</label>
          <p>{formatDate(item.plan_approval_date) || '-'}</p>

          <label>Kaavayksikön laji</label>
          <p className='no-margin'>{getLabelOfOption(planUnitTypeOptions, item.planplot_type) || '-'}</p>
        </Column>
        <Column medium={6}>
          <label>Kokonaisala</label>
          <p>{item.full_area} m<sup>2</sup></p>

          <label>Leikkausala</label>
          <p>{item.intersection_area} m<sup>2</sup></p>

          <label>Olotila</label>
          <p>{getLabelOfOption(planUnitStateOptions, item.state) || '-'}</p>

          <label>Käyttötarkoitus</label>
          <p>{getLabelOfOption(planUnitUseOptions, item.use) || '-'}</p>

          <label>Kaavayksikön olotila</label>
          <p className='no-margin'>{getLabelOfOption(planUnitConditionOptions, item.planplot_condition) || '-'}</p>
        </Column>
      </Row>
    </GreenBoxItem>
  );
};

export default PropertyUnitPlanPlotItem;
