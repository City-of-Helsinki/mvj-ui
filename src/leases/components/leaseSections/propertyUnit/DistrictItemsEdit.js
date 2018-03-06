// @flow
import React from 'react';
import {Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButton from '$components/form/AddButton';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import ContentItem from '$components/content/ContentItem';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import PlanUnitItemsEdit from './PlanUnitItemsEdit';
import PropertyItemsEdit from './PropertyItemsEdit';
import RemoveButton from '$components/form/RemoveButton';
import WhiteBoxEdit from '$components/content/WhiteBoxEdit';

import {
  districtItemExplanationOptions,
  districtItemPositionOptions,
} from '$src/constants';

type Props = {
  areas: Array<Object>,
  fields: any,
}

const DistrictItemsEdit = ({areas, fields}: Props) => {
  return (
    <div>
      {fields && fields.length > 0 && fields.map((district, index) => {
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
                    <Row>
                      <Column>
                        <label className='mvj-form-field-label'>Kohteen tunnus</label>
                      </Column>
                    </Row>
                    <Row>
                      <Column style={{paddingRight: 0}}>
                        <Field
                          name={`${district}.municipality`}
                          type="text"
                          component={FieldTypeText}/>
                      </Column>
                      <Column style={{paddingRight: 0}}>
                        <Field
                          name={`${district}.district`}
                          type="text"
                          component={FieldTypeText}/>
                      </Column>
                      <Column style={{paddingRight: 0}}>
                        <Field
                          name={`${district}.group_number`}
                          type="text"
                          component={FieldTypeText}/>
                      </Column>
                      <Column style={{paddingRight: 0}}>
                        <Field
                          name={`${district}.unit_number`}
                          type="text"
                          component={FieldTypeText}/>
                      </Column>
                      <Column style={{paddingRight: 0}}>
                        {get({areas: areas}, `${district}.explanation`) === 'määräala' &&
                          <Field
                            name={`${district}.unseparate_parcel_number`}
                            type="text"
                            component={FieldTypeText}/>
                        }
                      </Column>
                    </Row>
                  </Column>
                  <Column medium={2}>
                    <Field
                      name={`${district}.explanation`}
                      component={FieldTypeSelect}
                      label='Selite'
                      options={districtItemExplanationOptions}
                    />
                  </Column>
                  <Column medium={3}>
                    <Field
                      name={`${district}.full_area`}
                      type="text"
                      component={FieldTypeText}
                      label="Pinta-ala"
                      placeholder="Pinta-ala"/>
                  </Column>
                  <Column medium={3}>
                    <Field
                      name={`${district}.position`}
                      component={FieldTypeSelect}
                      label='Sijainti'
                      options={districtItemPositionOptions}

                    />
                  </Column>
                </Row>
                <Row>
                  <Column medium={6}>
                    <Field
                      className='no-margin'
                      component={FieldTypeText}
                      label="Osoite"
                      name={`${district}.address`}
                      placeholder="Osoite"/>
                  </Column>
                  <Column medium={3}>
                    <Field
                      className='no-margin'
                      component={FieldTypeText}
                      label="Postinumero"
                      name={`${district}.zip_code`}
                      placeholder="Postinumero"/>
                  </Column>
                  <Column medium={3}>
                    <Field
                      className='no-margin'
                      component={FieldTypeText}
                      label="Kaupunki"
                      name={`${district}.town`}
                      placeholder="Kaupunki"/>
                  </Column>
                </Row>
              </BoxContentWrapper>
            </WhiteBoxEdit>
            <FieldArray title='Kiinteistöt / määräalat sopimushetkellä' areas={areas} name={`${district}.plots_in_contract`} component={PropertyItemsEdit}/>
            <FieldArray title='Kiinteistöt / määräalat nykyhetkellä' areas={areas} name={`${district}.plots_at_present`} component={PropertyItemsEdit}/>
            <FieldArray title='Kaavayksiköt sopimushetkellä' name={`${district}.plan_plots_in_contract`} component={PlanUnitItemsEdit}/>
            <FieldArray title='Kaavayksiköt nykyhetkellä' name={`${district}.plan_plots_at_present`} component={PlanUnitItemsEdit}/>
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

export default DistrictItemsEdit;
