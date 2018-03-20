// @flow
import React, {Component} from 'react';
import {Field, FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import AddButton from '$components/form/AddButton';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import ContentItem from '$components/content/ContentItem';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import FormSection from '$components/form/FormSection';
import PlotItemsEdit from './PlotItemsEdit';
import RemoveButton from '$components/form/RemoveButton';
import WhiteBoxEdit from '$components/content/WhiteBoxEdit';
import {getAttributeFieldOptions} from '$src/util/helpers';
import {decimalNumber, required} from '$components/form/validations';

type AreaItemProps = {
  fields: any,
  locationOptions: Array<Object>,
  plotTypeOptions: Array<Object>,
  typeOptions: Array<Object>,
}

const LeaseAreaItem = ({
  fields,
  locationOptions,
  plotTypeOptions,
  typeOptions,
}: AreaItemProps) => {
  return (
    <div>
      {fields && fields.length > 0 && fields.map((area, index) => {
        return (
          <ContentItem key={index}>
            <WhiteBoxEdit>
              <BoxContentWrapper>
                <RemoveButton
                  className='position-topright-no-padding'
                  onClick={() => fields.remove(index)}
                  title="Poista vuokra-alue"
                />
                <Row>
                  <Column medium={4}>
                    <Field
                      component={FieldTypeText}
                      label='Kohteen tunnus'
                      name={`${area}.identifier`}
                      type="text"
                      validate={[
                        (value) => required(value, 'Kohteen tunnus on pakollinen'),
                      ]}
                    />
                  </Column>
                  <Column medium={2}>
                    <Field
                      name={`${area}.type`}
                      component={FieldTypeSelect}
                      label='Selite'
                      options={typeOptions}
                      validate={[
                        (value) => required(value, 'Selite on pakollinen'),
                      ]}
                    />
                  </Column>
                  <Column medium={3}>
                    <Field
                      name={`${area}.area`}
                      type="text"
                      component={FieldTypeText}
                      label="Pinta-ala"
                      validate={[
                        (value) => required(value, 'Pinta-ala on pakollinen'),
                        (value) => decimalNumber(value, 'Pinta-alan tulee olla numero'),
                      ]}
                    />
                  </Column>
                  <Column medium={3}>
                    <Field
                      name={`${area}.location`}
                      component={FieldTypeSelect}
                      label='Sijainti'
                      options={locationOptions}
                      validate={[
                        (value) => required(value, 'Sijainti on pakollinen'),
                      ]}
                    />
                  </Column>
                </Row>
                <Row>
                  <Column medium={6}>
                    <Field
                      className='no-margin'
                      component={FieldTypeText}
                      label="Osoite"
                      name={`${area}.address`}
                      validate={[
                        (value) => required(value, 'Osoite on pakollinen'),
                      ]}
                    />
                  </Column>
                  <Column medium={3}>
                    <Field
                      className='no-margin'
                      component={FieldTypeText}
                      label="Postinumero"
                      name={`${area}.postal_code`}
                      validate={[
                        (value) => required(value, 'Postinumero on pakollinen'),
                      ]}
                    />
                  </Column>
                  <Column medium={3}>
                    <Field
                      className='no-margin'
                      component={FieldTypeText}
                      label="Kaupunki"
                      name={`${area}.city`}
                      validate={[
                        (value) => required(value, 'Kaupunki on pakollinen'),
                      ]}
                    />
                  </Column>
                </Row>
              </BoxContentWrapper>
            </WhiteBoxEdit>
            <FieldArray
              component={PlotItemsEdit}
              name={`${area}.plots_contract`}
              title='Kiinteistöt / määräalat sopimushetkellä'
              typeOptions={plotTypeOptions}
            />
            <FieldArray
              component={PlotItemsEdit}
              name={`${area}.plots_current`}
              title='Kiinteistöt / määräalat nykyhetkellä'
              typeOptions={plotTypeOptions}
            />
            {/* <FieldArray title='Kaavayksiköt sopimushetkellä' name={`${district}.plan_plots_in_contract`} component={PlanUnitItemsEdit}/>
            <FieldArray title='Kaavayksiköt nykyhetkellä' name={`${district}.plan_plots_at_present`} component={PlanUnitItemsEdit}/> */}
          </ContentItem>
        );
      })}
      <Row>
        <Column>
          <AddButton
            label='Lisää uusi kohde'
            onClick={() => fields.push({})}
            title='Lisää uusi kohde'
          />
        </Column>
      </Row>
    </div>
  );
};

type Props = {
  areas: Array<Object>,
  attributes: Object,
  handleSubmit: Function,
  dispatch: Function,
}

class LeaseAreasEdit extends Component {
  props: Props

  render () {
    const {areas, attributes, handleSubmit} = this.props;
    const locationOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.location');
    const typeOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.type');
    const plotTypeOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.plots.child.children.type');

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FieldArray
            areas={areas}
            component={LeaseAreaItem}
            locationOptions={locationOptions}
            name="lease_areas"
            plotTypeOptions={plotTypeOptions}
            typeOptions={typeOptions}
          />
        </FormSection>
      </form>
    );
  }
}

const formName = 'lease-area-form';

export default flowRight(
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(LeaseAreasEdit);
