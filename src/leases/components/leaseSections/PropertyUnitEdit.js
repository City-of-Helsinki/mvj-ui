import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {Field, FieldArray, reduxForm, formValueSelector, arrayPush} from 'redux-form';

import trashIcon from '../../../../assets/icons/trash.svg';
import FormActionDropdown from '../../../components/FormActionDropdown';
import FieldTypeSelect from '../../../components/form/FieldTypeSelect';
import FieldTypeText from '../../../components/form/FieldTypeText';

type PropertyProps = {
  title: string,
  fields: Array<Object>,
}

const renderProperty = ({title, fields}: PropertyProps) => {
  if(fields.length === 0) {
    return null;
  }
  return (
    <div>
      {fields.length > 0 &&
        <Row>
          <Column>
            <h2>{title}</h2>
          </Column>
        </Row>
      }
      {fields.map((property, index) =>
        <div key={index} className='subsection-container'>
          <button
            className='remove-button'
            type="button"
            title="Poista kiinteistö / määräala"
            onClick={() => fields.remove(index)}>
            <img src={trashIcon} alt='Poista' />
          </button>
          <Row>
            <Column medium={3}>
              <Row>
                <Column>
                  <label className='mvj-form-field-label'>Tunnus</label>
                </Column>
              </Row>
              <Row>
                <Column small={4}>
                  <Field
                    name={`${property}.municipality`}
                    type="text"
                    component={FieldTypeText}/>
                </Column>
                <Column small={4}>
                  <Field
                    name={`${property}.district`}
                    type="text"
                    component={FieldTypeText}/>
                </Column>
                <Column small={4}>
                  <Field
                    name={`${property}.sequence`}
                    type="text"
                    component={FieldTypeText}/>
                </Column>
              </Row>

            </Column>
            <Column medium={3}>
            </Column>
            <Column medium={3}>
              <Field
                name={`${property}.full_area`}
                type="text"
                component={FieldTypeText}
                label='Kokonaisala'
                placeholder='Kokonaisala'/>
            </Column>
            <Column medium={3}>
              <Field
                name={`${property}.intersection_area`}
                type="text"
                component={FieldTypeText}
                label='Leikkausala'
                placeholder='Leikkausala'/>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field
                name={`${property}.address`}
                type="text"
                component={FieldTypeText}
                label='Osoite'
                placeholder='Osoite'/>
            </Column>
            <Column medium={2}>
              <Field
                name={`${property}.zip_code`}
                type="text"
                component={FieldTypeText}
                label="Postinumero"
                placeholder="Postinumero"/>
            </Column>
            <Column medium={3}>
              <Field
                name={`${property}.town`}
                type="text"
                component={FieldTypeText}
                label='Kaupunki'
                placeholder='Kaupunki'/>
            </Column>
            <Column medium={3}>
              <Field
                name={`${property}.registration_date`}
                type="text"
                component={FieldTypeText}
                label='Rekisteröintipäivä'
                placeholder='Rekisteröintipäivä'/>
            </Column>
          </Row>
        </div>
      )}
    </div>
  );
};

type PlanUnitProps = {
  title: string,
  fields: Array<Object>,
}

const renderPlanUnit = ({title, fields}: PlanUnitProps) => {
  if(fields.length === 0) {
    return null;
  }
  return (
    <div>
      <Row>
        <Column>
          <h2>{title}</h2>
        </Column>
      </Row>
      {fields.map((planunit, index) =>
        <div key={index} className='subsection-container'>
          <button
            className='remove-button'
            type="button"
            title="Poista kaavayksikkö"
            onClick={() => fields.remove(index)}>
            <img src={trashIcon} alt='Poista' />
          </button>
          <Row>
            <Column medium={3}>
              <Row>
                <Column>
                  <label className='mvj-form-field-label'>Tunnus</label>
                </Column>
              </Row>
              <Row>
                <Column small={4}>
                  <Field
                    name={`${planunit}.municipality`}
                    type="text"
                    component={FieldTypeText}/>
                </Column>
                <Column small={4}>
                  <Field
                    name={`${planunit}.district`}
                    type="text"
                    component={FieldTypeText}/>
                </Column>
                <Column small={4}>
                  <Field
                    name={`${planunit}.sequence`}
                    type="text"
                    component={FieldTypeText}/>
                </Column>
              </Row>
            </Column>
            <Column medium={3}>
            </Column>
            <Column medium={3}>
              <Field
                name={`${planunit}.full_area`}
                type="text"
                component={FieldTypeText}
                label='Kokonaisala'
                placeholder='Kokonaisala'/>
            </Column>
            <Column medium={3}>
              <Field
                name={`${planunit}.intersection_area`}
                type="text"
                component={FieldTypeText}
                label='Leikkausala'
                placeholder='Leikkausala'/>
            </Column>
          </Row>
          <Row>
            <Column medium={4}>
              <Field
                name={`${planunit}.address`}
                type="text"
                component={FieldTypeText}
                label='Osoite'
                placeholder='Osoite'/>
            </Column>
            <Column medium={2}>
              <Field
                name={`${planunit}.zip_code`}
                type="text"
                component={FieldTypeText}
                label='Postinumero'
                placeholder='Postinumero'/>
            </Column>
            <Column medium={3}>
              <Field
                name={`${planunit}.town`}
                type="text"
                component={FieldTypeText}
                label='Kaupunki'
                placeholder='Kaupunki'/>
            </Column>
            <Column medium={3}>
              <Field
                name={`${planunit}.state`}
                component={FieldTypeSelect}
                label='Olotila'
                options={[
                  {value: 'draft', label: 'Luonnos'},
                  {value: 'inuse', label: 'Voimassa'},
                ]}
              />
            </Column>
          </Row>
          <Row>
            <Column medium={3}>
              <Field
                name={`${planunit}.plot_division_id`}
                type="text"
                component={FieldTypeText}
                label='Tonttijaon tunnus'
                placeholder='Tonttijaon tunnus'/>
            </Column>
            <Column medium={3}>
              <Field
                name={`${planunit}.plot_division_approval_date`}
                type="text"
                component={FieldTypeText}
                label='Tonttijaon hyväksymispvm'
                placeholder='PP.KK.VVVV'/>
            </Column>
            <Column medium={3}>
              <Field
                name={`${planunit}.plan`}
                type="text"
                component={FieldTypeText}
                label='Asemakaava'
                placeholder='Asemakaava'/>
            </Column>
            <Column medium={3}>
              <Field
                name={`${planunit}.plan_approval_date`}
                type="text"
                component={FieldTypeText}
                label='Asemakaavan vahvistumispvm'
                placeholder='PP.KK.VVVV'/>
            </Column>
          </Row>
        </div>
      )}
    </div>
  );
};

type DistrictsProps = {
  fields: Array<Object>,
  dispatch: Function,
}

class RenderDistricts extends Component {
  props: DistrictsProps

  render () {
    const {dispatch, fields} = this.props;

    return (
      <div>
        {fields.map((district, index) => {
          return (
            <div key={index} className='property-unit'>
              <button
                className='remove-button'
                type="button"
                title="Poista vuokra-alue"
                onClick={() => fields.remove(index)}>
                <img src={trashIcon} alt='Poista' />
              </button>
              <Row>
                <Column medium={3}>
                  <Row>
                    <Column>
                      <label className='mvj-form-field-label'>Kohteen tunnus</label>
                    </Column>
                  </Row>
                  <Row>
                    <Column medium={4}>
                      <Field
                        name={`${district}.municipality`}
                        type="text"
                        component={FieldTypeText}/>
                    </Column>
                    <Column medium={4}>
                      <Field
                        name={`${district}.district`}
                        type="text"
                        component={FieldTypeText}/>
                    </Column>
                    <Column medium={4}>
                      <Field
                        name={`${district}.sequence`}
                        type="text"
                        component={FieldTypeText}/>
                    </Column>
                  </Row>
                </Column>
                <Column medium={3}></Column>
                <Column medium={3}></Column>
                <Column medium={3}>
                  <Field
                    name={`${district}.full_area`}
                    type="text"
                    component={FieldTypeText}
                    label="Pinta-ala"
                    placeholder="Pinta-ala"/>
                </Column>
              </Row>
              <Row>
                <Column medium={6}>
                  <Field
                    name={`${district}.address`}
                    type="text"
                    component={FieldTypeText}
                    label="Osoite"
                    placeholder="Osoite"/>
                </Column>
                <Column medium={3}>
                  <Field
                    name={`${district}.zip_code`}
                    type="text"
                    component={FieldTypeText}
                    label="Postinumero"
                    placeholder="Postinumero"/>
                </Column>
                <Column medium={3}>
                  <Field
                    name={`${district}.town`}
                    type="text"
                    component={FieldTypeText}
                    label="Kaupunki"
                    placeholder="Kaupunki"/>
                </Column>
              </Row>

              <FieldArray title='Kiinteistöt / määräalat nykyhetkellä' name={`${district}.plots_at_present`} component={renderProperty}/>
              <FieldArray title='Kiinteistöt / määräalat sopimushetkellä' name={`${district}.plots_in_contract`} component={renderProperty}/>
              <FieldArray title='Kaavayksikkö nykyhetkellä' name={`${district}.plan_plots_at_present`} component={renderPlanUnit}/>
              <FieldArray title='Kaavayksikkö sopimushetkellä' name={`${district}.plan_plots_in_contract`} component={renderPlanUnit}/>
              <Row>
                <Column>
                  <FormActionDropdown
                    title={'Lisää uusi'}
                    onOptionClick={(option) => {
                      switch(option) {
                        case 'contractProperty':
                          dispatch(arrayPush('property-unit-edit-form', `${district}.plots_in_contract`, {}));
                          break;
                        case 'currentProperty':
                          dispatch(arrayPush('property-unit-edit-form', `${district}.plots_at_present`, {}));
                          break;
                        case 'contractPlanUnit':
                          dispatch(arrayPush('property-unit-edit-form', `${district}.plan_plots_in_contract`, {}));
                          break;
                        case 'currentPlanUnit':
                          dispatch(arrayPush('property-unit-edit-form', `${district}.plan_plots_at_present`, {}));
                          break;
                      }
                    }}
                    options={[
                      {value: 'currentProperty', label: 'Kiinteistö / määräala nykyhetkellä'},
                      {value: 'contractProperty', label: 'Kiinteistö / määräala sopimushetkellä'},
                      {value: 'currentPlanUnit', label: 'Kaavayksikkö nykyhetkellä'},
                      {value: 'contractPlanUnit', label: 'Kaavayksikkö sopimushetkellä'},
                    ]}
                  />
                </Column>
              </Row>
            </div>
          );
        })}
        <Row>
          <Column>
            <button type="button" onClick={() => fields.push({})} className='add-button'>Lisää uusi kohde</button>
          </Column>
        </Row>
      </div>
    );
  }
}

type Props = {
  areas: Array<Object>,
  handleSubmit: Function,
  dispatch: Function,
}

class PropertyUnitEdit extends Component {
  props: Props

  render () {
    const {handleSubmit, dispatch} = this.props;

    return (
      <form onSubmit={handleSubmit} className='property-unit-edit'>
        <Row>
          <Column>
            <FieldArray name="areas" dispatch={dispatch} component={RenderDistricts}/>
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = 'property-unit-edit-form';
const selector = formValueSelector(formName);

export default flowRight(
  connect(
    (state) => {
      return {
        areas: selector(state, 'areas'),
      };
    }
  ),
  reduxForm({
    form: formName,
  }),
)(PropertyUnitEdit);
