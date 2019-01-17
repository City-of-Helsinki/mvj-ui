// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Link, withRouter} from 'react-router';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import Authorization from '$components/authorization/Authorization';
import BoxItem from '$components/content/BoxItem';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import KtjLink from '$components/ktj/KtjLink';
import SubTitle from '$components/content/SubTitle';
import {
  LeasePlotsFieldPaths,
  LeasePlotsFieldTitles,
  PlotType,
} from '$src/leases/enums';
import {
  formatDate,
  formatNumber,
  getFieldOptions,
  getLabelOfOption,
  getSearchQuery,
  isEmptyValue,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

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

  const typeOptions = getFieldOptions(attributes, LeasePlotsFieldPaths.TYPE);

  return (
    <BoxItem className='no-border-on-first-child no-border-on-last-child'>
      <Row>
        <Column small={12} medium={6} large={6}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.IDENTIFIER)}>
            <FormTextTitle>{LeasePlotsFieldTitles.IDENTIFIER}</FormTextTitle>
            <FormText><strong>{plot.identifier || '-'}</strong></FormText>
          </Authorization>
        </Column>
        <Column small={12} medium={3} large={3}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.TYPE)}>
            <FormTextTitle>{LeasePlotsFieldTitles.TYPE}</FormTextTitle>
            <FormText>{getLabelOfOption(typeOptions, plot.type) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={12} medium={3} large={3}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.GEOMETRY)}>
            {(isAreaActive && !isEmpty(plot.geometry)) &&
              <Link to={mapLinkUrl}>{LeasePlotsFieldTitles.GEOMETRY}</Link>
            }
          </Authorization>
        </Column>
      </Row>

      <Row>
        <Column small={12} medium={6} large={3}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.AREA)}>
            <FormTextTitle>{LeasePlotsFieldTitles.AREA}</FormTextTitle>
            <FormText>{!isEmptyValue(plot.area) ? `${formatNumber(plot.area)} m²` : '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={12} medium={6} large={3}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.SECTION_AREA)}>
            <FormTextTitle>{LeasePlotsFieldTitles.SECTION_AREA}</FormTextTitle>
            <FormText>{!isEmptyValue(plot.section_area) ? `${formatNumber(plot.section_area)} m²` : '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={12} medium={6} large={3}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.REGISTRATION_DATE)}>
            <FormTextTitle>{LeasePlotsFieldTitles.REGISTRATION_DATE}</FormTextTitle>
            <FormText>{formatDate(plot.registration_date) || '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={12} medium={6} large={3}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.REPEAL_DATE)}>
            <FormTextTitle>{LeasePlotsFieldTitles.REPEAL_DATE}</FormTextTitle>
            <FormText>{formatDate(plot.repeal_date) || '-'}</FormText>
          </Authorization>
        </Column>
      </Row>

      <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.IDENTIFIER)}>
        {plot.identifier &&
          <Fragment>
            <SubTitle>{LeasePlotsFieldTitles.KTJ_LINK}</SubTitle>

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
          </Fragment>
        }
      </Authorization>
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
