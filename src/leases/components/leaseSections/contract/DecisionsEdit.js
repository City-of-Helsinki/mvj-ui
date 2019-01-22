// @flow
import React, {Fragment, PureComponent} from 'react';
import {connect} from 'react-redux';
import {FieldArray, reduxForm} from 'redux-form';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButton from '$components/form/AddButton';
import Authorization from '$components/authorization/Authorization';
import DecisionItemEdit from './DecisionItemEdit';
import FormText from '$components/form/FormText';
import {receiveFormValidFlags} from '$src/leases/actions';
import {ButtonColors} from '$components/enums';
import {DeleteModalLabels, DeleteModalTitles, FormNames, LeaseDecisionsFieldPaths} from '$src/leases/enums';
import {getAttributes as getLeaseAttributes} from '$src/leases/selectors';
import {isFieldAllowedToEdit} from '$util/helpers';

import type {Attributes} from '$src/types';

type DecisionsProps = {
  fields: any,
  leaseAttributes: Attributes,
}

const renderDecisions = ({
  fields,
  leaseAttributes,
}: DecisionsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {!isFieldAllowedToEdit(leaseAttributes, LeaseDecisionsFieldPaths.DECISIONS) && (!fields || !fields.length) &&
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
                onRemove={handleRemove}
              />;
            })}
            <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseDecisionsFieldPaths.DECISIONS)}>
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
  leaseAttributes: Attributes,
  receiveFormValidFlags: Function,
  valid: boolean,
}


class DecisionsEdit extends PureComponent<Props> {
  componentDidUpdate(prevProps) {
    const {receiveFormValidFlags} = this.props;

    if(prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [FormNames.DECISIONS]: this.props.valid,
      });
    }
  }

  render() {
    const {leaseAttributes} = this.props;

    return (
      <form>
        <FieldArray
          component={renderDecisions}
          leaseAttributes={leaseAttributes}
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
        leaseAttributes: getLeaseAttributes(state),
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
