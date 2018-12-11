// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import BoxItem from '$components/content/BoxItem';
import FormTitleAndText from '$components/form/FormTitleAndText';
import KtjLink from '$components/ktj/KtjLink';
import SubTitle from '$components/content/SubTitle';
import {PlotType} from '$src/leases/enums';
import {
  formatDate,
  formatNumber,
  getAttributeFieldOptions,
  getLabelOfOption,
  getSearchQuery,
} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  isAreaActive: boolean,
  plot: Object,
  router: Object,
}

const PlotItem = ({attributes, isAreaActive, plot, router}: Props) => {
  const getMapLinkUrl = () => {
    const {location: {pathname, query}} = router;

    const tempQuery = {...query};
    delete tempQuery.lease_area;
    delete tempQuery.plan_unit;
    tempQuery.plot = plot.id,
    tempQuery.tab = 7;

    return `${pathname}${getSearchQuery(tempQuery)}`;
  };

  const mapLinkUrl = getMapLinkUrl();

  const typeOptions = getAttributeFieldOptions(attributes,
    'lease_areas.child.children.plots.child.children.type');

  return (
    <BoxItem className='no-border-on-first-child no-border-on-last-child'>
      <Row>
        <Column small={12} medium={6} large={6}>
          <FormTitleAndText
            title='Kohteen tunnus'
            text={<strong>{plot.identifier || '-'}</strong>}
          />
        </Column>
        <Column small={12} medium={3} large={3}>
          <FormTitleAndText
            title='Määritelmä'
            text={getLabelOfOption(typeOptions, plot.type) || '-'}
          />
        </Column>
        <Column small={12} medium={3} large={3}>
          {(isAreaActive && !isEmpty(plot.geometry)) && <Link to={mapLinkUrl}>Karttalinkki</Link>}
        </Column>
      </Row>

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
                prefix='ktjkii'
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
                prefix='ktjkii'
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

export default flowRight(
  withRouter,
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
      };
    }
  ),
)(PlotItem);
