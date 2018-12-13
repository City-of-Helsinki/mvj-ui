// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';

import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import {RentTypes} from '$src/leases/enums';
import {getAttributes, getIsSaveClicked} from '$src/leases/selectors';
import {withWindowResize} from '$components/resize/WindowResizeHandler';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  field: string,
  isSaveClicked: boolean,
  largeScreen: boolean,
  onRemove: Function,
  rentField: string,
  rentType: string,
  showRemove: boolean,
}

const ContractRent = ({attributes, field, isSaveClicked, largeScreen, onRemove, rentType, showRemove}: Props) => {
  if(largeScreen) {
    return(
      <Row>
        <Column small={6} medium={4} large={2}>
          <Row>
            <Column small={6}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.amount')}
                invisibleLabel
                name={`${field}.amount`}
                unit='€'
              />
            </Column>
            <Column small={6}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.period')}
                invisibleLabel
                name={`${field}.period`}
              />
            </Column>
          </Row>
        </Column>
        <Column small={6} medium={4} large={2}>
          <FormField
            disableTouched={isSaveClicked}
            fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.intended_use')}
            invisibleLabel={largeScreen}
            name={`${field}.intended_use`}
            overrideValues={{
              label: 'Käyttötarkoitus',
            }}
          />
        </Column>
        {(rentType === RentTypes.INDEX ||
          rentType === RentTypes.MANUAL) &&
          <Column small={6} medium={4} large={2}>
            <Row>
              <Column small={6}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.base_amount')}
                  invisibleLabel
                  name={`${field}.base_amount`}
                  unit='€'
                />
              </Column>
              <Column small={6}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.base_amount_period')}
                  invisibleLabel
                  name={`${field}.base_amount_period`}
                />
              </Column>
            </Row>
          </Column>
        }
        {(rentType === RentTypes.INDEX ||
          rentType === RentTypes.MANUAL) &&
          <Column small={6} medium={4} large={2} offsetOnLarge={1}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.base_year_rent')}
              invisibleLabel={largeScreen}
              name={`${field}.base_year_rent`}
              unit='€'
              overrideValues={{
                label: 'Uusi perusvuosivuokra',
              }}
            />
          </Column>
        }
        <Column small={6} medium={4} large={2}>
          <Row>
            <Column small={6}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.start_date')}
                invisibleLabel={largeScreen}
                name={`${field}.start_date`}
                overrideValues={{
                  label: 'Alkupvm',
                }}
              />
            </Column>
            <Column small={6}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.end_date')}
                invisibleLabel={largeScreen}
                name={`${field}.end_date`}
                overrideValues={{
                  label: 'Loppupvm',
                }}
              />
            </Column>
          </Row>
        </Column>
        <Column>
          {showRemove &&
            <RemoveButton
              className='third-level'
              onClick={onRemove}
              title="Poista sopimusvuokra"
            />
          }
        </Column>
      </Row>
    );
  } else {
    // For small and medium screens
    return(
      <BoxItem>
        <BoxContentWrapper>
          {showRemove &&
            <ActionButtonWrapper>
              <RemoveButton
                onClick={onRemove}
                title="Poista sopimusvuokra"
              />
            </ActionButtonWrapper>
          }
          <Row>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle
                title='Perusvuosivuokra'
                required={get(attributes, 'rents.child.children.contract_rents.child.children.amount.required')}
              />
              <Row>
                <Column small={6}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.amount')}
                    invisibleLabel
                    name={`${field}.amount`}
                    unit='€'
                  />
                </Column>
                <Column small={6}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.period')}
                    invisibleLabel
                    name={`${field}.period`}
                  />
                </Column>
              </Row>
            </Column>
            <Column small={6} medium={4} large={2}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.intended_use')}
                invisibleLabel={largeScreen}
                name={`${field}.intended_use`}
                overrideValues={{
                  label: 'Käyttötarkoitus',
                }}
              />
            </Column>
            {(rentType === RentTypes.INDEX ||
              rentType === RentTypes.MANUAL) &&
              <Column small={6} medium={4} large={2}>
                <FormTextTitle
                  title='Vuokranlaskennan perusteena oleva vuokra'
                  required={get(attributes, 'rents.child.children.contract_rents.child.children.base_amount.required')}
                />
                <Row>
                  <Column small={6}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.base_amount')}
                      invisibleLabel
                      name={`${field}.base_amount`}
                      unit='€'
                    />
                  </Column>
                  <Column small={6}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.base_amount_period')}
                      invisibleLabel
                      name={`${field}.base_amount_period`}
                    />
                  </Column>
                </Row>
              </Column>
            }
            {(rentType === RentTypes.INDEX ||
              rentType === RentTypes.MANUAL) &&
              <Column small={6} medium={4} large={2} offsetOnLarge={1}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.base_year_rent')}
                  invisibleLabel={largeScreen}
                  name={`${field}.base_year_rent`}
                  unit='€'
                  overrideValues={{
                    label: 'Uusi perusvuosivuokra',
                  }}
                />
              </Column>
            }
            <Column small={6} medium={4} large={2}>
              <Row>
                <Column small={6}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.start_date')}
                    invisibleLabel={largeScreen}
                    name={`${field}.start_date`}
                    overrideValues={{
                      label: 'Alkupvm',
                    }}
                  />
                </Column>
                <Column small={6}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={get(attributes, 'rents.child.children.contract_rents.child.children.end_date')}
                    invisibleLabel={largeScreen}
                    name={`${field}.end_date`}
                    overrideValues={{
                      label: 'Loppupvm',
                    }}
                  />
                </Column>
              </Row>
            </Column>
          </Row>
        </BoxContentWrapper>
      </BoxItem>
    );
  }
};

export default flowRight(
  withWindowResize,
  connect(
    (state) => {
      return {
        attributes: getAttributes(state),
        isSaveClicked: getIsSaveClicked(state),
      };
    },
  ),
)(ContractRent);
