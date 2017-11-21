import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import {Field, FieldArray, reduxForm, formValueSelector, arrayPush} from 'redux-form';

import trashIcon from '../../../../assets/icons/trash.svg';
import FormActionDropdown from '../../../components/FormActionDropdown';

type FieldProps = {
  input: Object,
  label: string,
  type: string,
  meta: Object,
}

const renderField = ({input, label, type, meta: {touched, error}}: FieldProps) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} type={type} placeholder={label}/>
      {touched && error && <span>{error}</span>}
    </div>
  </div>
);

type PropertyProps = {
  title: string,
  fields: Array<Object>,
}

const renderProperty = ({title, fields}: PropertyProps) => {
  return (
    <div>
      {fields.length > 0 &&
        <Row>
          <Column>
            <h2>{title}</h2>
          </Column>
        </Row>
      }
      {fields.map((currentProperty, index) =>
        <div key={index} className='subsection-container'>
          <button
            className='remove-button'
            type="button"
            title="Poista kiinteistö / määräala"
            onClick={() => fields.remove(index)}>
            <img src={trashIcon} alt='Poista' />
          </button>
          <Row>
            <Column>
              <Field
                name={`${currentProperty}.hoppy`}
                type="text"
                component={renderField}
                label={`Hobby #${index + 1}`}/>
              <Field
                name={`${currentProperty}.hoppy2`}
                type="text"
                component={renderField}
                label={'Address'}/>
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
  return (
    <div>
      {fields.length > 0 &&
        <Row>
          <Column>
            <h2>{title}</h2>
          </Column>
        </Row>
      }
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
            <Column>
              <Field
                name={`${planunit}.hoppy`}
                type="text"
                component={renderField}
                label={`Hobby #${index + 1}`}/>
              <Field
                name={`${planunit}.hoppy2`}
                type="text"
                component={renderField}
                label={'Address'}/>
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
                <Column>
                  <Field
                    name={`${district}.lastName`}
                    type="text"
                    component={renderField}
                    label="Last Name"/>
                </Column>
              </Row>
              <Row>
                <Column>
                  <FieldArray title='Kiinteistöt / määräalat nykyhetkellä' name={`${district}.currentProperties`} component={renderProperty}/>
                </Column>
              </Row>
              <Row>
                <Column>
                  <FieldArray title='Kiinteistöt / määräalat sopimushetkellä' name={`${district}.contractProperties`} component={renderProperty}/>
                </Column>
              </Row>
              <Row>
                <Column>
                  <FieldArray title='Kaavayksikkö nykyhetkellä' name={`${district}.currentPlanUnits`} component={renderPlanUnit}/>
                </Column>
              </Row>
              <Row>
                <Column>
                  <FieldArray title='Kaavayksikkö sopimushetkellä' name={`${district}.contractPlanUnits`} component={renderPlanUnit}/>
                </Column>
              </Row>
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
