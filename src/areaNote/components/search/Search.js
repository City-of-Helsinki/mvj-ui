// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {formValueSelector, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import debounce from 'lodash/debounce';
import flowRight from 'lodash/flowRight';

import FormField from '$components/form/FormField';
import {FormNames} from '$src/areaNote/enums';

type Props = {
  onSearch: Function,
  search: string,
}

class Search extends Component<Props> {
  _isMounted: boolean;

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = true;
  }

  componentWillUpdate(nextProps: Object) {
    if(this.props.search !== nextProps.search) {
      this.onSearchChange();
    }
  }

  onSearchChange = debounce(() => {
    if(!this._isMounted) {
      return;
    }
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
              disableDirty
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
