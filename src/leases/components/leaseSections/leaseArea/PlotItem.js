// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import BoxItem from '$components/content/BoxItem';
import FormFieldLabel from '$components/form/FormFieldLabel';
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
          <FormFieldLabel>Tunnus</FormFieldLabel>
          <p><strong>{plot.identifier || '-'}</strong></p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Määritelmä</FormFieldLabel>
          <p>{getLabelOfOption(typeOptions, plot.type) || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column small={12} medium={12} large={6}>
          <FormFieldLabel>Osoite</FormFieldLabel>
          <p>{plot.address || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Postinumero</FormFieldLabel>
          <p>{plot.postal_code || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Kaupunki</FormFieldLabel>
          <p>{plot.city || '-'}</p>
        </Column>
      </Row>
      <Row>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Kokonaisala</FormFieldLabel>
          <p>{formatNumber(plot.area) || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Leikkausala</FormFieldLabel>
          <p>{formatNumber(plot.section_area) || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Rekisteröintipäivä</FormFieldLabel>
          <p>{formatDate(plot.registration_date) || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Kumoamispvm</FormFieldLabel>
          <p>{formatDate(plot.repeal_date) || '-'}</p>
        </Column>
      </Row>
      <p className='sub-title'>Ktj-dokumentit</p>
      <Row>
        <Column small={12} medium={6}>
          <a onClick={() => alert('TODO')}>Lainhuutotodistus</a>
        </Column>
        <Column small={12} medium={6}>
          <a onClick={() => alert('TODO')}>Lainhuutotodistus</a>
        </Column>
        <Column small={12} medium={6}>
          <a onClick={() => alert('TODO')}>Kiinteistörekisteriote</a>
        </Column>
        <Column small={12} medium={6}>
          <a onClick={() => alert('TODO')}>Kiinteistörekisteriote</a>
        </Column>
        <Column small={12} medium={6}>
          <a onClick={() => alert('TODO')}>Rasitustodistus</a>
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
