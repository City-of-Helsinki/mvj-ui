// @flow
import React from 'react';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm} from 'redux-form';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import AddButton from '$components/form/AddButton';
import FormField from '$components/form/FormField';
import FormSection from '$components/form/FormSection';

import type {RootState} from '$src/root/types';

type Props = {
  attributes: Object,
  handleSubmit: Function,
  onAddComment: Function,
  text: string,
  topic: string,
  valid: boolean,
}

const NewCommentForm = ({
  attributes,
  handleSubmit,
  onAddComment,
  text,
  topic,
  valid,
}: Props) => {
  return (
    <form onSubmit={handleSubmit}>
      <FormSection>
        <FormField
          disableDirty
          fieldAttributes={get(attributes, 'topic')}
          name='topic'
          overrideValues={{
            label: 'Aihealue',
          }}
        />
        <FormField
          disableDirty
          fieldAttributes={get(attributes, 'text')}
          name='text'
          overrideValues={{
            label: 'Kommentti',
            fieldType: 'textarea',
          }}
        />
        <AddButton
          disabled={!valid}
          label='Kommentoi'
          onClick={() => onAddComment(text, topic)}
          title='Kommentoi'
        />
      </FormSection>
    </form>
  );
};

const formName = 'new-comment-form';
const selector = formValueSelector(formName);

const mapStateToProps = (state: RootState) => {
  return {
    text: selector(state, 'text'),
    topic: selector(state, 'topic'),
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
