// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import GreenBoxItem from '$components/content/GreenBoxItem';

type Props = {
  attributes: Object,
  plot: Object,
}

const PlotItem = ({attributes, plot}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plots.child.children.type');

  return (
    <GreenBoxItem className='no-border-on-first-child'>
      <Row>
        <Column small={6} medium={4} large={2}>
          <label>Tunnus</label>
          <p><strong>{plot.identifier || '-'}</strong></p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Selite</label>
          <p>{getLabelOfOption(typeOptions, plot.type) || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Kokonaisala</label>
          <p>{plot.area || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Leikkausala</label>
          <p>{plot.section_area || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Rekisteröintipäivä</label>
          <p>{formatDate(plot.registration_date) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column small={12} medium={12} large={4}>
          <label>Osoite</label>
          <p>{plot.address || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Postinumero</label>
          <p>{plot.postal_code || '-'}</p>
        </Column>
        <Column small={6} medium={4} large={2}>
          <label>Kaupunki</label>
          <p>{plot.city || '-'}</p>
        </Column>
      </Row>
    </GreenBoxItem>
  );
};

export default PlotItem;
