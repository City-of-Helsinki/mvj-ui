// @flow
import React from 'react';
import {connect} from 'react-redux';
import {FieldArray, formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonThird from '$components/form/AddButtonThird';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import KtjLink from '$components/ktj/KtjLink';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {DeleteModalLabels, DeleteModalTitles, FormNames, PlotType} from '$src/leases/enums';
import {getAttributes, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type AddressesProps = {
  attributes: Attributes,
  fields: any,
  isSaveClicked: boolean,
}

const AddressItems = ({attributes, fields, isSaveClicked}: AddressesProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            <SubTitle>Osoite</SubTitle>
            {fields && !!fields.length &&
              <Row>
                <Column small={6} large={6}>
                  <FormFieldLabel required>Osoite</FormFieldLabel>
                </Column>
                <Column small={3} large={3}>
                  <FormFieldLabel>Postinumero</FormFieldLabel>
                </Column>
                <Column small={3} large={3}>
                  <FormFieldLabel>Kaupunki</FormFieldLabel>
                </Column>
              </Row>
            }
            {fields && !!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_DELETE_MODAL,
                  deleteFunction: () => {
                    fields.remove(index);
                  },
                  deleteModalLabel: DeleteModalLabels.ADDRESS,
                  deleteModalTitle: DeleteModalTitles.ADDRESS,
                });
              };

              return (
                <Row key={index}>
                  <Column small={6} large={6}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.addresses.child.children.address')}
                      name={`${field}.address`}
                      overrideValues={{
                        label: '',
                      }}
                    />
                  </Column>
                  <Column small={3} large={3}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.addresses.child.children.postal_code')}
                      name={`${field}.postal_code`}
                      overrideValues={{
                        label: '',
                      }}
                    />
                  </Column>
                  <Column small={3} large={3}>
                    <FieldAndRemoveButtonWrapper
                      field={
                        <FormField
                          disableTouched={isSaveClicked}
                          fieldAttributes={get(attributes, 'lease_areas.child.children.plots.child.children.addresses.child.children.city')}
                          name={`${field}.city`}
                          overrideValues={{
                            label: '',
                          }}
                        />
                      }
                      removeButton={
                        <RemoveButton
                          className='third-level'
                          onClick={handleRemove}
                          title="Poista osoite"
                        />
                      }
                    />
                  </Column>
                </Row>
              );
            })}
            <Row>
              <Column>
                <AddButtonThird
                  label='Lisää osoite'
                  onClick={handleAdd}
                  title='Lisää osoite'
                />
              </Column>
            </Row>
          </div>
        );
      }}
    </AppConsumer>
  );
};

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

        <FieldArray
          attributes={attributes}
          component={AddressItems}
          isSaveClicked={isSaveClicked}
          name={`${field}.addresses`}
        />
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
