// @flow
import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import {Row, Column} from 'react-foundation';

import Button from '../../../components/Button';
import FieldTypeSelect from '../../../components/form/FieldTypeSelect';
import FieldTypeText from '../../../components/form/FieldTypeText';
import {integer, min, max, required} from '../../../components/form/validations';


type Props = {
  districtOptions: Array<Object>,
  municipalityOptions: Array<Object>,
  typeOptions: Array<Object>,
  valid: boolean,
}

class CreateLease extends Component {
  props: Props

  render () {
    const {districtOptions, municipalityOptions, typeOptions, valid} = this.props;

    return (
      <form className='create-lease-form'>
        <Row>
          <Column medium={10} style={{padding: '0'}}>
            <Row>
              <Column medium={3} style={{paddingRight: '0'}}>
                <Field
                  label='Vuokrauksen laji'
                  name={'type'}
                  options={typeOptions}
                  validate={[
                    (value) => required(value, 'Vuokrauksen laji on pakollinen'),
                  ]}
                  component={FieldTypeSelect}/>
              </Column>
              <Column medium={3} style={{paddingRight: '0'}}>
                <Field
                  label='Kunta'
                  name={'municipality'}
                  options={municipalityOptions}
                  validate={[
                    (value) => required(value, 'Kunta on pakollinen'),
                  ]}
                  component={FieldTypeSelect}/>
              </Column>
              <Column medium={3} style={{paddingRight: '0'}}>
                <Field
                  label='Kaupunginosa'
                  name={'district'}
                  options={districtOptions}
                  validate={[
                    (value) => required(value, 'Kaupunginosa on pakollinen'),
                  ]}
                  component={FieldTypeSelect}/>
              </Column>
              <Column medium={3} style={{paddingRight: '0'}}>
                <Field
                  label='Juokseva numero'
                  name={'sequence'}
                  type='number'
                  validate={[
                    (value) => integer(value, 'Juoksevan numeron tulee olla kokonaisluku'),
                    (value) => min(value, 1, 'Juoksevan numeron tulee olla vähintään 1'),
                    (value) => max(value, 9999, 'Juoksevan numeron tulee olla enintään 9999'),
                    (value) => required(value, 'Juokseva numero on pakollinen'),
                  ]}
                  component={FieldTypeText}
                />
              </Column>
            </Row>
          </Column>
          <Column medium={2} style={{padding: '0'}}>
            <div className='button-wrapper'>
              <Button
                className={'button-green no-margin full-width'}
                disabled={!valid}
                text={'Luo tunnus'}
                onClick={() => console.log('Luo tunnus')}
              >
              </Button>
            </div>
          </Column>
        </Row>
      </form>
    );
  }
}

const formName = 'create-lease-form';

export default flowRight(
  reduxForm({
    form: formName,
  }),
)(CreateLease);
