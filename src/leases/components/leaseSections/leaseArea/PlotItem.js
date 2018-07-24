// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import BoxItem from '$components/content/BoxItem';
import FormFieldLabel from '$components/form/FormFieldLabel';
import KtjLink from '$components/ktj/KtjLink';
import ListItems from '$components/content/ListItems';
import SubTitle from '$components/content/SubTitle';
import {PlotType} from '$src/leases/enums';
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
  const addresses = get(plot, 'addresses', []);

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
        <Column small={6} large={6}>
          <FormFieldLabel>Osoite</FormFieldLabel>
        </Column>
        <Column small={3} large={3}>
          <FormFieldLabel>Postinumero</FormFieldLabel>
        </Column>
        <Column small={3} large={3}>
          <FormFieldLabel>Kaupunki</FormFieldLabel>
        </Column>
      </Row>
      {!addresses.length &&
        <Row>
          <Column small={6} large={6}>
            <p>-</p>
          </Column>
          <Column small={3} large={3}>
            <p>-</p>
          </Column>
          <Column small={3} large={3}>
            <p>-</p>
          </Column>
        </Row>
      }
      {!!addresses.length &&
        <div>
          <ListItems>
            {addresses.map((address) => {
              return (
                <Row key={address.id}>
                  <Column small={6} large={6}>
                    <p className='no-margin'>{address.address || '-'}</p>
                  </Column>
                  <Column small={3} large={3}>
                    <p className='no-margin'>{address.postal_code || '-'}</p>
                  </Column>
                  <Column small={3} large={3}>
                    <p className='no-margin'>{address.city || '-'}</p>
                  </Column>
                </Row>
              );
            })}
          </ListItems>
        </div>
      }
      <Row>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Kokonaisala</FormFieldLabel>
          <p>{plot.area ? `${formatNumber(plot.area)} m²` : '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Leikkausala</FormFieldLabel>
          <p>{plot.section_area ? `${formatNumber(plot.section_area)} m²` : '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Rekisteröintipvm</FormFieldLabel>
          <p>{formatDate(plot.registration_date) || '-'}</p>
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormFieldLabel>Kumoamispvm</FormFieldLabel>
          <p>{formatDate(plot.repeal_date) || '-'}</p>
        </Column>
      </Row>
      <SubTitle>Ktj-dokumentit</SubTitle>
      {plot.identifier &&
        <Row>
          {plot.type === PlotType.REAL_PROPERTY &&
            <Column small={12} medium={6}>
              <KtjLink
                fileKey='kiinteistorekisteriote/rekisteriyksikko'
                fileName='kiinteistorekisteriote'
                identifier={plot.identifier}
                idKey='kiinteistotunnus'
                label='Kiinteistörekisteriote'
              />
            </Column>
          }
          {plot.type === PlotType.UNSEPARATED_PARCEL &&
            <Column small={12} medium={6}>
              <KtjLink
                fileKey='kiinteistorekisteriote/maaraala'
                fileName='kiinteistorekisteriote'
                identifier={plot.identifier}
                idKey='maaraalatunnus'
                label='Kiinteistörekisteriote'
              />
            </Column>
          }
          <Column small={12} medium={6}>
            <KtjLink
              fileKey='lainhuutotodistus'
              fileName='lainhuutotodistus'
              identifier={plot.identifier}
              idKey='kohdetunnus'
              label='Lainhuutotodistus'
            />
          </Column>
          <Column small={12} medium={6}>
            <KtjLink
              fileKey='rasitustodistus'
              fileName='rasitustodistus'
              identifier={plot.identifier}
              idKey='kohdetunnus'
              label='Rasitustodistus'
            />
          </Column>
        </Row>
      }
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
