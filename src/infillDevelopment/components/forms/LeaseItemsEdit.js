// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import type {Element} from 'react';

import AddButton from '$components/form/AddButton';
import LeaseItemEdit from './LeaseItemEdit';
import {DeleteModalLabels, DeleteModalTitles} from '$src/infillDevelopment/enums';

import type {InfillDevelopment} from '$src/infillDevelopment/types';

type Props = {
  fields: any,
  infillDevelopment: InfillDevelopment,
  isSaveClicked: boolean,
  onOpenDeleteModal: Function,
}

const LeaseItemsEdit = ({fields, infillDevelopment, isSaveClicked, onOpenDeleteModal}: Props): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <div>
      {!!fields && !!fields.length && fields.map((lease, index) => {
        const handleOpenDeleteModal = (index: number) => {
          onOpenDeleteModal(
            () => fields.remove(index),
            DeleteModalTitles.LEASE,
            DeleteModalLabels.LEASE,
          );
        };

        return <LeaseItemEdit
          key={index}
          field={lease}
          fields={fields}
          infillDevelopment={infillDevelopment}
          index={index}
          isSaveClicked={isSaveClicked}
          onOpenDeleteModal={onOpenDeleteModal}
          onRemove={handleOpenDeleteModal}
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
};

export default LeaseItemsEdit;
