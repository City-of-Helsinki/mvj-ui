// @flow
import React from 'react';
import {Field, FieldArray} from 'redux-form';
import {Row, Column} from 'react-foundation';

import AddButton from '$components/form/AddButton';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import ContentItem from '$components/content/ContentItem';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeText from '$components/form/FieldTypeText';
import RemoveButton from '$components/form/RemoveButton';
import RuleTermsEdit from './RuleTermsEdit';
import WhiteBoxEdit from '$components/content/WhiteBoxEdit';

type Props = {
  fields: any,
}

const RuleItemsEdit = ({fields}: Props) => {
  return(
    <div>
      {fields && fields.length > 0 && fields.map((rule, index) =>
        <ContentItem key={index}>
          <WhiteBoxEdit>
            <BoxContentWrapper>
              <RemoveButton
                className='position-topright-no-padding'
                onClick={() => fields.remove(index)}
                title="Poista sopimus"
              />
              <Row>
                <Column medium={4}>
                  <Field
                    component={FieldTypeSelect}
                    label='Päättäjä'
                    name={`${rule}.rule_maker`}
                    options={[
                      {value: '', label: 'To be filled'},
                    ]}
                  />
                </Column>
                <Column medium={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='Päätöspäivämäärä'
                    name={`${rule}.rule_date`}
                  />
                </Column>
                <Column medium={2}>
                  <Field
                    component={FieldTypeText}
                    label='Pykälä'
                    name={`${rule}.rule_clause`}
                  />
                </Column>
                <Column medium={4}>
                  <Field
                    component={FieldTypeSelect}
                    label='Päätöksen tyyppi'
                    name={`${rule}.rule_type`}
                    options={[
                      {value: '', label: 'To be filled'},
                    ]}
                  />
                </Column>
              </Row>
              <Row>
                <Column medium={12}>
                  <Field
                    className='no-margin'
                    component={FieldTypeText}
                    label='Selite'
                    name={`${rule}.rule_description`}
                  />
                </Column>
              </Row>
            </BoxContentWrapper>
          </WhiteBoxEdit>

          <FieldArray title='Ehdot' name={`${rule}.terms`} component={RuleTermsEdit}/>
        </ContentItem>
      )}
      <Row>
        <Column>
          <AddButton
            label='Lisää uusi päätös'
            onClick={() => fields.push({})}
            title='Lisää uusi päätös'
          />
        </Column>
      </Row>
    </div>
  );
};

export default RuleItemsEdit;
