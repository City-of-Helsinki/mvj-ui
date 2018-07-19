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
