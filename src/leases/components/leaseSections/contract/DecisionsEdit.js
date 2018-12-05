// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButton from '$components/form/AddButton';
import DecisionItemEdit from './DecisionItemEdit';
import {receiveFormValidFlags} from '$src/leases/actions';
import {ButtonColors} from '$components/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/leases/enums';
import {getContentDecisions} from '$src/leases/helpers';
import {getCurrentLease} from '$src/leases/selectors';

import type {Lease} from '$src/leases/types';

type DecisionsProps = {
  decisionsData: Array<Object>,
  fields: any,
}

const renderDecisions = ({
  decisionsData,
  fields,
}: DecisionsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
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
                decisionsData={decisionsData}
                index={index}
                field={decision}
                onRemove={handleRemove}
              />;
            })}
            <Row>
              <Column>
                <AddButton
                  label='Lisää päätös'
                  onClick={handleAdd}
                />
              </Column>
            </Row>
          </div>
        );
      }}
    </AppConsumer>

  );
};

type Props = {
  currentLease: Lease,
  receiveFormValidFlags: Function,
  valid: boolean,
}

type State = {
  currentLease: ?Lease,
  decisionsData: Array<Object>,
}

class DecisionsEdit extends Component<Props, State> {
  state = {
    currentLease: null,
    decisionsData: [],
  }

  static getDerivedStateFromProps(props, state) {
    if(props.currentLease !== state.currentLease) {
      const decisions = getContentDecisions(props.currentLease);
      return {
        currentLease: props.currentLease,
        decisionsData: decisions,
      };
    }
    return null;
  }

  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.DECISIONS]: this.props.valid,
      });
    }
  }

  render() {
    const {
      decisionsData,
    } = this.state;

    return (
      <form>
        <FieldArray
          component={renderDecisions}
          decisionsData={decisionsData}
          name="decisions"
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
      };
    },
    {
      receiveFormValidFlags,
    },
  ),
  reduxForm({
    form: formName,
    destroyOnUnmount: false,
  }),
)(DecisionsEdit);
