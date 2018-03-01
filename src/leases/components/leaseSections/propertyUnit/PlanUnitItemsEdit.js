// @flow
import React from 'react';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import trashIcon from '../../../../../assets/icons/trash.svg';
import FieldTypeDatePicker from '../../../../components/form/FieldTypeDatePicker';
import FieldTypeSelect from '../../../../components/form/FieldTypeSelect';
import FieldTypeText from '../../../../components/form/FieldTypeText';

type Props = {
  areas: Array<Object>,
  title: string,
  fields: any,
}

const PlanUnitItemsEdit = ({areas, title, fields}: Props) => {
  return (
    <div className='green-box'>
      {fields.length > 0 &&
      <Row>
        <Column>
          <h2>{title}</h2>
        </Column>
      </Row>}
      {fields && fields.length > 0 && fields.map((planunit, index) =>
        <div key={index} className='green-box-item'>
          <button
            className='remove-button'
            type="button"
            title="Poista kaavayksikkö"
            onClick={() => fields.remove(index)}>
            <img src={trashIcon} alt='Poista' />
          </button>
          <Row>
            <Column medium={4}>
              <Row>
                <Column>
                  <label className='mvj-form-field-label'>Tunnus</label>
                </Column>
              </Row>
              <Row>
                <div className='identifier-column'>
                  <Field
                    name={`${planunit}.municipality`}
                    type="text"
                    component={FieldTypeText}/>
                </div>
                <div className='identifier-column'>
                  <Field
                    name={`${planunit}.district`}
                    type="text"
                    component={FieldTypeText}/>
                </div>
                <div className='identifier-column'>
                  <Field
                    name={`${planunit}.group_number`}
                    type="text"
                    component={FieldTypeText}/>
                </div>
                <div className='identifier-column'>
                  <Field
                    name={`${planunit}.unit_number`}
                    type="text"
                    component={FieldTypeText}/>
                </div>
                {get({areas: areas}, `${planunit}.use`) === 'määräala' &&
                <div className='identifier-column'>
                  <Field
                    name={`${planunit}.unseparate_parcel_number`}
                    type="text"
                    component={FieldTypeText}/>
                </div>
                }
              </Row>
            </Column>
            <Column medium={2}>
              <Field
                name={`${planunit}.use`}
                component={FieldTypeSelect}
                label='Käyttötarkoitus'
                options={[
                  {value: 'kiinteistö', label: 'Kiinteistö'},
                  {value: 'määräala', label: 'Määräala'},
                ]}
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
                options={[
                  {value: 'luonnos', label: 'Luonnos'},
                  {value: 'voimassa', label: 'Voimassa'},
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
                options={[
                  {value: 'rekisteröity yleinen alue', label: 'Rekisteröity yleinen alue'},
                  {value: 'ohjeellinen kaavatontti', label: 'Ohjeellinen kaavatontti'},
                  {value: 'vireillä olevan tonttijaon/-muutoksen mukainen tontti', label: 'Vireillä olevan tonttijaon/-muutoksen mukainen tontti'},
                  {value: 'vireillä olevan tonttijaonmuutoksen mukainen tontti', label: 'Vireillä olevan tonttijaonmuutoksen mukainen tontti'},
                  {value: 'hyväksytyn tonttijaon mukainen tontti', label: 'Hyväksytyn tonttijaon mukainen tontti'},
                  {value: 'muodostusluetteloon merkitty tontti', label: 'Muodostusluetteloon merkitty tontti'},
                  {value: 'tonttirekisteritontti', label: 'Tonttirekisteritontti'},
                  {value: 'muun kuin korttelialueen yksikkö', label: 'Muun kuin korttelialueen yksikkö'},
                  {value: 'keinoyksikkö (maarekisterialue)', label: 'Keinoyksikkö (maarekisterialue)'},
                  {value: 'keinokaavayksikkö (yleisen alueen lisäosa)', label: 'Keinokaavayksikkö (yleisen alueen lisäosa)'},
                ]}
              />
            </Column>
            <Column medium={3}>
              <Field
                className='no-margin'
                component={FieldTypeSelect}
                label='Kaavayksikön olotila'
                name={`${planunit}.planplot_condition`}
                options={[
                  {value: 'numeronvaraus', label: 'Numeronvaraus'},
                  {value: 'vireillä', label: 'Vireillä'},
                  {value: 'voimassa', label: 'Voimassa'},
                  {value: 'kumottu', label: 'Kumottu'},
                ]}
              />
            </Column>
          </Row>
        </div>
      )}
      <Row>
        {title === 'Kaavayksiköt sopimushetkellä' &&
        <Column>
          <a onClick={() => fields.push({})} className='add-button-secondary'><i /><span>Kaavayksiköt sopimushetkellä</span></a>
        </Column>}
        {title === 'Kaavayksiköt nykyhetkellä' &&
        <Column>
          <a onClick={() => fields.push({})} className='add-button-secondary'><i /><span>Kaavayksiköt nykyhetkellä</span></a>
        </Column>}
      </Row>
    </div>
  );
};

export default PlanUnitItemsEdit;
