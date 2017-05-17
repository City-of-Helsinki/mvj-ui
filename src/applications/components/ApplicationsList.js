// @flow
import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import orderBy from 'lodash/orderBy';

import {fetchApplications} from '../actions';
import {getApplicationsList, getIsFetching} from '../selectors';
// import {getActiveLanguage} from '../../util/helpers';

import ApplicationList from '../../components/applicationList/ApplicationList';

import EditModal from './formSections/editModal';
import ApplicationEditForm from './ApplicationEditForm';
import {revealContext} from '../../foundation/reveal';
import {Sizes} from '../../foundation/enums';
import {fetchAttributes} from '../../attributes/actions';
import {editApplication} from '../actions';
import Loader from '../../components/loader/Loader';

type Props = {
  applications: Array<any>,
  closeReveal: Function,
  editApplication: Function,
  fetchApplications: Function,
  fetchAttributes: Function,
  isFetching: boolean,
  params: Object,
  router: Object,
  t: Function,
};

type State = {
  isEditingApplication: boolean,
  applicationId: number | null,
  editingComponent: Object | null,
};

class ApplicationsList extends Component {
  props: Props;
  state: State;

  static contextTypes = {
    router: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this.state = {
      isEditingApplication: false,
      applicationId: null,
      editingComponent: null,
    };
  }

  componentWillMount() {
    const {fetchAttributes, fetchApplications} = this.props;

    fetchAttributes();
    fetchApplications();
  }

  handleItemClick = (applicationId) => {
    // const {router} = this.context;
    // const {router: {location: {query}}} = this.props;
    // const lang = getActiveLanguage().id;
    //
    // return router.push({
    //   pathname: `/${lang}/applications/${applicationId}`,
    //   query,
    // });
    this.setState({isEditingApplication: true, applicationId});
  };

  handleEditSave = (values) => {
    const {editApplication} = this.props;
    editApplication(values);
    this.handleDismissEditModal(true);
  };

  handleDismissEditModal = () => {
    this.setState({isEditingApplication: false}, () => {
      const {closeReveal} = this.props;
      closeReveal('editModal');
    });
  };

  render() {
    const {applications, isFetching} = this.props;
    const orderedApplications = orderBy(applications, ['id'], ['asc']);

    return (
      <div className="applications">
        <Loader isLoading={isFetching}/>
        <ApplicationList
          data={orderedApplications}
          handleItemClick={this.handleItemClick}
          isFetching={isFetching}
        />

        {this.state.isEditingApplication && !isFetching &&
        <EditModal size={Sizes.LARGE}
                   isOpen={this.state.isEditingApplication}
                   component={ApplicationEditForm}
                   handleSave={this.handleEditSave}
                   applicationId={this.state.applicationId}
                   handleDismiss={this.handleDismissEditModal}
        />
        }
      </div>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        applications: getApplicationsList(state),
        isFetching: getIsFetching(state),
      };
    },
    {
      fetchApplications,
      fetchAttributes,
      editApplication,
    },
  ),
  translate(['applications']),
  revealContext(),
)(ApplicationsList);
