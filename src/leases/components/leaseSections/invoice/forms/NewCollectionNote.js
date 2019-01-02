// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';

import Authorization from '$components/authorization/Authorization';
import Button from '$components/button/Button';
import FormField from '$components/form/FormField';
import {ButtonColors} from '$components/enums';
import {CollectionNoteFieldPaths, CollectionNoteFieldTitles} from '$src/collectionNote/enums';
import {FormNames} from '$src/leases/enums';
import {getFieldAttributes, isFieldAllowedToRead} from '$util/helpers';

import type {Attributes} from '$src/types';

type Props = {
  collectionNoteAttributes: Attributes,
  field: any,
  note: ?string,
  onCancel: Function,
  onSave: Function,
}

const NewCollectionNote = ({
  collectionNoteAttributes,
  field,
  note,
  onCancel,
  onSave,
}: Props) => {
  const handleSave = () => {
    onSave(note);
  };

  return(
    <Fragment>
      <Row>
        <Column small={12}>
          <Authorization allow={isFieldAllowedToRead(collectionNoteAttributes, CollectionNoteFieldPaths.NOTE)}>
            <FormField
              disableDirty
              fieldAttributes={{
                ...getFieldAttributes(collectionNoteAttributes, CollectionNoteFieldPaths.NOTE),
                type: 'textarea',
              }}
              invisibleLabel={true}
              name={`${field}.note`}
              overrideValues={{label: CollectionNoteFieldTitles.NOTE}}
            />
          </Authorization>
        </Column>
      </Row>
      <div className='invoice__new-collection-note_button-wrapper'>
        <Button
          className={ButtonColors.SECONDARY}
          onClick={onCancel}
          text='Peruuta'
        />
        <Button
          className={ButtonColors.SUCCESS}
          disabled={!note}
          onClick={handleSave}
          text='Tallenna'
        />
      </div>
    </Fragment>
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
