// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Field} from 'redux-form';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FieldTypeDatePicker from '$components/form/FieldTypeDatePicker';
import FieldTypeText from '$components/form/FieldTypeText';
import GreenBoxEdit from '$components/content/GreenBoxEdit';
import RemoveButton from '$components/form/RemoveButton';
import {getAttributes} from '$src/leases/selectors';
import {genericValidator} from '$components/form/validations';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fields: any,
}

const InspectionItemsEdit = ({
  attributes,
  fields,
}: Props) => {

  return(
    <GreenBoxEdit>
      <BoxItemContainer>
        {fields && !!fields.length && fields.map((inspection, index) =>
          <BoxItem
            className='no-border-on-first-child'
            key={inspection.id ? inspection.id : `index_${index}`}>
            <BoxContentWrapper>
              <RemoveButton
                className='position-topright-no-padding'
                onClick={() => fields.remove(index)}
                title="Poista tarkastus"
              />
              <Row>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeText}
                    label='Tarkastaja'
                    name={`${inspection}.inspector`}
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'inspections.child.children.inspector')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='Valvonta päivämäärä'
                    name={`${inspection}.supervision_date`}
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'inspections.child.children.supervision_date')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={4} large={2}>
                  <Field
                    component={FieldTypeDatePicker}
                    label='Valvottu päivämäärä'
                    name={`${inspection}.supervised_date`}
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'inspections.child.children.supervised_date')),
                    ]}
                  />
                </Column>
                <Column small={6} medium={12} large={6}>
                  <Field
                    component={FieldTypeText}
                    label='Selite'
                    name={`${inspection}.description`}
                    validate={[
                      (value) => genericValidator(value,
                        get(attributes, 'inspections.child.children.description')),
                    ]}
                  />
                </Column>
              </Row>
            </BoxContentWrapper>
          </BoxItem>
        )}
      </BoxItemContainer>
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää tarkastus'
            onClick={() => fields.push({})}
            title='Lisää tarkastus'
          />
        </Column>
      </Row>
    </GreenBoxEdit>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  },
)(InspectionItemsEdit);
