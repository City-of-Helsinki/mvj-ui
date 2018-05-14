// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import BoxItem from '$components/content/BoxItem';
import {formatDate, formatNumber, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  plot: Object,
}

const PlotItem = ({attributes, plot}: Props) => {
  const typeOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plots.child.children.type');

  return (
    <BoxItem className='no-border-on-first-child'>
      <Row>
        <Column small={12} medium={6} large={6}>
          <label>Tunnus</label>
          <p><strong>{plot.identifier || '-'}</strong></p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <label>Määritelmä</label>
          <p>{getLabelOfOption(typeOptions, plot.type) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column small={12} medium={12} large={6}>
          <label>Osoite</label>
          <p>{plot.address || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <label>Postinumero</label>
          <p>{plot.postal_code || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <label>Kaupunki</label>
          <p>{plot.city || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column small={12} medium={6} large={3}>
          <label>Kokonaisala</label>
          <p>{formatNumber(plot.area) || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <label>Leikkausala</label>
          <p>{formatNumber(plot.section_area) || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <label>Rekisteröintipäivä</label>
          <p>{formatDate(plot.registration_date) || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>
        </Column>
      </Row>
      <p className='sub-title'>Ktj-dokumentit</p>
      <Row>
        <Column small={12} medium={6}>
          <a>Lainhuutotodistus</a>
        </Column>
        <Column small={12} medium={6}>
          <a>Lainhuutotodistus</a>
        </Column>
        <Column small={12} medium={6}>
          <a>Kiinteistörekisteriote</a>
        </Column>
        <Column small={12} medium={6}>
          <a>Kiinteistörekisteriote</a>
        </Column>
        <Column small={12} medium={6}>
          <a>Rasitustodistus</a>
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
)(PlotItem);
