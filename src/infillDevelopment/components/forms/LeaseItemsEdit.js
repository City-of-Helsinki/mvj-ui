// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import Authorization from '$components/authorization/Authorization';
import LeaseItemEdit from './LeaseItemEdit';
import {ButtonColors} from '$components/enums';
import {
  DeleteModalLabels,
  DeleteModalTitles,
  InfillDevelopmentCompensationLeasesFieldPaths,
} from '$src/infillDevelopment/enums';
import {isFieldAllowedToRead} from '$util/helpers';
import {getAttributes as getInfillDevelopmentAttributes} from '$src/infillDevelopment/selectors';

import type {Attributes} from '$src/types';
import type {InfillDevelopment} from '$src/infillDevelopment/types';

type Props = {
  fields: any,
  infillDevelopment: InfillDevelopment,
  infillDevelopmentAttributes: Attributes,
  isSaveClicked: boolean,
}

const LeaseItemsEdit = ({
  fields,
  infillDevelopment,
  infillDevelopmentAttributes,
  isSaveClicked,
}: Props): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {!!fields && !!fields.length && fields.map((lease, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: 'Poista',
                  confirmationModalLabel: DeleteModalLabels.LEASE,
                  confirmationModalTitle: DeleteModalTitles.LEASE,
                });
              };

              return <LeaseItemEdit
                key={index}
                field={lease}
                fields={fields}
                infillDevelopment={infillDevelopment}
                index={index}
                isSaveClicked={isSaveClicked}
                onRemove={handleRemove}
              />;
            })}

            <Authorization allow={isFieldAllowedToRead(infillDevelopmentAttributes, InfillDevelopmentCompensationLeasesFieldPaths.INFILL_DEVELOPMENT_COMPENSATION_LEASES)}>
              <Row>
                <Column>
                  <AddButtonSecondary
                    label='Lisää vuokraus'
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

export default connect(
  (state) => {
    return {
      infillDevelopmentAttributes: getInfillDevelopmentAttributes(state),
    };
  }
)(LeaseItemsEdit);
