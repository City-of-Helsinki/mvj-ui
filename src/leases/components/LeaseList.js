// @flow
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import orderBy from 'lodash/orderBy';

import {fetchAttributes} from '../../attributes/actions';
import {editLease, fetchLeases} from '../actions';
import Loader from '../../components/loader/Loader';
import {getIsFetching, getLeasesList} from '../selectors';
import FilterableList from '../../components/filterableList/FilterableList';
import {getActiveLanguage} from '../../util/helpers';

type Props = {
  leases: Array<any>,
  closeReveal: Function,
  editLease: Function,
  fetchLeases: Function,
  fetchAttributes: Function,
  isFetching: boolean,
  params: Object,
  router: Object,
  t: Function,
};

class LeaseList extends Component {
  props: Props;

  static contextTypes = {
    router: PropTypes.object,
  };

  componentWillMount() {
    const {fetchAttributes, fetchLeases} = this.props;

    fetchAttributes();
    fetchLeases();
  }

  handleEditClick = (id) => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;
    const lang = getActiveLanguage().id;

    return router.push({
      pathname: `/${lang}/leases/${id}`,
      query,
    });
  };

  render() {
    const {leases, isFetching, t} = this.props;
    const orderedLeases = orderBy(leases, ['id'], ['asc']);

    return (
      <div className="leases">
        <Loader isLoading={isFetching}/>
        <FilterableList
          data={orderedLeases}
          isFetching={isFetching}
          dataKeys={[
            {key: 'id', label: 'ID'},
            {key: 'identifier', label: 'Vuokraustunnus'},
            {key: 'application.type', label: 'Tyyppi', renderer: (val) => t(`types.${val}`)},
            {key: 'tenants.length', label: 'Vuokralaiset'},
            {key: ['preparer.first_name', 'preparer.last_name'], label: 'Valmistelija', renderer: (val) => `${val} `},
            {key: 'state', label: 'Tila', renderer: (val) => t(`state.${val}`)},
          ]}
          onRowClick={this.handleEditClick}
        />
      </div>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        leases: getLeasesList(state),
        isFetching: getIsFetching(state),
      };
    },
    {
      fetchLeases,
      fetchAttributes,
      editLease,
    },
  ),
  translate(['common', 'leases', 'applications']),
)(LeaseList);
