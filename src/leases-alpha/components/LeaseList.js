// @ flow
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import orderBy from 'lodash/orderBy';

import {getUser} from '../../role/selectors';
import {fetchAttributes} from '../../attributes/actions';
import {editLease, fetchLeases, createLease} from '../actions';
import Loader from '../../components-alpha/loader/Loader';
import {getIsFetching, getLeasesList} from '../selectors';
import FilterableList from '../../components-alpha/filterableList/FilterableList';
import {getActiveLanguage} from '$util/helpers';

import NewLeaseTemplate from './NewLeaseTemplate';

type Props = {
  closeReveal: Function,
  createLease: Function,
  editLease: Function,
  fetchAttributes: Function,
  fetchLeases: Function,
  isFetching: boolean,
  leases: Array<any>,
  params: Object,
  router: Object,
  t: Function,
  user: Object,
};

class LeaseList extends Component<Props> {
  static contextTypes = {
    router: PropTypes.object,
  };

  UNSAFE_componentWillMount() {
    const {fetchAttributes, fetchLeases} = this.props;

    fetchAttributes();
    fetchLeases();
  }

  handleEditClick = (id) => {
    const {router} = this.context;
    const {router: {location: {query}}} = this.props;
    // $FlowFixMe
    const lang = getActiveLanguage().id;

    return router.push({
      pathname: `/alpha/${lang}/leases/${id}`,
      query,
    });
  };

  handleCreateLease = () => {
    const {createLease, user} = this.props;
    const lease = NewLeaseTemplate({preparer: user});
    return createLease(lease);
  };

  render() {
    const {leases, isFetching, t} = this.props;
    const orderedLeases = orderBy(leases, ['id'], ['asc']);

    return (
      <div className="leases">
        <Loader isLoading={isFetching}/>
        <FilterableList
          data={orderedLeases}
          displayFilters={true}
          isFetching={isFetching}
          dataKeys={[
            {key: 'id', label: 'ID'},
            {key: 'identifier', label: 'Vuokraustunnus'},
            {key: 'application.type', label: 'Tyyppi', renderer: (val) => val ? t(`types.${val}`) : ' - '},
            {key: 'tenants.length', label: 'Vuokralaiset'},
            {key: ['preparer.first_name', 'preparer.last_name'], label: 'Valmistelija', renderer: (val) => `${val} `},
            {key: 'state', label: 'Tila', renderer: (val) => t(`state.${val}`)},
          ]}
          onRowClick={this.handleEditClick}
        />

        <button className="button primary" onClick={this.handleCreateLease}>{t('add')}</button>
      </div>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        user: getUser(state),
        leases: getLeasesList(state),
        isFetching: getIsFetching(state),
      };
    },
    {
      fetchLeases,
      fetchAttributes,
      editLease,
      createLease,
    },
  ),
  translate(['common', 'leases', 'applications']),
)(LeaseList);
