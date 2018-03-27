// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Field, FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import AddButton from '$components/form/AddButton';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import ContentItem from '$components/content/ContentItem';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import FormSection from '$components/form/FormSection';
import PlotItemsEdit from './PlotItemsEdit';
import PlanUnitItemsEdit from './PlanUnitItemsEdit';
import RemoveButton from '$components/form/RemoveButton';
import WhiteBoxEdit from '$components/content/WhiteBoxEdit';
import {getAttributeFieldOptions} from '$src/util/helpers';
import {genericValidator} from '$components/form/validations';
import {getIsLeaseAreasFormValid} from '../../../selectors';
import {receiveLeaseAreasFormValid} from '../../../actions';

type AreaItemProps = {
  attributes: Object,
  fields: any,
}

const LeaseAreaItem = ({
  attributes,
  fields,
}: AreaItemProps) => {
  const locationOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.location');
  const typeOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.type');

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
                        (value) => genericValidator(value,
                          get(attributes, 'lease_areas.child.children.identifier')),
                      ]}
                    />
                  </Column>
                  <Column medium={2}>
                    <Field
                      component={FieldTypeSelect}
                      label='Selite'
                      name={`${area}.type`}
                      options={typeOptions}
                      validate={[
                        (value) => genericValidator(value,
                          get(attributes, 'lease_areas.child.children.type')),
                      ]}
                    />
                  </Column>
                  <Column medium={3}>
                    <Field
                      component={FieldTypeText}
                      label="Pinta-ala"
                      name={`${area}.area`}
                      validate={[
                        (value) => genericValidator(value,
                          get(attributes, 'lease_areas.child.children.area')),
                      ]}
                    />
                  </Column>
                  <Column medium={3}>
                    <Field
                      component={FieldTypeSelect}
                      label='Sijainti'
                      name={`${area}.location`}
                      options={locationOptions}
                      validate={[
                        (value) => genericValidator(value,
                          get(attributes, 'lease_areas.child.children.location')),
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
                        (value) => genericValidator(value,
                          get(attributes, 'lease_areas.child.children.address')),
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
                        (value) => genericValidator(value,
                          get(attributes, 'lease_areas.child.children.postal_code')),
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
                        (value) => genericValidator(value,
                          get(attributes, 'lease_areas.child.children.city')),
                      ]}
                    />
                  </Column>
                </Row>
              </BoxContentWrapper>
            </WhiteBoxEdit>
            <FieldArray
              attributes={attributes}
              component={PlotItemsEdit}
              name={`${area}.plots_contract`}
              title='Kiinteistöt / määräalat sopimushetkellä'
            />
            <FieldArray
              attributes={attributes}
              component={PlotItemsEdit}
              name={`${area}.plots_current`}
              title='Kiinteistöt / määräalat nykyhetkellä'
            />
            <FieldArray
              attributes={attributes}
              component={PlanUnitItemsEdit}
              name={`${area}.plan_units_contract`}
              title='Kaavayksiköt sopimushetkellä'
            />
            <FieldArray
              attributes={attributes}
              component={PlanUnitItemsEdit}
              name={`${area}.plan_units_current`}
              title='Kaavayksiköt nykyhetkellä'
            />
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
  isLeaseAreasFormValid: boolean,
  receiveLeaseAreasFormValid: Function,
  valid: boolean,
}

class LeaseAreasEdit extends Component {
  props: Props

  componentDidUpdate() {
    const {isLeaseAreasFormValid, receiveLeaseAreasFormValid, valid} = this.props;
    if(isLeaseAreasFormValid !== valid) {
      receiveLeaseAreasFormValid(valid);
    }
  }

  render () {
    const {areas, attributes, handleSubmit} = this.props;

    return (
      <form onSubmit={handleSubmit}>
        <FormSection>
          <FieldArray
            areas={areas}
            attributes={attributes}
            component={LeaseAreaItem}
            name="lease_areas"
          />
        </FormSection>
      </form>
    );
  }
}

const formName = 'lease-areas-form';

export default flowRight(
  connect(
    (state) => {
      return {
        isLeaseAreasFormValid: getIsLeaseAreasFormValid(state),
      };
    },
    {
      receiveLeaseAreasFormValid,
    }
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(LeaseAreasEdit);
