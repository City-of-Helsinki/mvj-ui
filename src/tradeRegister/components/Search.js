// @flow
import React from 'react';
import {connect} from 'react-redux';
import {getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import Button from '$components/button/Button';
import FormField from '$components/form/FormField';
import {FormNames} from '$src/enums';
import {ButtonColors, FieldTypes} from '$components/enums';

type Props = {
  formValues: Object,
  handleSubmit: Function,
  onSearch: Function,
}

const Search = ({
  formValues,
  handleSubmit,
  onSearch,
}: Props) => {
  const handleSearch = () => {
    const newValues = {...formValues};

    onSearch(newValues);
  };

  return (
    <form onSubmit={handleSubmit(handleSearch)}>
      <Row>
        <Column small={12}>
          <div className='lease-search__row' style={{marginBottom: 15}}>
            <div className='lease-search__label-column' style={{width: 'unset', marginRight: 10}}>
              <span className='lease-search__label'>Y-tunnus</span>
            </div>
            <div className='lease-search__input-column'>
              <FormField
                autoBlur
                disableDirty
                fieldAttributes={{
                  label: 'Y-tunnus',
                  type: FieldTypes.STRING,
                  read_only: false,
                }}
                invisibleLabel
                name='business_id'
              />
            </div>

            <Button
              className={`${ButtonColors.SUCCESS} no-margin-right`}
              onClick={handleSearch}
              text='Hae'
            />
          </div>
        </Column>
      </Row>
    </form>
  );
};


const formName = FormNames.TRADE_REGISTER_SEARCH;

export default flowRight(
  connect(
    state => {
      return {
        formValues: getFormValues(formName)(state),
      };
    },
  ),
  reduxForm({
    form: formName,
  }),
)(Search);
