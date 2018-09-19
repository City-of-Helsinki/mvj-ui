// @flow
import React from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';

import Button from '$components/button/Button';
import FormField from '$components/form/FormField';
import {FormNames} from '$src/leases/enums';

type Props = {
  field: any,
  note: ?string,
  onCancel: Function,
  onSave: Function,
}

const NewCollectionNote = ({
  field,
  note,
  onCancel,
  onSave,
}: Props) => {
  const handleSave = () => {
    onSave(note);
  };

  return(
    <div>
      <Row>
        <Column small={12}>
          <FormField
            disableDirty
            fieldAttributes={{
              type: 'textarea',
              required: true,
              label: 'Huomautus',
            }}
            invisibleLabel={true}
            name={`${field}.note`}
          />
        </Column>
      </Row>
      <div className='invoice__new-collection-note_button-wrapper'>
        <Button
          className='button-red'
          onClick={onCancel}
          text='Peruuta'
        />
        <Button
          className='button-green'
          disabled={!note}
          onClick={handleSave}
          text='Tallenna'
        />
      </div>
    </div>
  );
};

const formName = FormNames.DEBT_COLLECTION;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
    return {
      note: selector(state, `${props.field}.note`),
    };
  }
)(NewCollectionNote);
