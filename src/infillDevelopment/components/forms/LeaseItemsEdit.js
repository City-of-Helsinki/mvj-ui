// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import type {Element} from 'react';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButton from '$components/form/AddButton';
import LeaseItemEdit from './LeaseItemEdit';
import {DeleteModalLabels, DeleteModalTitles} from '$src/infillDevelopment/enums';

import type {InfillDevelopment} from '$src/infillDevelopment/types';

type Props = {
  fields: any,
  infillDevelopment: InfillDevelopment,
  isSaveClicked: boolean,
}

const LeaseItemsEdit = ({fields, infillDevelopment, isSaveClicked}: Props): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            {!!fields && !!fields.length && fields.map((lease, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_DELETE_MODAL,
                  deleteFunction: () => {
                    fields.remove(index);
                  },
                  deleteModalLabel: DeleteModalLabels.LEASE,
                  deleteModalTitle: DeleteModalTitles.LEASE,
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
            <Row>
              <Column>
                <AddButton
                  label='Lisää vuokraus'
                  onClick={handleAdd}
                  title='Lisää vuokraus'
                />
              </Column>
            </Row>
          </div>
        );
      }}
    </AppConsumer>

  );
};

export default LeaseItemsEdit;
