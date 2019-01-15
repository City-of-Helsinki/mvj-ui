// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {getFormValues, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import debounce from 'lodash/debounce';
import flowRight from 'lodash/flowRight';

import FormField from '$components/form/FormField';
import {FieldTypes} from '$components/enums';
import {FormNames} from '$src/infillDevelopment/enums';

type Props = {
  formValues: Object,
  isSearchInitialized: boolean,
  onSearch: Function,
  states: Array<Object>,
}

class Search extends PureComponent<Props> {
  _isMounted: boolean;

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = true;
  }

  componentDidUpdate(prevProps: Object) {
    const {isSearchInitialized} = this.props;

    if(isSearchInitialized && JSON.stringify(prevProps.formValues) !== JSON.stringify(this.props.formValues)) {
      this.onSearchChange();
    }
  }

  onSearchChange = debounce(() => {
    if(!this._isMounted) return;

    const {formValues, onSearch, states} = this.props;
    onSearch({...formValues, state: states.length ? states : undefined});
  }, 500);

  handleClear = () => {
    const {onSearch} = this.props;

    onSearch({});
  }

  handleClearKeyDown = (e: any) => {
    if(e.keyCode === 13){
      e.preventDefault();
      this.handleClear();
    }
  }

  render () {
    return (
      <Fragment>
        <Row>
          <Column large={12}>
            <FormField
              disableDirty
              fieldAttributes={{
                label: 'Hae hakusanalla',
                type: FieldTypes.SEARCH,
                read_only: false,
              }}
              invisibleLabel
              name='search'
            />
          </Column>
        </Row>
        <Row>
          <Column small={6}></Column>
          <Column small={6}>
            <a
              tabIndex={0}
              onKeyDown={this.handleClearKeyDown}
              onClick={this.handleClear}
              className='lease-search__clear-link'
            >Tyhjennä haku</a>
          </Column>
        </Row>
      </Fragment>
    );
  }
}


const formName = FormNames.SEARCH;

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
