// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import get from 'lodash/get';

import AddButtonSecondary from '$components/form/AddButtonSecondary';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import FormField from '$components/form/FormField';
import FormFieldLabel from '$components/form/FormFieldLabel';
import RemoveButton from '$components/form/RemoveButton';
import {RentTypes} from '$src/leases/enums';
import {getAttributes} from '$src/leases/selectors';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  fields: any,
  rentType: string,
}

const ContractRentsEdit = ({attributes, fields, rentType}: Props) => {
  return (
    <div>
      <BoxItemContainer>
        {fields && !!fields.length && fields.map((rent, index) => {
          return(
            <BoxItem
              key={index}
              className='no-border-on-first-child'>
              <BoxContentWrapper>
                <RemoveButton
                  className='position-topright'
                  onClick={() => fields.remove(index)}
                  title="Poista alennus/korotus"
                />
                <Row>
                  <Column small={6} medium={4} large={2}>
                    <FormFieldLabel>Sopimusvuokra</FormFieldLabel>
                    <Row>
                      <Column small={6}>
                        <FormField
                          fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.amount')}
                          name={`${rent}.amount`}
                          overrideValues={{
                            label: '',
                          }}
                        />
                      </Column>
                      <Column small={6}>
                        <FormField
                          fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.period')}
                          name={`${rent}.period`}
                          overrideValues={{
                            label: '',
                          }}
                        />
                      </Column>
                    </Row>
                  </Column>
                  <Column small={6} medium={4} large={2}>
                    <FormField
                      fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.intended_use')}
                      name={`${rent}.intended_use`}
                      overrideValues={{
                        label: 'Käyttötarkoitus',
                      }}
                    />
                  </Column>
                  {(rentType === RentTypes.INDEX ||
                    rentType === RentTypes.MANUAL) &&
                    <Column small={6} medium={4} large={2}>
                      <FormFieldLabel>Vuokranlaskennan perusteena oleva vuokra</FormFieldLabel>
                      <Row>
                        <Column small={6}>
                          <FormField
                            fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.base_amount')}
                            name={`${rent}.base_amount`}
                            overrideValues={{
                              label: '',
                            }}
                          />
                        </Column>
                        <Column small={6}>
                          <FormField
                            fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.base_amount_period')}
                            name={`${rent}.base_amount_period`}
                            overrideValues={{
                              label: '',
                            }}
                          />
                        </Column>
                      </Row>
                    </Column>
                  }
                  {(rentType === RentTypes.INDEX ||
                    rentType === RentTypes.MANUAL) &&
                    <Column small={6} medium={4} large={2} offsetOnLarge={1}>
                      <FormField
                        fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.base_year_rent')}
                        name={`${rent}.base_year_rent`}
                        overrideValues={{
                          label: 'Uusi perusvuosivuokra',
                        }}
                      />
                    </Column>
                  }
                  <Column small={6} medium={4} large={2}>
                    <FormFieldLabel>Voimassaoloaika</FormFieldLabel>
                    <Row>
                      <Column small={6}>
                        <FormField
                          fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.start_date')}
                          name={`${rent}.start_date`}
                          overrideValues={{
                            label: '',
                          }}
                        />
                      </Column>
                      <Column small={6}>
                        <FormField
                          className='with-dash'
                          fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.end_date')}
                          name={`${rent}.end_date`}
                          overrideValues={{
                            label: '',
                          }}
                        />
                      </Column>
                    </Row>
                  </Column>
                </Row>
              </BoxContentWrapper>
            </BoxItem>
          );
        })}
      </BoxItemContainer>
      <Row>
        <Column>
          <AddButtonSecondary
            label='Lisää sopimusvuokra'
            onClick={() => fields.push({})}
            title='Lisää sopimusvuokra'
          />
        </Column>
      </Row>
    </div>
  );
};

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
    };
  },
)(ContractRentsEdit);
