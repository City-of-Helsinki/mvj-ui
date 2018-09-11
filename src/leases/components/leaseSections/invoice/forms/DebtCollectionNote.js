// @flow
import React from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';

import FieldAndRemoveButtonWrapper from '$components/form/FieldAndRemoveButtonWrapper';
import FormField from '$components/form/FormField';
import RemoveButton from '$components/form/RemoveButton';
import {FormNames} from '$src/leases/enums';
import {formatDate} from '$util/helpers';
import {getContactFullName} from '$src/contacts/helpers';

type Props = {
  date: string,
  field: any,
  id: number,
  note: ?string,
  onRemove: Function,
  user: Object,
}

const DebtCollectionNote = ({
  date,
  field,
  id,
  note,
  onRemove,
  user,
}: Props) => {
  if(id) {
    return(
      <Row>
        <Column small={6}>
          <p>{note || '-'}</p>
        </Column>
        <Column small={3}>
          <p>{formatDate(date) || '-'}</p>
        </Column>
        <Column small={3}>
          <FieldAndRemoveButtonWrapper
            field={
              <p style={{width: '100%'}}>{getContactFullName(user) || '-'}</p>
            }
            removeButton={
              <RemoveButton
                className='third-level'
                onClick={onRemove}
                title='Poista huomautus'
              />
            }
          />
        </Column>
      </Row>
    );
  }

  return(
    <Row>
      <Column small={12}>
        <FieldAndRemoveButtonWrapper
          field={
            <FormField
              disableDirty
              fieldAttributes={{
                type: 'textarea',
                required: true,
                label: 'Huomautus',
              }}
              name={`${field}.note`}
              overrideValues={{
                label: '',
              }}
            />
          }
          removeButton={
            <RemoveButton
              className='third-level'
              onClick={onRemove}
              title='Poista huomautus'
            />
          }
        />
      </Column>
    </Row>
  );
};

const formName = FormNames.DEBT_COLLECTION;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    return {
      date: selector(state, `${props.field}.date`),
      id: selector(state, `${props.field}.id`),
      note: selector(state, `${props.field}.note`),
      user: selector(state, `${props.field}.user`),
    };
  }
)(DebtCollectionNote);
