// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButton from '$components/form/AddButton';
import AttachDecisionModal from './AttachDecisionModal';
import Authorization from '$components/authorization/Authorization';
import DecisionItemEdit from './DecisionItemEdit';
import FormText from '$components/form/FormText';
import {
  copyDecisionToLeases,
  hideAttachDecisionModal,
  receiveFormValidFlags,
  showAttachDecisionModal,
} from '$src/leases/actions';
import {ButtonColors} from '$components/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {hasPermissions} from '$util/helpers';
import {getCurrentLease, getIsAttachDecisionModalOpen} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Lease} from '$src/leases/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type DecisionsProps = {
  fields: any,
  onAttach: Function,
  usersPermissions: UsersPermissionsType,
}

const renderDecisions = ({
  fields,
  onAttach,
  usersPermissions,
}: DecisionsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {!hasPermissions(usersPermissions, UsersPermissions.ADD_DECISION) &&
              (!fields || !fields.length) &&
              <FormText className='no-margin'>Ei päätöksiä</FormText>
            }
            {fields && !!fields.length && fields.map((decision, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: 'Poista',
                  confirmationModalLabel: DeleteModalLabels.DECISION,
                  confirmationModalTitle: DeleteModalTitles.DECISION,
                });
              };

              return <DecisionItemEdit
                key={index}
                index={index}
                field={decision}
                onAttach={onAttach}
                onRemove={handleRemove}
              />;
            })}
            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_DECISION)}>
              <Row>
                <Column>
                  <AddButton
                    label='Lisää päätös'
                    onClick={handleAdd}
                  />
                </Column>
              </Row>
            </Authorization>
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  copyDecisionToLeases: Function,
  currentLease: Lease,
  hideAttachDecisionModal: Function,
  isAttachDecisionModalOpen: boolean,
  receiveFormValidFlags: Function,
  showAttachDecisionModal: Function,
  usersPermissions: UsersPermissionsType,
  valid: boolean,
}

type State = {
  decisionToAttach: ?number,
}


class DecisionsEdit extends PureComponent<Props, State> {
  state = {
    decisionToAttach: null,
  }

  componentDidMount = () => {
    const {hideAttachDecisionModal} = this.props;

    hideAttachDecisionModal();
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.DECISIONS]: this.props.valid,
      });
    }
  }

  handleAttach = (decisionId) => {
    const {showAttachDecisionModal} = this.props;

    showAttachDecisionModal();
    this.setState({decisionToAttach: decisionId});
  }

  handleModalCancelAndClose = () => {
    const {hideAttachDecisionModal} = this.props;

    hideAttachDecisionModal();
    this.setState({decisionToAttach: null});
  }

  handleAttachDecisions = (payload: Object) => {
    const {copyDecisionToLeases} = this.props;
    const {decisionToAttach} = this.state;

    copyDecisionToLeases({
      ...payload,
      decision: decisionToAttach,
    });
  }

  render() {
    const {
      currentLease,
      isAttachDecisionModalOpen,
      usersPermissions,
    } = this.props;

    return (
      <form>
        <AttachDecisionModal
          currentLeaseId={currentLease.id}
          isOpen={isAttachDecisionModalOpen}
          onCancel={this.handleModalCancelAndClose}
          onClose={this.handleModalCancelAndClose}
          onSubmit={this.handleAttachDecisions}
        />

        <FieldArray
          component={renderDecisions}
          name="decisions"
          onAttach={this.handleAttach}
          usersPermissions={usersPermissions}
        />
      </form>
    );
  }
}

const formName = FormNames.DECISIONS;

export default flowRight(
  connect(
    (state) => {
      return {
        currentLease: getCurrentLease(state),
        isAttachDecisionModalOpen: getIsAttachDecisionModalOpen(state),
        usersPermissions: getUsersPermissions(state),
      };
    },
    {
      copyDecisionToLeases,
      hideAttachDecisionModal,
      receiveFormValidFlags,
      showAttachDecisionModal,
    },
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(DecisionsEdit);
