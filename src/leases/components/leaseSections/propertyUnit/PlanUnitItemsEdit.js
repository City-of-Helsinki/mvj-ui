// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import GreenBoxItem from '$components/content/GreenBoxItem';
import RemoveButton from '$components/form/RemoveButton';

import {
  planUnitConditionOptions,
  planUnitStateOptions,
  planUnitTypeOptions,
  planUnitUseOptions,
} from '../../../../constants';

type Props = {
  areas: Array<Object>,
  title: string,
  fields: any,
}

const PlanUnitItemsEdit = ({areas, title, fields}: Props) => {
  return (
    <GreenBoxEdit>
      <h2>{title}</h2>
      {fields && fields.length > 0 && fields.map((planunit, index) =>
        <GreenBoxItem key={index}>
          <BoxContentWrapper>
            <RemoveButton
              className='position-topright-no-padding'
              onClick={() => fields.remove(index)}
              title="Poista kaavayksikkö"
            />
            <Row>
              <Column medium={4}>
                <Row>
                  <Column>
                    <label className='mvj-form-field-label'>Tunnus</label>
                  </Column>
                </Row>
                <Row>
                  <Column style={{paddingRight: 0}}>
                    <Field
                      name={`${planunit}.municipality`}
                      type="text"
                      component={FieldTypeText}/>
                  </Column>
                  <Column style={{paddingRight: 0}}>
                    <Field
                      name={`${planunit}.district`}
                      type="text"
                      component={FieldTypeText}/>
                  </Column>
                  <Column style={{paddingRight: 0}}>
                    <Field
                      name={`${planunit}.group_number`}
                      type="text"
                      component={FieldTypeText}/>
                  </Column>
                  <Column style={{paddingRight: 0}}>
                    <Field
                      name={`${planunit}.unit_number`}
                      type="text"
                      component={FieldTypeText}/>
                  </Column>
                  <Column style={{paddingRight: 0}}>
                    {get({areas: areas}, `${planunit}.use`) === 'määräala' &&
                      <Field
                        name={`${planunit}.unseparate_parcel_number`}
                        type="text"
                        component={FieldTypeText}/>
                    }
                  </Column>
                </Row>
              </Column>
              <Column medium={2}>
                <Field
                  name={`${planunit}.use`}
                  component={FieldTypeSelect}
                  label='Käyttötarkoitus'
                  options={planUnitUseOptions}
                />
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
                  options={planUnitStateOptions}
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
                  component={FieldTypeDatePicker}
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
                  component={FieldTypeDatePicker}
                  label='Asemakaavan vahvistumispvm'
                  placeholder='PP.KK.VVVV'/>
              </Column>
            </Row>
            <Row>
              <Column medium={6}>
                <Field
                  className='no-margin'
                  component={FieldTypeSelect}
                  label='Kaavayksikön laji'
                  name={`${planunit}.planplot_type`}
                  options={planUnitTypeOptions}
                />
              </Column>
              <Column medium={3}>
                <Field
                  className='no-margin'
                  component={FieldTypeSelect}
                  label='Kaavayksikön olotila'
                  name={`${planunit}.planplot_condition`}
                  options={planUnitConditionOptions}
                />
              </Column>
            </Row>
          </BoxContentWrapper>
        </GreenBoxItem>
      )}
      <Row>
        {title === 'Kaavayksiköt sopimushetkellä' &&
        <Column>
          <AddButtonSecondary
            className='no-margin'
            label='Lisää kaavayksikkö sopimushetkellä'
            onClick={() => fields.push({})}
            title='Lisää kaavayksikkö sopimushetkellä'
          />
        </Column>}
        {title === 'Kaavayksiköt nykyhetkellä' &&
        <Column>
          <AddButtonSecondary
            className='no-margin'
            label='Lisää kaavayksikkö nykyhetkellä'
            onClick={() => fields.push({})}
            title='Lisää kaavayksikkö nykyhetkellä'
          />
        </Column>}
      </Row>
    </GreenBoxEdit>
  );
};

export default PlanUnitItemsEdit;
