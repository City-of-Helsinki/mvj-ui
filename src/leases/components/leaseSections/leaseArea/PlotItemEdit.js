// @flow
import React from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import {Link, withRouter} from 'react-router';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import FormField from '$components/form/FormField';
import KtjLink from '$components/ktj/KtjLink';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {FormNames, LeasePlotsFieldPaths, LeasePlotsFieldTitles, PlotType} from '$src/leases/enums';
import {getFieldAttributes, getSearchQuery, isFieldAllowedToEdit, isFieldAllowedToRead} from '$util/helpers';
import {getAttributes, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  field: string,
  geometry: ?Object,
  isSaveClicked: boolean,
  onRemove: Function,
  plotsData: Array<Object>,
  plotId: number,
  router: Object,
}

const PlotItemsEdit = ({
  attributes,
  field,
  geometry,
  isSaveClicked,
  onRemove,
  plotsData,
  plotId,
  router,
}: Props) => {
  const getMapLinkUrl = () => {
    const {location: {pathname, query}} = router;

    const tempQuery = {...query};
    delete tempQuery.lease_area;
    delete tempQuery.plan_unit;
    tempQuery.plot = plotId,
    tempQuery.tab = 7;

    return `${pathname}${getSearchQuery(tempQuery)}`;
  };

  const mapLinkUrl = getMapLinkUrl();

  const getPlotById = (id: number) => id ? plotsData.find((plot) => plot.id === id) : {};

  const savedPlot = getPlotById(plotId);

  return (
    <BoxItem>
      <BoxContentWrapper>
        <ActionButtonWrapper>
          <Authorization allow={isFieldAllowedToEdit(attributes, LeasePlotsFieldPaths.PLOTS)}>
            <RemoveButton
              onClick={onRemove}
              title="Poista kiinteistö / määräala"
            />
          </Authorization>
        </ActionButtonWrapper>
        <Row>
          <Column small={12} medium={6} large={6}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.IDENTIFIER)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeasePlotsFieldPaths.IDENTIFIER)}
                name={`${field}.identifier`}
                overrideValues={{label: LeasePlotsFieldTitles.IDENTIFIER}}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={3}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.TYPE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeasePlotsFieldPaths.TYPE)}
                name={`${field}.type`}
                overrideValues={{label: LeasePlotsFieldTitles.TYPE}}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={3} large={3}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.GEOMETRY)}>
              {!isEmpty(geometry) &&
                <Link to={mapLinkUrl}>{LeasePlotsFieldTitles.GEOMETRY}</Link>
              }
            </Authorization>
          </Column>
        </Row>

        <Row>
          <Column small={12} medium={6} large={3}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.AREA)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeasePlotsFieldPaths.AREA)}
                name={`${field}.area`}
                unit='m²'
                overrideValues={{label: LeasePlotsFieldTitles.AREA}}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={3}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.SECTION_AREA)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeasePlotsFieldPaths.SECTION_AREA)}
                name={`${field}.section_area`}
                unit='m²'
                overrideValues={{label: LeasePlotsFieldTitles.SECTION_AREA}}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={3}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.REGISTRATION_DATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeasePlotsFieldPaths.REGISTRATION_DATE)}
                name={`${field}.registration_date`}
                overrideValues={{label: LeasePlotsFieldTitles.REGISTRATION_DATE}}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={6} large={3}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.REPEAL_DATE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeasePlotsFieldPaths.REPEAL_DATE)}
                name={`${field}.repeal_date`}
                overrideValues={{label: LeasePlotsFieldTitles.REPEAL_DATE}}
              />
            </Authorization>
          </Column>
        </Row>
        <Authorization allow={isFieldAllowedToRead(attributes, LeasePlotsFieldPaths.IDENTIFIER)}>
          {savedPlot && savedPlot.identifier && <SubTitle>Ktj-dokumentit</SubTitle>}
          {savedPlot && savedPlot.identifier &&
            <Row>
              {savedPlot.type === PlotType.REAL_PROPERTY &&
                <Column small={12} medium={6}>
                  <KtjLink
                    fileKey='kiinteistorekisteriote/rekisteriyksikko'
                    fileName='kiinteistorekisteriote'
                    identifier={savedPlot.identifier}
                    idKey='kiinteistotunnus'
                    label='Kiinteistörekisteriote'
                    prefix='ktjkii'
                  />
                </Column>
              }
              {savedPlot.type === PlotType.UNSEPARATED_PARCEL &&
                <Column small={12} medium={6}>
                  <KtjLink
                    fileKey='kiinteistorekisteriote/maaraala'
                    fileName='kiinteistorekisteriote'
                    identifier={savedPlot.identifier}
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
                  identifier={savedPlot.identifier}
                  idKey='kohdetunnus'
                  label='Lainhuutotodistus'
                />
              </Column>
              <Column small={12} medium={6}>
                <KtjLink
                  fileKey='rasitustodistus'
                  fileName='rasitustodistus'
                  identifier={savedPlot.identifier}
                  idKey='kohdetunnus'
                  label='Rasitustodistus'
                />
              </Column>
            </Row>
          }
        </Authorization>
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
      const id = selector(state, `${props.field}.id`);

      return {
        attributes: getAttributes(state),
        geometry: selector(state, `${props.field}.geometry`),
        isSaveClicked: getIsSaveClicked(state),
        plotId: id,
      };
    }
  ),
)(PlotItemsEdit);
