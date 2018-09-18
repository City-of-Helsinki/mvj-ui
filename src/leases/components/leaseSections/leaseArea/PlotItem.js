// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import BoxItem from '$components/content/BoxItem';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import FormTitleAndText from '$components/form/FormTitleAndText';
import KtjLink from '$components/ktj/KtjLink';
import ListItem from '$components/content/ListItem';
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
    <BoxItem className='no-border-on-last-child'>
      <Row>
        <Column small={12} medium={6} large={6}>
          <FormTitleAndText
            title='Tunnus'
            text={<strong>{plot.identifier || '-'}</strong>}
          />
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormTitleAndText
            title='Määritelmä'
            text={getLabelOfOption(typeOptions, plot.type) || '-'}
          />
        </Column>
      </Row>
      <SubTitle>Osoite</SubTitle>
      {!addresses || !addresses.length && <FormText>Ei osoitteita</FormText>}
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
            text={plot.area ? `${formatNumber(plot.area)} m²` : '-'}
          />
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormTitleAndText
            title='Leikkausala'
            text={plot.section_area ? `${formatNumber(plot.section_area)} m²` : '-'}
          />
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormTitleAndText
            title='Rekisteröintipvm'
            text={formatDate(plot.registration_date) || '-'}
          />
        </Column>
        <Column small={12} medium={6} large={3}>
          <FormTitleAndText
            title='Kumoamispvm'
            text={formatDate(plot.repeal_date) || '-'}
          />
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
