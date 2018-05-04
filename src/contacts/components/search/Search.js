// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import debounce from 'lodash/debounce';
import flowRight from 'lodash/flowRight';

import FormField from '$components/form/FormField';
import {FormNames} from '$src/contacts/enums';

type Props = {
  onSearch: Function,
  search: string,
}

class Search extends Component {
  props: Props

  componentWillUpdate(nextProps: Object) {
    if(this.props.search !== nextProps.search) {
      this.onSearchChange();
    }
  }

  onSearchChange = debounce(() => {
    const {onSearch, search} = this.props;
    const filters = {};
    filters.search = search || undefined;
    onSearch(filters);
  }, 300);

  render () {
    return (
      <div className='search'>
        <Row>
          <Column large={12}>
            <FormField
              fieldAttributes={{}}
              name='search'
              placeholder='Hae hakusanalla'
              overrideValues={{
                label: '',
              }}
            />
          </Column>
        </Row>
      </div>
    );
  }
}


const formName = FormNames.SEARCH;
const selector = formValueSelector(formName);
export default flowRight(
  connect(
    state => {

      return {
        search: selector(state, 'search'),
      };
    },
  ),
  reduxForm({
    form: formName,
  }),
)(Search);
