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
              <Field
                name={`${property}.identifier`}
                type="text"
                component={FieldTypeText}
                label='Tunnus'
                placeholder='Tunnus'/>
            </Column>
            <Column medium={3}>
            </Column>
            <Column medium={3}>
              <Field
                name={`${property}.totalArea`}
                type="text"
                component={FieldTypeText}
                label='Tunnus'
                placeholder='Tunnus'/>
            </Column>
            <Column medium={3}>
              <Field
                name={`${property}.sectionalArea`}
                type="text"
                component={FieldTypeText}
                label='Tunnus'
                placeholder='Tunnus'/>
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
                name={`${property}.postcode`}
                type="text"
                component={FieldTypeText}
                label="Postinumero"
                placeholder="Postinumero"/>
            </Column>
            <Column medium={3}>
              <Field
                name={`${property}.city`}
                type="text"
                component={FieldTypeText}
                label='Kaupunki'
                placeholder='Kaupunki'/>
            </Column>
            <Column medium={3}>
              <Field
                name={`${property}.registrationDate`}
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
              <Field
                name={`${planunit}.identifier`}
                type="text"
                component={FieldTypeText}
                label='Tunnus'
                placeholder='Tunnus'/>
            </Column>
            <Column medium={3}>
            </Column>
            <Column medium={3}>
              <Field
                name={`${planunit}.totalArea`}
                type="text"
                component={FieldTypeText}
                label='Kokonaisala'
                placeholder='Kokonaisala'/>
            </Column>
            <Column medium={3}>
              <Field
                name={`${planunit}.sectionalArea`}
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
                name={`${planunit}.postcode`}
                type="text"
                component={FieldTypeText}
                label='Postinumero'
                placeholder='Postinumero'/>
            </Column>
            <Column medium={3}>
              <Field
                name={`${planunit}.city`}
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
                name={`${planunit}.subdivisionIdentifier`}
                type="text"
                component={FieldTypeText}
                label='Tonttijaon tunnus'
                placeholder='Tonttijaon tunnus'/>
            </Column>
            <Column medium={3}>
              <Field
                name={`${planunit}.subdivisionDate`}
                type="text"
                component={FieldTypeText}
                label='Tonttijaon hyväksymispvm'
                placeholder='PP.KK.VVVV'/>
            </Column>
            <Column medium={3}>
              <Field
                name={`${planunit}.cityplan`}
                type="text"
                component={FieldTypeText}
                label='Asemakaava'
                placeholder='Asemakaava'/>
            </Column>
            <Column medium={3}>
              <Field
                name={`${planunit}.cityplanDate`}
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
                <Column medium={3}></Column>
                <Column medium={3}></Column>
                <Column medium={3}></Column>
                <Column medium={3}>
                  <Field
                    name={`${district}.area`}
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
                    name={`${district}.postcode`}
                    type="text"
                    component={FieldTypeText}
                    label="Postinumero"
                    placeholder="Postinumero"/>
                </Column>
                <Column medium={3}>
                  <Field
                    name={`${district}.city`}
                    type="text"
                    component={FieldTypeText}
                    label="Kaupunki"
                    placeholder="Kaupunki"/>
                </Column>
              </Row>

              <FieldArray title='Kiinteistöt / määräalat nykyhetkellä' name={`${district}.currentProperties`} component={renderProperty}/>
              <FieldArray title='Kiinteistöt / määräalat sopimushetkellä' name={`${district}.contractProperties`} component={renderProperty}/>
              <FieldArray title='Kaavayksikkö nykyhetkellä' name={`${district}.currentPlanUnits`} component={renderPlanUnit}/>
              <FieldArray title='Kaavayksikkö sopimushetkellä' name={`${district}.contractPlanUnits`} component={renderPlanUnit}/>
              <Row>
                <Column>
                  <FormActionDropdown
                    title={'Lisää uusi'}
                    onOptionClick={(option) => {
                      switch(option) {
                        case 'contractProperty':
                          dispatch(arrayPush('property-unit-edit-form', `${district}.contractProperties`, {}));
                          break;
                        case 'currentProperty':
                          dispatch(arrayPush('property-unit-edit-form', `${district}.currentProperties`, {}));
                          break;
                        case 'contractPlanUnit':
                          dispatch(arrayPush('property-unit-edit-form', `${district}.contractPlanUnits`, {}));
                          break;
                        case 'currentPlanUnit':
                          dispatch(arrayPush('property-unit-edit-form', `${district}.currentPlanUnits`, {}));
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
            <FieldArray name="districts" dispatch={dispatch} component={RenderDistricts}/>
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
    (state, props) => {
      return {
        districts: selector(state, props.array),
      };
    }
  ),
  reduxForm({
    form: formName,
  }),
)(PropertyUnitEdit);
