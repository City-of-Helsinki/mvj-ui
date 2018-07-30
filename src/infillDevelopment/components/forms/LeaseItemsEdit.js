// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import type {Element} from 'react';

import AddButton from '$components/form/AddButton';
import LeaseItemEdit from './LeaseItemEdit';

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

  const handleRemove = (index: number) => {
    fields.remove(index);
  };

  return (
    <div>
      {!!fields && !!fields.length && fields.map((lease, index) => {
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
};

export default LeaseItemsEdit;
