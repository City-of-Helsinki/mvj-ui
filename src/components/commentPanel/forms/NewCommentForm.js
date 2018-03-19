// @flow
import React from 'react';
import {connect} from 'react-redux';
import flowRight from 'lodash/flowRight';
import {Field, formValueSelector, reduxForm} from 'redux-form';

import {required} from '$components/form/validations';
import AddButton from '$components/form/AddButton';
import FieldTypeSelect from '$components/form/FieldTypeSelect';
import FieldTypeTextArea from '$components/form/FieldTypeTextArea';
import FormSection from '$components/form/FormSection';
import {CommentTypes} from '../constants';

import type {RootState} from '$src/root/types';

type Props = {
  valid: boolean,
  handleSubmit: Function,
  onAddComment: Function,
  text: string,
  type: string,
}

const NewCommentForm = ({
  valid,
  handleSubmit,
  onAddComment,
  text,
  type,
}: Props) =>
  <form onSubmit={handleSubmit}>
    <FormSection>
      <Field
        component={FieldTypeSelect}
        disableDirty
        label='Aihealue'
        name='type'
        options={CommentTypes}
        validate={[
          (value) => required(value, 'Aihealue on pakollinen'),
        ]}
      />
      <Field
        component={FieldTypeTextArea}
        disableDirty
        label='Kommentti'
        name='text'
        validate={[
          (value) => required(value, 'Kommentti on pakollinen'),
        ]}
      />
      <AddButton
        disabled={!valid}
        label='Lisää kommentti'
        onClick={() => onAddComment(text, type)}
        title='Lisää kommentti'
      />
    </FormSection>
  </form>;

const formName = 'new-comment-form';
const selector = formValueSelector(formName);

const mapStateToProps = (state: RootState) => {
  return {
    text: selector(state, 'text'),
    type: selector(state, 'type'),
  };
};

export default flowRight(
  connect(
    mapStateToProps
  ),
  reduxForm({
    form: formName,
  }),
)(NewCommentForm);
