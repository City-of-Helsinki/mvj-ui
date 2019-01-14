// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import Authorization from '$components/authorization/Authorization';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import FormField from '$components/form/FormField';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import {
  LeaseRentContractRentsFieldPaths,
  LeaseRentContractRentsFieldTitles,
  RentTypes,
} from '$src/leases/enums';
import {
  getFieldAttributes,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
  isFieldRequired,
} from '$util/helpers';
import {
  getAttributes as getLeaseAttributes,
  getIsSaveClicked,
} from '$src/leases/selectors';
import {withWindowResize} from '$components/resize/WindowResizeHandler';

import type {Attributes} from '$src/types';

type Props = {
  field: string,
  isSaveClicked: boolean,
  largeScreen: boolean,
  leaseAttributes: Attributes,
  onRemove: Function,
  rentField: string,
  rentType: string,
  showRemove: boolean,
}

const ContractRent = ({field, isSaveClicked, largeScreen, leaseAttributes, onRemove, rentType, showRemove}: Props) => {
  if(largeScreen) {
    return(
      <Row>
        <Column large={2}>
          <Row>
            <Column small={6}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.AMOUNT)}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentContractRentsFieldPaths.AMOUNT)}
                  invisibleLabel
                  name={`${field}.amount`}
                  unit='€'
                  overrideValues={{label: LeaseRentContractRentsFieldTitles.AMOUNT}}
                />
              </Authorization>
            </Column>
            <Column small={6}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.PERIOD)}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentContractRentsFieldPaths.PERIOD)}
                  invisibleLabel
                  name={`${field}.period`}
                  overrideValues={{label: LeaseRentContractRentsFieldTitles.PERIOD}}
                />
              </Authorization>
            </Column>
          </Row>
        </Column>
        <Column large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.INTENDED_USE)}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentContractRentsFieldPaths.INTENDED_USE)}
              invisibleLabel
              name={`${field}.intended_use`}
              overrideValues={{label: LeaseRentContractRentsFieldTitles.INTENDED_USE}}
            />
          </Authorization>
        </Column>
        {(rentType === RentTypes.INDEX ||
          rentType === RentTypes.MANUAL) &&
          <Column large={2}>
            <Row>
              <Column small={6}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_AMOUNT)}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_AMOUNT)}
                    invisibleLabel
                    name={`${field}.base_amount`}
                    unit='€'
                    overrideValues={{label: LeaseRentContractRentsFieldTitles.BASE_AMOUNT}}
                  />
                </Authorization>
              </Column>
              <Column small={6}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_AMOUNT_PERIOD)}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_AMOUNT_PERIOD)}
                    invisibleLabel
                    name={`${field}.base_amount_period`}
                    overrideValues={{label: LeaseRentContractRentsFieldTitles.BASE_AMOUNT_PERIOD}}
                  />
                </Authorization>
              </Column>
            </Row>
          </Column>
        }
        {(rentType === RentTypes.INDEX ||
          rentType === RentTypes.MANUAL) &&
          <Column large={2} offsetOnLarge={1}>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_YEAR_RENT)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_YEAR_RENT)}
                invisibleLabel
                name={`${field}.base_year_rent`}
                unit='€'
                overrideValues={{label: LeaseRentContractRentsFieldTitles.BASE_YEAR_RENT}}
              />
            </Authorization>
          </Column>
        }
        <Column large={2}>
          <Row>
            <Column small={6}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.START_DATE)}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentContractRentsFieldPaths.START_DATE)}
                  invisibleLabel
                  name={`${field}.start_date`}
                  overrideValues={{label: LeaseRentContractRentsFieldTitles.START_DATE}}
                />
              </Authorization>
            </Column>
            <Column small={6}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.END_DATE)}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentContractRentsFieldPaths.END_DATE)}
                  invisibleLabel
                  name={`${field}.end_date`}
                  overrideValues={{label: LeaseRentContractRentsFieldTitles.END_DATE}}
                />
              </Authorization>
            </Column>
          </Row>
        </Column>
        <Column>
          {showRemove &&
            <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseRentContractRentsFieldPaths.CONTRACT_RENTS)}>
              <RemoveButton
                className='third-level'
                onClick={onRemove}
                title="Poista sopimusvuokra"
              />
            </Authorization>
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
              <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseRentContractRentsFieldPaths.CONTRACT_RENTS)}>
                <RemoveButton
                  onClick={onRemove}
                  title="Poista sopimusvuokra"
                />
              </Authorization>
            </ActionButtonWrapper>
          }
          <Row>
            <Column small={6} medium={4}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.AMOUNT)}>
                <FormTextTitle required={isFieldRequired(leaseAttributes, LeaseRentContractRentsFieldPaths.AMOUNT)}>
                  {LeaseRentContractRentsFieldTitles.AMOUNT}
                </FormTextTitle>
              </Authorization>

              <Row>
                <Column small={6}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.AMOUNT)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentContractRentsFieldPaths.AMOUNT)}
                      invisibleLabel
                      name={`${field}.amount`}
                      unit='€'
                      overrideValues={{label: LeaseRentContractRentsFieldTitles.AMOUNT}}
                    />
                  </Authorization>
                </Column>
                <Column small={6}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.PERIOD)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentContractRentsFieldPaths.PERIOD)}
                      invisibleLabel
                      name={`${field}.period`}
                      overrideValues={{label: LeaseRentContractRentsFieldTitles.PERIOD}}
                    />
                  </Authorization>
                </Column>
              </Row>
            </Column>
            <Column small={6} medium={4}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.INTENDED_USE)}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentContractRentsFieldPaths.INTENDED_USE)}
                  name={`${field}.intended_use`}
                  overrideValues={{label: LeaseRentContractRentsFieldTitles.INTENDED_USE}}
                />
              </Authorization>
            </Column>
            {(rentType === RentTypes.INDEX ||
              rentType === RentTypes.MANUAL) &&
              <Column small={6} medium={4}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_AMOUNT)}>
                  <FormTextTitle required={isFieldRequired(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_AMOUNT)}>
                    {LeaseRentContractRentsFieldTitles.BASE_AMOUNT}
                  </FormTextTitle>
                </Authorization>

                <Row>
                  <Column small={6}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_AMOUNT)}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_AMOUNT)}
                        invisibleLabel
                        name={`${field}.base_amount`}
                        unit='€'
                        overrideValues={{label: LeaseRentContractRentsFieldTitles.BASE_AMOUNT}}
                      />
                    </Authorization>
                  </Column>
                  <Column small={6}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_AMOUNT_PERIOD)}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_AMOUNT_PERIOD)}
                        invisibleLabel
                        name={`${field}.base_amount_period`}
                        overrideValues={{label: LeaseRentContractRentsFieldTitles.BASE_AMOUNT_PERIOD}}
                      />
                    </Authorization>
                  </Column>
                </Row>
              </Column>
            }
            {(rentType === RentTypes.INDEX ||
              rentType === RentTypes.MANUAL) &&
              <Column small={6} medium={4}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_YEAR_RENT)}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentContractRentsFieldPaths.BASE_YEAR_RENT)}
                    invisibleLabel
                    name={`${field}.base_year_rent`}
                    unit='€'
                    overrideValues={{label: LeaseRentContractRentsFieldTitles.BASE_YEAR_RENT}}
                  />
                </Authorization>
              </Column>
            }
            <Column small={6} medium={4}>
              <Row>
                <Column small={6}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.START_DATE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentContractRentsFieldPaths.START_DATE)}
                      name={`${field}.start_date`}
                      overrideValues={{label: LeaseRentContractRentsFieldTitles.START_DATE}}
                    />
                  </Authorization>
                </Column>
                <Column small={6}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseRentContractRentsFieldPaths.END_DATE)}>
                    <FormField
                      disableTouched={isSaveClicked}
                      fieldAttributes={getFieldAttributes(leaseAttributes, LeaseRentContractRentsFieldPaths.END_DATE)}
                      name={`${field}.end_date`}
                      overrideValues={{label: LeaseRentContractRentsFieldTitles.END_DATE}}
                    />
                  </Authorization>
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
        isSaveClicked: getIsSaveClicked(state),
        leaseAttributes: getLeaseAttributes(state),
      };
    },
  ),
)(ContractRent);
