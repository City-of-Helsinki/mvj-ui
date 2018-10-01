// @flow
import React from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import FormField from '$components/form/FormField';
import KtjLink from '$components/ktj/KtjLink';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {FormNames, PlotType} from '$src/leases/enums';
import {getAttributes, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  field: string,
  isSaveClicked: boolean,
  onRemove: Function,
  plotsData: Array<Object>,
  plotId: number,
}

const PlotItemsEdit = ({
  attributes,
  field,
  isSaveClicked,
  onRemove,
  plotsData,
  plotId,
}: Props) => {
  const getPlotById = (id: number) => id ? plotsData.find((plot) => plot.id === id) : {};

  const savedPlot = getPlotById(plotId);

  return (
    <BoxItem>
      <BoxContentWrapper>
        <RemoveButton
          className='position-topright'
          onClick={onRemove}
          title="Poista kiinteistö / määräala"
        />
        <Row>
          <Column small={12} medium={6} large={6}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.identifier')}
              name={`${field}.identifier`}
              overrideValues={{
                label: 'Tunnus',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.type')}
              name={`${field}.type`}
              overrideValues={{
                label: 'Määritelmä',
              }}
            />
          </Column>
        </Row>

        <Row>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.area')}
              name={`${field}.area`}
              unit='m²'
              overrideValues={{
                label: 'Kokonaisala',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.section_area')}
              name={`${field}.section_area`}
              unit='m²'
              overrideValues={{
                label: 'Leikkausala',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.registration_date')}
              name={`${field}.registration_date`}
              overrideValues={{
                label: 'Rekisteröintipvm',
              }}
            />
          </Column>
          <Column small={12} medium={6} large={3}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.repeal_date')}
              name={`${field}.repeal_date`}
              overrideValues={{
                label: 'Kumoamispvm',
              }}
            />
          </Column>
        </Row>
        {get(savedPlot, 'identifier') &&
          <SubTitle>Ktj-dokumentit</SubTitle>
        }
        {get(savedPlot, 'identifier') &&
          <Row>
            {get(savedPlot, 'type') === PlotType.REAL_PROPERTY &&
              <Column small={12} medium={6}>
                <KtjLink
                  fileKey='kiinteistorekisteriote/rekisteriyksikko'
                  fileName='kiinteistorekisteriote'
                  identifier={get(savedPlot, 'identifier')}
                  idKey='kiinteistotunnus'
                  label='Kiinteistörekisteriote'
                />
              </Column>
            }
            {get(savedPlot, 'type') === PlotType.UNSEPARATED_PARCEL &&
              <Column small={12} medium={6}>
                <KtjLink
                  fileKey='kiinteistorekisteriote/maaraala'
                  fileName='kiinteistorekisteriote'
                  identifier={get(savedPlot, 'identifier')}
                  idKey='maaraalatunnus'
                  label='Kiinteistörekisteriote'
                />
              </Column>
            }
            <Column small={12} medium={6}>
              <KtjLink
                fileKey='lainhuutotodistus'
                fileName='lainhuutotodistus'
                identifier={get(savedPlot, 'identifier')}
                idKey='kohdetunnus'
                label='Lainhuutotodistus'
              />
            </Column>
            <Column small={12} medium={6}>
              <KtjLink
                fileKey='rasitustodistus'
                fileName='rasitustodistus'
                identifier={get(savedPlot, 'identifier')}
                idKey='kohdetunnus'
                label='Rasitustodistus'
              />
            </Column>
          </Row>
        }
      </BoxContentWrapper>
    </BoxItem>
  );
};

const formName = FormNames.LEASE_AREAS;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    const id = selector(state, `${props.field}.id`);

    return {
      attributes: getAttributes(state),
      isSaveClicked: getIsSaveClicked(state),
      plotId: id,
    };
  }
)(PlotItemsEdit);
