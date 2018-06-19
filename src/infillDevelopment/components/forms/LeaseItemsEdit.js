// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import AddButton from '$components/form/AddButton';
import LeaseItemEdit from './LeaseItemEdit';

type Props = {
  fields: any,
  isSaveClicked: boolean,
}

const LeaseItemsEdit = ({fields, isSaveClicked}: Props) => {
  return (
    <div>
      {!!fields && !!fields.length && fields.map((lease, index) => {
        return <LeaseItemEdit
          key={index}
          field={lease}
          fields={fields}
          index={index}
          isSaveClicked={isSaveClicked}
        />;
      })}
      <Row>
        <Column>
          <AddButton
            label='Lisää vuokraus'
            onClick={() => fields.push()}
            title='Lisää vuokraus'
          />
        </Column>
      </Row>
    </div>
  );
};

export default LeaseItemsEdit;
