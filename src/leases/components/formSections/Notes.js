// @flow
import React, {Component} from 'react';
import flowRight from 'lodash/flowRight';
import {translate} from 'react-i18next';
import {connect} from 'react-redux';
import {Field, getFormInitialValues, reduxForm} from 'redux-form';
import {formatDateObj} from '../../../util/helpers';
import FormField from '../../../components/form/FormField';
import {getUser} from '../../../role/selectors';

type Props = Object;

class Conditions extends Component {
  props: Props;

  createNote = ({notes: {NEW}}) => {
    const {array, currentUser: {id}} = this.props;
    return array.push('notes', {...NEW, author: id});
  };

  render() {
    const {notes, t, handleSubmit} = this.props;

    return (
      <div>
        <h2>{t('notes.title')}</h2>

        <form onSubmit={handleSubmit(this.createNote)}>
          <label>{t('notes.new')}</label>
          {/*<Field*/}
            {/*label="Otsikko"*/}
            {/*name="notes.NEW.title"*/}
            {/*required={true}*/}
            {/*type="text"*/}
            {/*component={FormField}*/}
          {/*/>*/}
          <Field
            name="notes.NEW.text"
            required={true}
            type="textarea"
            placeholder={t('notes.single')}
            component={FormField}
          />
          <button className="button">{t('save')}</button>
        </form>

        {notes && notes.map(({title, text, author, modified_at}, i) =>
          <section key={i} className="note">
            <div className="note__header">
              {/*<h3>{title}</h3>*/}
              <h4>{author} <span className="date">{formatDateObj(modified_at)}</span></h4>
            </div>
            <div className="note__content">
              {text}
            </div>
          </section>
        )}
      </div>
    );
  }
}

export default flowRight(
  reduxForm({
    form: 'preparer-form',
    destroyOnUnmount: false,
  }),
  connect(
    (state) => {
      return {
        initialValues: getFormInitialValues('preparer-form')(state),
        currentUser: getUser(state),
      };
    },
  ),
  translate(['common', 'leases']),
)(Conditions);
