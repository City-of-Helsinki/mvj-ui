import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import { change } from "redux-form";
import classNames from "classnames";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import Authorization from "@/components/authorization/Authorization";
import BasisOfRentEdit from "./BasisOfRentEdit";
import CalculateRentTotal from "./CalculateRentTotal";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import FormText from "@/components/form/FormText";
import GrayBox from "@/components/content/GrayBox";
import GreenBox from "@/components/content/GreenBox";
import { ConfirmationModalTexts } from "@/enums";
import { ButtonColors } from "@/components/enums";
import { BasisOfRentManagementSubventionsFieldPaths, LeaseBasisOfRentsFieldPaths, calculatorTypeOptions } from "@/leases/enums";
import { UsersPermissions } from "@/usersPermissions/enums";
import { calculateBasisOfRentTotalDiscountedInitialYearRent } from "@/leases/helpers";
import { getFieldOptions, hasPermissions, isEmptyValue } from "@/util/helpers";
import { getAttributes as getLeaseAttributes } from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import type { Attributes } from "types";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
type Props = {
  addButtonClass?: string;
  archived: boolean;
  basisOfRents: Array<Record<string, any>>;
  change: (...args: Array<any>) => any;
  fields: any;
  formName: string;
  isSaveClicked: boolean;
  leaseAttributes: Attributes;
  onArchive?: (...args: Array<any>) => any;
  onUnarchive?: (...args: Array<any>) => any;
  showLockedAt?: boolean;
  showPlansInspectedAt?: boolean;
  usersPermissions: UsersPermissionsType;
};
type State = {
  areaUnitOptions: Array<Record<string, any>>;
  indexOptions: Array<Record<string, any>>;
  intendedUseOptions: Array<Record<string, any>>;
  leaseAttributes: Attributes;
  managementTypeOptions: Array<Record<string, any>>;
  subventionTypeOptions: Array<Record<string, any>>;
  typeOptions: Array<Record<string, any>>;
};

class BasisOfRentsEdit extends PureComponent<Props, State> {
  state = {
    areaUnitOptions: [],
    indexOptions: [],
    intendedUseOptions: [],
    leaseAttributes: null,
    managementTypeOptions: [],
    subventionTypeOptions: [],
    typeOptions: []
  };

  static getDerivedStateFromProps(props: Props, state: State) {
    const newState: any = {};

    if (props.leaseAttributes !== state.leaseAttributes) {
      newState.leaseAttributes = props.leaseAttributes;
      newState.areaUnitOptions = getFieldOptions(props.leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT, true, option => !isEmptyValue(option.display_name) ? option.display_name.replace('^2', '²') : option.display_name);
      newState.indexOptions = getFieldOptions(props.leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX, true);
      newState.intendedUseOptions = getFieldOptions(props.leaseAttributes, LeaseBasisOfRentsFieldPaths.INTENDED_USE);
      newState.managementTypeOptions = getFieldOptions(props.leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT);
      newState.subventionTypeOptions = getFieldOptions(props.leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_TYPE);
      newState.typeOptions = getFieldOptions(props.leaseAttributes, LeaseBasisOfRentsFieldPaths.TYPE);
    }

    return newState;
  }

  handleAdd = () => {
    const {
      fields
    } = this.props;
    fields.push({});
  };
  removeBasisOfRent = (index: number) => {
    const {
      fields
    } = this.props;
    fields.remove(index);
  };

  render() {
    const {
      addButtonClass,
      archived,
      basisOfRents,
      fields,
      formName,
      isSaveClicked,
      onArchive,
      onUnarchive,
      showLockedAt,
      showPlansInspectedAt,
      usersPermissions
    } = this.props;
    const {
      areaUnitOptions,
      indexOptions,
      intendedUseOptions,
      managementTypeOptions,
      subventionTypeOptions,
      typeOptions
    } = this.state;
    const totalDiscountedInitialYearRent = calculateBasisOfRentTotalDiscountedInitialYearRent(basisOfRents, indexOptions);

    if (!archived && (!fields || !fields.length)) {
      return <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_LEASEBASISOFRENT)} errorComponent={<FormText className='no-margin'>Ei vuokralaskureita</FormText>}>
          <Row>
            <Column>
              <AddButtonSecondary className={classNames(addButtonClass, {
              'no-top-margin': !fields || !fields.length
            })} label='Lisää vuokralaskuri' onClick={this.handleAdd} />
            </Column>
          </Row>
        </Authorization>;
    }

    return <AppConsumer>
        {({
        dispatch
      }) => {
        if (archived) {
          if (!fields || !fields.length) return null;
          return <Fragment>
                <h3 style={{
              marginTop: 10,
              marginBottom: 5
            }}>Arkisto</h3>
                <GrayBox>
                  <BoxItemContainer>
                    {fields && !!fields.length && fields.map((field, index) => {
                  const handleRemove = () => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        fields.remove(index);
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText: ConfirmationModalTexts.DELETE_LEASE_BASIS_OF_RENT.BUTTON,
                      confirmationModalLabel: ConfirmationModalTexts.DELETE_LEASE_BASIS_OF_RENT.LABEL,
                      confirmationModalTitle: ConfirmationModalTexts.DELETE_LEASE_BASIS_OF_RENT.TITLE
                    });
                  };

                  const handleUnarchive = (savedItem: Record<string, any>) => {
                    dispatch({
                      type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                      confirmationFunction: () => {
                        if (onUnarchive) {
                          onUnarchive(index, savedItem);
                        }
                      },
                      confirmationModalButtonClassName: ButtonColors.ALERT,
                      confirmationModalButtonText: ConfirmationModalTexts.UNARCHIVE_LEASE_BASIS_OF_RENT.BUTTON,
                      confirmationModalLabel: ConfirmationModalTexts.UNARCHIVE_LEASE_BASIS_OF_RENT.LABEL,
                      confirmationModalTitle: ConfirmationModalTexts.UNARCHIVE_LEASE_BASIS_OF_RENT.TITLE
                    });
                  };

                  return <BasisOfRentEdit key={index} archived={true} areaUnitOptions={areaUnitOptions} field={field} formName={formName} indexOptions={indexOptions} intendedUseOptions={intendedUseOptions} isSaveClicked={isSaveClicked} managementTypeOptions={managementTypeOptions} onRemove={handleRemove} onUnarchive={handleUnarchive} showLockedAt={showLockedAt} showPlansInspectedAt={showPlansInspectedAt} showTotal={fields.length > 1 && fields.length === index + 1} subventionTypeOptions={subventionTypeOptions} totalDiscountedInitialYearRent={totalDiscountedInitialYearRent} typeOptions={typeOptions} calculatorTypeOptions={calculatorTypeOptions} />;
                })}
                  </BoxItemContainer>
                </GrayBox>
              </Fragment>;
        } else {
          return <GreenBox>
                <BoxItemContainer>
                  {fields && !!fields.length && fields.map((field, index) => {
                const handleRemove = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      fields.remove(index);
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText: ConfirmationModalTexts.DELETE_LEASE_BASIS_OF_RENT.BUTTON,
                    confirmationModalLabel: ConfirmationModalTexts.DELETE_LEASE_BASIS_OF_RENT.LABEL,
                    confirmationModalTitle: ConfirmationModalTexts.DELETE_LEASE_BASIS_OF_RENT.TITLE
                  });
                };

                const handleArchive = (savedItem: Record<string, any>) => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      if (onArchive) {
                        onArchive(index, savedItem);
                      }
                    },
                    confirmationModalButtonClassName: ButtonColors.SUCCESS,
                    confirmationModalButtonText: ConfirmationModalTexts.ARCHIVE_LEASE_BASIS_OF_RENT.BUTTON,
                    confirmationModalLabel: ConfirmationModalTexts.ARCHIVE_LEASE_BASIS_OF_RENT.LABEL,
                    confirmationModalTitle: ConfirmationModalTexts.ARCHIVE_LEASE_BASIS_OF_RENT.TITLE
                  });
                };

                return <BasisOfRentEdit key={index} archived={false} areaUnitOptions={areaUnitOptions} field={field} formName={formName} indexOptions={indexOptions} intendedUseOptions={intendedUseOptions} isSaveClicked={isSaveClicked} managementTypeOptions={managementTypeOptions} onArchive={handleArchive} onRemove={handleRemove} showLockedAt={showLockedAt} showPlansInspectedAt={showPlansInspectedAt} showTotal={fields.length > 1 && fields.length === index + 1} subventionTypeOptions={subventionTypeOptions} totalDiscountedInitialYearRent={totalDiscountedInitialYearRent} typeOptions={typeOptions} calculatorTypeOptions={calculatorTypeOptions} />;
              })}
                </BoxItemContainer>

                <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_LEASEBASISOFRENT)}>
                  <Row>
                    <Column>
                      <AddButtonSecondary className={classNames({
                    'no-top-margin': !fields || !fields.length
                  })} label='Lisää vuokralaskuri' onClick={this.handleAdd} />
                    </Column>
                  </Row>
                </Authorization>

                {basisOfRents.length > 1 && <CalculateRentTotal basisOfRents={basisOfRents} indexOptions={indexOptions} />}
              </GreenBox>;
        }
      }}
      </AppConsumer>;
  }

}

export default connect(state => {
  return {
    leaseAttributes: getLeaseAttributes(state),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  change
}, null, {
  forwardRef: true
})(BasisOfRentsEdit);