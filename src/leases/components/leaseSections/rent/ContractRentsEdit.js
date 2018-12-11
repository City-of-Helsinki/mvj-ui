// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxItemContainer from '$components/content/BoxItemContainer';
import ContractRentEdit from './ContractRentEdit';
import FormTextTitle from '$components/form/FormTextTitle';
import {ButtonColors} from '$components/enums';
import {DeleteModalLabels, DeleteModalTitles, RentTypes} from '$src/leases/enums';
import {Breakpoints} from '$src/foundation/enums';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fields: any,
  rentField: string,
  rentType: string,
}

const ContractRentsEdit = ({attributes, fields, rentField, rentType}: Props) => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <div>
            {(fields && !!fields.length) &&
              <Row showFor={Breakpoints.LARGE}>
                <Column large={2}>
                  <FormTextTitle
                    title='Perusvuosivuokra'
                    required={get(attributes, 'rents.child.children.contract_rents.child.children.amount.required')}
                  />
                </Column>
                <Column large={2}>
                  <FormTextTitle
                    title='Käyttötarkoitus'
                    required={get(attributes, 'rents.child.children.contract_rents.child.children.intended_use.required')}
                  />
                </Column>
                {(rentType === RentTypes.INDEX ||
                  rentType === RentTypes.MANUAL) &&
                  <Column large={3}>
                    <FormTextTitle
                      title='Vuokranlaskennan perusteena oleva vuokra'
                      required={get(attributes, 'rents.child.children.contract_rents.child.children.base_amount.required')}
                    />
                  </Column>
                }
                {(rentType === RentTypes.INDEX ||
                  rentType === RentTypes.MANUAL) &&
                  <Column large={2}>
                    <FormTextTitle
                      title='Uusi perusvuosivuokra'
                      required={get(attributes, 'rents.child.children.contract_rents.child.children.base_year_rent.required')}
                    />
                  </Column>
                }
                <Column large={1}>
                  <FormTextTitle
                    title='Alkupvm'
                    required={get(attributes, 'rents.child.children.contract_rents.child.children.start_date.required')}
                  />
                </Column>
                <Column large={1}>
                  <FormTextTitle
                    title='Loppupvm'
                    required={get(attributes, 'rents.child.children.contract_rents.child.children.end_date.required')}
                  />
                </Column>
              </Row>
            }
            <BoxItemContainer>
              {fields && !!fields.length && fields.map((rent, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText: 'Poista',
                    confirmationModalLabel: DeleteModalLabels.CONTRACT_RENT,
                    confirmationModalTitle: DeleteModalTitles.CONTRACT_RENT,
                  });
                };

                return(
                  <ContractRentEdit
                    key={index}
                    field={rent}
                    onRemove={handleRemove}
                    rentField={rentField}
                    rentType={rentType}
                    showRemove={!!fields && fields.length > 1}
                  />
                );
              })}
            </BoxItemContainer>
            <Row>
              <Column>
                <AddButtonSecondary
                  className={(!fields || !fields.length) ? 'no-top-margin' : ''}
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

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  },
)(ContractRentsEdit);
