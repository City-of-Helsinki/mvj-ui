// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxItemContainer from '$components/content/BoxItemContainer';
import ContractRentEdit from './ContractRentEdit';
import {DeleteModalLabels, DeleteModalTitles} from '$src/leases/enums';

type Props = {
  fields: any,
  rentField: string,
  rentType: string,
}

const ContractRentsEdit = ({fields, rentField, rentType}: Props) => {
  const handleAdd = () => fields.push({});

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            <BoxItemContainer>
              {fields && !!fields.length && fields.map((rent, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_DELETE_MODAL,
                    deleteFunction: () => {
                      fields.remove(index);
                    },
                    deleteModalLabel: DeleteModalLabels.CONTRACT_RENT,
                    deleteModalTitle: DeleteModalTitles.CONTRACT_RENT,
                  });
                };

                return(
                  <ContractRentEdit
                    key={index}
                    field={rent}
                    onRemove={handleRemove}
                    rentField={rentField}
                    rentType={rentType}
                  />
                );
              })}
            </BoxItemContainer>
            <Row>
              <Column>
                <AddButtonSecondary
                  label='Lisää sopimusvuokra'
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

export default ContractRentsEdit;
