// @flow
import React, {Fragment, PureComponent, type Element} from 'react';
import {connect} from 'react-redux';
import {change, FieldArray, formValueSelector, clearFields} from 'redux-form';
import {Row, Column} from 'react-foundation';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import AddButtonSecondary from '$components/form/AddButtonSecondary';
import AddButtonThird from '$components/form/AddButtonThird';
import ArchiveButton from '$components/form/ArchiveButton';
import Authorization from '$components/authorization/Authorization';
import BasisOfRent from './BasisOfRent';
import BasisOfRentManagementSubventionEdit from './BasisOfRentManagementSubventionEdit';
import BasisOfRentTemporarySubventionEdit from './BasisOfRentTemporarySubventionEdit';
import BoxContentWrapper from '$components/content/BoxContentWrapper';
import BoxItem from '$components/content/BoxItem';
import CopyToClipboardButton from '$components/form/CopyToClipboardButton';
import Divider from '$components/content/Divider';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import WhiteBox from '$components/content/WhiteBox';
import {ConfirmationModalTexts} from '$src/enums';
import {ButtonColors} from '$components/enums';
import {
  BasisOfRentManagementSubventionsFieldPaths,
  BasisOfRentManagementSubventionsFieldTitles,
  BasisOfRentTemporarySubventionsFieldPaths,
  BasisOfRentTemporarySubventionsFieldTitles,
  CalculatorTypes,
  LeaseBasisOfRentsFieldPaths,
  LeaseBasisOfRentsFieldTitles,
  SubventionTypes,
} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {
  getBasisOfRentAmountPerArea,
  calculateAmountFromValue,
  calculateBasisOfRentBasicAnnualRent,
  calculateBasisOfRentDiscountedInitialYearRent,
  calculateBasisOfRentInitialYearRent,
  calculateBasisOfRentSubventionAmount,
  calculateReLeaseDiscountPercent,
  calculateBasicAnnualRentIndexed,
  calculateBasisOfRentSubventionPercent,
  calculateSubventionDiscountTotal,
  calculateSubventionDiscountTotalFromReLease,
  calculateTemporarySubventionDiscountPercentage,
  calculateExtraRent,
  calculateFieldsRent,
  calculateRackAndHeightPrice,
  calculateTemporaryRent,
  getBasisOfRentIndexValue,
  getBasisOfRentById,
  getZonePriceFromValue,
} from '$src/leases/helpers';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {getUserFullName} from '$src/users/helpers';
import {
  copyElementContentsToClipboard,
  displayUIMessage,
  formatDate,
  formatNumber,
  getFieldAttributes,
  getLabelOfOption,
  hasPermissions,
  isEmptyValue,
  isFieldAllowedToEdit,
  isFieldAllowedToRead,
  isFieldRequired,
} from '$util/helpers';
import {getAttributes as getLeaseAttributes, getCurrentLease} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';
import MastChildrenEdit from './MastChildrenEdit';

type ManagementSubventionsProps = {
  currentAmountPerArea: number,
  disabled: boolean,
  fields: any,
  formName: string,
  initialYearRent: number,
  leaseAttributes: Attributes,
  usersPermissions: UsersPermissionsType,
}

const renderManagementSubventions = ({
  currentAmountPerArea,
  disabled,
  fields,
  formName,
  initialYearRent,
  leaseAttributes,
  usersPermissions,
}: ManagementSubventionsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };
  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {!isFieldAllowedToEdit(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT_SUBVENTIONS) && (!fields || !fields.length) &&
              <FormText>Ei hallintamuotoja</FormText>
            }

            {fields && !!fields.length &&
              <Row>
                <Column small={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT)}>
                    <FormTextTitle
                      required={isFieldRequired(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT)}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT)}
                    >
                      {BasisOfRentManagementSubventionsFieldTitles.MANAGEMENT}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
                    <FormTextTitle
                      required={isFieldRequired(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}
                    >
                      {BasisOfRentManagementSubventionsFieldTitles.SUBVENTION_AMOUNT}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
                    <FormTextTitle
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}
                    >
                      {BasisOfRentManagementSubventionsFieldTitles.SUBVENTION_PERCENT}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}>
                    <FormTextTitle
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(BasisOfRentManagementSubventionsFieldPaths.SUBVENTION_AMOUNT)}
                    >
                      {BasisOfRentManagementSubventionsFieldTitles.SUBVENTION_AMOUNT_YEAR}
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>
            }

            {!!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: ConfirmationModalTexts.DELETE_MANAGEMENT_SUBVENTION.BUTTON,
                  confirmationModalLabel: ConfirmationModalTexts.DELETE_MANAGEMENT_SUBVENTION.LABEL,
                  confirmationModalTitle: ConfirmationModalTexts.DELETE_MANAGEMENT_SUBVENTION.TITLE,
                });
              };

              return <BasisOfRentManagementSubventionEdit
                key={index}
                currentAmountPerArea={currentAmountPerArea}
                disabled={disabled}
                field={field}
                formName={formName}
                initialYearRent={initialYearRent}
                onRemove={handleRemove}

              />;
            })}

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_MANAGEMENTSUBVENTION)}>
              {(!disabled && fields.length < 1) &&
                <Row>
                  <Column>
                    <AddButtonThird
                      label='Lisää hallintamuoto'
                      onClick={handleAdd}
                    />
                  </Column>
                </Row>
              }
            </Authorization>
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type TemporarySubventionsProps = {
  disabled: boolean,
  fields: any,
  formName: string,
  initialYearRent: number,
  leaseAttributes: Attributes,
  usersPermissions: UsersPermissionsType,
  managementSubventions: Object,
  temporarySubventions: Object,
}

const renderTemporarySubventions = ({
  disabled,
  fields,
  formName,
  initialYearRent,
  leaseAttributes,
  usersPermissions,
  managementSubventions,
  temporarySubventions,
}: TemporarySubventionsProps): Element<*> => {
  const handleAdd = () => {
    fields.push({});
  };

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <Fragment>
            {!isFieldAllowedToEdit(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.TEMPORARY_SUBVENTIONS) && (!fields || !fields.length) &&
              <FormText>Ei tilapäisalennuksia</FormText>
            }

            {fields && !!fields.length &&
              <Row>
                <Column small={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}>
                    <FormTextTitle
                      required={isFieldRequired(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(BasisOfRentTemporarySubventionsFieldPaths.DESCRIPTION)}
                    >
                      {BasisOfRentTemporarySubventionsFieldTitles.DESCRIPTION}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={4} large={4}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}>
                    <FormTextTitle
                      required={isFieldRequired(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}
                    >
                      {BasisOfRentTemporarySubventionsFieldTitles.SUBVENTION_PERCENT}
                    </FormTextTitle>
                  </Authorization>
                </Column>
                <Column small={4} large={2}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_PERCENT)}>
                    <FormTextTitle
                      required={isFieldRequired(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_AMOUNT)}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(BasisOfRentTemporarySubventionsFieldPaths.SUBVENTION_AMOUNT)}
                    >
                      {BasisOfRentTemporarySubventionsFieldTitles.SUBVENTION_AMOUNT}
                    </FormTextTitle>
                  </Authorization>
                </Column>
              </Row>
            }

            {!!fields.length && fields.map((field, index) => {
              const handleRemove = () => {
                dispatch({
                  type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                  confirmationFunction: () => {
                    fields.remove(index);
                  },
                  confirmationModalButtonClassName: ButtonColors.ALERT,
                  confirmationModalButtonText: ConfirmationModalTexts.DELETE_TEMPORARY_SUBVENTION.BUTTON,
                  confirmationModalLabel: ConfirmationModalTexts.DELETE_TEMPORARY_SUBVENTION.LABEL,
                  confirmationModalTitle: ConfirmationModalTexts.DELETE_TEMPORARY_SUBVENTION.TITLE,
                });
              };

              return <BasisOfRentTemporarySubventionEdit
                key={index}
                index={index}
                disabled={disabled}
                field={field}
                formName={formName}
                initialYearRent={initialYearRent}
                onRemove={handleRemove}
                managementSubventions={managementSubventions}
                temporarySubventions={temporarySubventions}
              />;
            })}

            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_TEMPORARYSUBVENTION)}>
              {!disabled &&
                <Row>
                  <Column>
                    <AddButtonThird
                      className='no-bottom-margin'
                      label='Lisää tilapäisalennus'
                      onClick={handleAdd}
                    />
                  </Column>
                </Row>
              }
            </Authorization>
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type renderMastChildrenProps = {
  leaseAttributes: Attributes,
  isSaveClicked: boolean,
  formName: string,
  parentField: string,
  fields: any
}

const renderMastChildren = ({
  leaseAttributes,
  isSaveClicked,
  formName,
  fields,
  parentField,
}: renderMastChildrenProps): Element<*> => {
  fields = [{}, {}];
  return (
    <AppConsumer>
      {() => {
        return(
          <Fragment>
            {!!fields.length && fields.map((field, index) => {
              return <MastChildrenEdit
                index={index}
                formName={formName}
                leaseAttributes={leaseAttributes}
                isSaveClicked={isSaveClicked}
                field={field}
                key={index}
                parentField={parentField}
              />;
            })}
          </Fragment>
        );
      }}
    </AppConsumer>
  );
};

type Props = {
  amountPerArea: ?number,
  archived: boolean,
  area: ?number,
  areaUnit: ?string,
  currentAmountPerArea: ?number,
  areaUnitOptions: Array<Object>,
  basisOfRent: Object,
  calculatorType: ?string,
  calculatorTypeOptions: Array<Object>,
  change: Function,
  children: ?Object,
  clearFields: Function,
  currentLease: Lease,
  discountPercentage: ?string,
  field: string,
  formName: string,
  id: ?number,
  index: number,
  indexOptions: Array<Object>,
  intendedUse: number,
  intendedUseOptions: Array<Object>,
  isSaveClicked: boolean,
  leaseAttributes: Attributes,
  lockedAt: ?string,
  managementSubventions: ?Array<Object>,
  managementTypeOptions: Array<Object>,
  onArchive?: Function,
  onRemove: Function,
  onUnarchive?: Function,
  plansInspectedAt: ?string,
  profitMarginPercentage: ?string,
  showLockedAt?: boolean,
  showPlansInspectedAt?: boolean,
  showTotal: boolean,
  subventionBasePercent: ?string,
  subventionGraduatedPercent: ?string,
  subventionType: ?string,
  subventionTypeOptions: Array<Object>,
  price: ?string,
  zone: ?string,
  temporarySubventions: ?Array<Object>,
  totalDiscountedInitialYearRent: number,
  usersPermissions: UsersPermissionsType,
  zoneOptions: Array<Object>,
  typeOptions: Array<Object>,
}

type State = {
  showSubventions: boolean,
}

class BasisOfRentEdit extends PureComponent<Props, State> {
  static defaultProps = {
    showLockedAt: true,
    showPlansInspectedAt: true,
  }

  state = {
    showSubventions: this.props.subventionType ? true : false,
  }

  initialFormValues = () => {
    const {basisOfRent, change, field, indexOptions, calculatorType} = this.props;
    if(calculatorType && (calculatorType === CalculatorTypes.LEASE || calculatorType === CalculatorTypes.LEASE2022)) {
      const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
      const currentAmountPerArea = getBasisOfRentAmountPerArea(basisOfRent, indexValue);
      change(this.props.formName, `${field}.current_amount_per_area`, currentAmountPerArea);
    }
    this.changeDiscounts();
  }

  componentDidMount(){
    this.initialFormValues();
  }

  componentDidUpdate(prevProps: Props) {
    const {showSubventions} = this.state;
    const {
      currentAmountPerArea,
      managementSubventions,
      subventionBasePercent,
      subventionGraduatedPercent,
      subventionType,
      temporarySubventions,
    } = this.props;

    if(showSubventions) {
      if(currentAmountPerArea !== prevProps.currentAmountPerArea && managementSubventions !== undefined) {
        this.changeDiscounts();
      }

      if(subventionType !== prevProps.subventionType ||
        subventionBasePercent !== prevProps.subventionBasePercent ||
        subventionGraduatedPercent !== prevProps.subventionGraduatedPercent ||
        managementSubventions !== prevProps.managementSubventions ||
        temporarySubventions !== prevProps.temporarySubventions) {

        // Don't change discount_percent automatically if basis of rent is deleted
        if(subventionType !== undefined ||
          subventionBasePercent !== undefined ||
          subventionGraduatedPercent !== undefined ||
          managementSubventions !== undefined ||
          temporarySubventions !== undefined) {
          this.changeDiscounts();
        }
      }
    }
  }

  changeDiscounts(){
    const {change, field, subventionType, managementSubventions} = this.props;

    if(subventionType === SubventionTypes.RE_LEASE){
      const releaseDiscountPercent = this.calculateReLeaseDiscountPercent();
      change(this.props.formName, `${field}.discount_percentage`, this.calculateTotalSubventionPercent());
      change(this.props.formName, `${field}.subvention_discount_percentage`, releaseDiscountPercent.toFixed(2));
    }
    if(subventionType === SubventionTypes.FORM_OF_MANAGEMENT){
      change(this.props.formName, `${field}.discount_percentage`, this.calculateTotalSubventionPercent());
      if(managementSubventions && managementSubventions[0]){
        change(this.props.formName, `${field}.subvention_discount_percentage`, managementSubventions[0].subvention_percent);
      }
    }
    this.calculateTotalTemporarySubventionPercent();
  }

  calculateTotalTemporarySubventionPercent = () => {
    const {change, field, temporarySubventions} = this.props;

    const temporarySubventionDiscountPercentage = calculateTemporarySubventionDiscountPercentage(temporarySubventions);

    change(this.props.formName, `${field}.temporary_subvention_discount_percentage`, formatNumber(temporarySubventionDiscountPercentage));
  };

  getAreaText = (amount: ?number) => {
    const {areaUnit, areaUnitOptions} = this.props;

    if(isEmptyValue(amount)) return '-';
    if(isEmptyValue(areaUnit)) return `${formatNumber(amount)} €`;
    return `${formatNumber(amount)} ${getLabelOfOption(areaUnitOptions, areaUnit) || ''}`;
  };

  getAmountPerAreaText = (amount: ?number) => {
    const {areaUnit, areaUnitOptions} = this.props;

    if(isEmptyValue(amount)) return '-';
    if(isEmptyValue(areaUnit)) return `${formatNumber(amount)} €`;
    return `${formatNumber(amount)} € / ${getLabelOfOption(areaUnitOptions, areaUnit) || ''}`;
  };

  getPlansInspectedText = () => {
    const {currentLease, id, plansInspectedAt} = this.props;
    const savedBasisOfRent = getBasisOfRentById(currentLease, id);

    if(!plansInspectedAt || !savedBasisOfRent || !savedBasisOfRent.plans_inspected_at) return '-';
    if(!savedBasisOfRent.plans_inspected_by) return formatDate(savedBasisOfRent.plans_inspected_at) || '-';
    return `${formatDate(savedBasisOfRent.plans_inspected_at) || ''} ${getUserFullName(savedBasisOfRent.plans_inspected_by)}`;
  };

  getLockedText = () => {
    const {currentLease, id, lockedAt} = this.props;
    const savedBasisOfRent = getBasisOfRentById(currentLease, id);

    if(!lockedAt || !savedBasisOfRent || !savedBasisOfRent.locked_at) return '-';
    if(!savedBasisOfRent.locked_by) return formatDate(savedBasisOfRent.locked_at) || '-';
    return `${formatDate(savedBasisOfRent.locked_at) || ''} ${getUserFullName(savedBasisOfRent.locked_by)}`;
  };

  handleArchive = () => {
    const {currentLease, id, onArchive} = this.props;
    const savedBasisOfRent = getBasisOfRentById(currentLease, id);

    if(onArchive) {
      onArchive(savedBasisOfRent);
    }
  };

  handleCopyToClipboard = () => {
    const tableContent = this.getTableContentForClipBoard(),
      el = document.createElement('table');

    el.className = 'sortable-table__clipboard-table';
    el.innerHTML = tableContent;
    if(copyElementContentsToClipboard(el)) {
      displayUIMessage({title: '', body: 'Vuokralaskuri on kopioitu leikepöydälle.'});
    }
  };

  handleUnarchive = () => {
    const {currentLease, id, onUnarchive} = this.props;
    const savedBasisOfRent = getBasisOfRentById(currentLease, id);

    if(onUnarchive) {
      onUnarchive(savedBasisOfRent);
    }
  };

  getTableContentForClipBoard = () => {
    const {
      amountPerArea,
      area,
      basisOfRent,
      discountPercentage,
      index,
      indexOptions,
      intendedUse,
      intendedUseOptions,
      leaseAttributes,
      profitMarginPercentage,
    } = this.props;

    const areaText = this.getAreaText(area);
    const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
    const currentAmountPerArea = getBasisOfRentAmountPerArea(basisOfRent, indexValue);
    const currentAmountPerAreaText = this.getAmountPerAreaText(currentAmountPerArea);
    const amountPerAreaText = this.getAmountPerAreaText(amountPerArea);
    const basicAnnualRent = calculateBasisOfRentBasicAnnualRent(basisOfRent, indexValue);
    const initialYearRent = calculateBasisOfRentInitialYearRent(basisOfRent, indexValue, basicAnnualRent);
    const discountedInitialYearRent = calculateBasisOfRentDiscountedInitialYearRent(basisOfRent, indexValue);
    const rentPerMonth = discountedInitialYearRent != null ? discountedInitialYearRent/12 : null;
    const rentPer2Months = discountedInitialYearRent != null ? discountedInitialYearRent/6 : null;

    return(
      `<thead>
        <tr>
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INTENDED_USE)
        ? `<th>${LeaseBasisOfRentsFieldTitles.INTENDED_USE}</th>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)
        ? `<th>${LeaseBasisOfRentsFieldTitles.AREA}</th>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
        ? `<th>${LeaseBasisOfRentsFieldTitles.AMOUNT_PER_AREA}</th>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)
        ? `<th>${LeaseBasisOfRentsFieldTitles.INDEX}</th>`
        : ''
      }
          ${(isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX))
        ? `<th>${LeaseBasisOfRentsFieldTitles.UNIT_PRICE}</th>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE)
        ? `<th>${LeaseBasisOfRentsFieldTitles.PROFIT_MARGIN_PERCENTAGE}</th>`
        : ''
      }
          ${(isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA))
        ? `<th>${LeaseBasisOfRentsFieldTitles.BASE_YEAR_RENT}</th>`
        : ''
      }
          ${(isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE))
        ? `<th>${LeaseBasisOfRentsFieldTitles.INITIAL_YEAR_RENT}</th>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
        ? `<th>${LeaseBasisOfRentsFieldTitles.DISCOUNT_PERCENTAGE}</th>`
        : ''
      }
          ${(isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE))
        ? `<th>${LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT}</th>`
        : ''
      }
          ${(isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE))
        ? `<th>${LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH}</th>`
        : ''
      }
          ${(isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE))
        ? `<th>${LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS}</th>`
        : ''
      }
        </tr>
      </thead>
      <tbody>
        <tr>
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INTENDED_USE)
        ? `<td>${getLabelOfOption(intendedUseOptions, intendedUse) || '-'}</td>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)
        ? `<td>${areaText}</td>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
        ? `<td>${amountPerAreaText}</td>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)
        ? `<td>${getLabelOfOption(indexOptions, index) || '-'}</td>`
        : ''
      }
          ${(isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX))
        ? `<td>${currentAmountPerAreaText}</td>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE)
        ? `<td>${!isEmptyValue(profitMarginPercentage) ? `${formatNumber(profitMarginPercentage)} %` : '-'}</td>`
        : ''
      }
          ${(isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA))
        ? `<td>${!isEmptyValue(basicAnnualRent) ? `${formatNumber(basicAnnualRent)} €/v` : '-'}</td>`
        : ''
      }
          ${(isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE))
        ? `<td>${!isEmptyValue(initialYearRent) ? `${formatNumber(initialYearRent)} €/v` : '-'}</td>`
        : ''
      }
          ${isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
        ? `<td>${!isEmptyValue(discountPercentage) ? `${formatNumber(discountPercentage)} %` : '-'}</td>`
        : ''
      }
          ${(isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE))
        ? `<td>${!isEmptyValue(discountedInitialYearRent) ? `${formatNumber(discountedInitialYearRent)} €/v` : '-'}</td>`
        : ''
      }
          ${(isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE))
        ? `<td>${!isEmptyValue(rentPerMonth) ? `${formatNumber(rentPerMonth)} €/kk` : '-'}</td>`
        : ''
      }
          ${(isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE))
        ? `<td>${!isEmptyValue(rentPer2Months) ? `${formatNumber(rentPer2Months)} €/2kk` : '-'}</td>`
        : ''
      }
        </tr>
      </tbody>`
    );
  };

  handleAddSubventions = () => {
    this.setState({showSubventions: true});
  }

  handleRemoveSubventions = () => {
    const {change, field, formName} = this.props;

    change(formName, `${field}.subvention_type`, null);
    this.setState({showSubventions: false});
  }

  calculateReLeaseDiscountPercent = () => {
    const {subventionBasePercent, subventionGraduatedPercent} = this.props;

    return calculateReLeaseDiscountPercent(subventionBasePercent, subventionGraduatedPercent);
  }

  calculateTotalSubventionPercent = () => {
    const {basisOfRent, indexOptions, subventionType, subventionBasePercent, subventionGraduatedPercent, managementSubventions, temporarySubventions} = this.props;
    const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
    const currentAmountPerArea = getBasisOfRentAmountPerArea(basisOfRent, indexValue);
    return calculateBasisOfRentSubventionPercent(
      currentAmountPerArea,
      subventionType,
      subventionBasePercent,
      subventionGraduatedPercent,
      managementSubventions,
      temporarySubventions);
  }

  clearAllFields = () => {
    const {clearFields, field} = this.props;
    return clearFields(
      this.props.formName,
      false,
      false,
      `${field}.amount_per_area`, // Same field for both "price" and "amountPerArea"
      `${field}.area`,
      `${field}.area_unit`,
      `${field}.base_year_rent`,
      `${field}.current_amount_per_area`,
      `${field}.discount_percentage`,
      `${field}.discounted_intial_year_rent`,
      `${field}.discounted_intial_year_rent_per_month`,
      `${field}.discounted_intial_year_rent_per_month_total`,
      `${field}.discounted_intial_year_rent_per_2_months`,
      `${field}.discounted_intial_year_rent_per_2_months_total`,
      `${field}.index`,
      `${field}.intial_year_rent`,
      `${field}.intended_use`,
      `${field}.profit_margin_percentage`,
      `${field}.subvention_base_percent`,
      `${field}.subvention_discount_percentage`,
      `${field}.subvention_graduated_percent`,
      `${field}.subvention_re_lease_discount_amount`,
      `${field}.subvention_re_lease_discount_precent`,
      `${field}.temporary_subvention_discount_percentage`,
      `${field}.unit_price`,
      `${field}.zone`,
    );
  }

  // Reset all fields when calculator type changes
  onChangeTypeOptions = (value: any) => {
    const {calculatorType} = this.props;
    if(value !== calculatorType) {
      this.clearAllFields();
      this.handleRemoveSubventions();
      this.initialFormValues();
    }
  }

  // LEASE: Yksikköhinta(ind 100)
  onChangeAmountPerArea = (value: any) => {
    const {basisOfRent, change, field, indexOptions} = this.props;
    const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
    const currentAmountPerArea = getBasisOfRentAmountPerArea({amount_per_area: value}, indexValue);
    change(this.props.formName, `${field}.current_amount_per_area`, currentAmountPerArea);
  }

  // LEASE & LEASE2022: Yksikköhinta (ind)
  onChangeCurrentAmountPerArea = (value: any) => {
    const {basisOfRent, change, field, indexOptions, calculatorType} = this.props;
    if (calculatorType === CalculatorTypes.LEASE2022) {
      change(this.props.formName, `${field}.amount_per_area`, value);
    } else {
      const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
      const amountPerArea = calculateAmountFromValue(value, indexValue);
      change(this.props.formName, `${field}.amount_per_area`, amountPerArea);
    }
  }

  // LEASE & LEASE2022: Indeksi
  onChangeIndexOptions = (value: any) => {
    const {basisOfRent, change, field, indexOptions, calculatorType} = this.props;
    if (calculatorType === CalculatorTypes.LEASE) {
      const indexValue = getBasisOfRentIndexValue({index: value}, indexOptions);
      const currentAmountPerArea = getBasisOfRentAmountPerArea(basisOfRent, indexValue);
      change(this.props.formName, `${field}.current_amount_per_area`, currentAmountPerArea);
    }
  }

  getSubventionDiscountedInitial = () => {
    const {subventionType, managementSubventions, basisOfRent, indexOptions} = this.props;
    const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
    const releaseDiscountPercent = this.calculateReLeaseDiscountPercent();
    const basicAnnualRent = calculateBasisOfRentBasicAnnualRent(basisOfRent, indexValue);
    const initialYearRent = calculateBasisOfRentInitialYearRent(basisOfRent, indexValue, basicAnnualRent);
    const currentAmountPerArea = getBasisOfRentAmountPerArea(basisOfRent, indexValue);
    if(subventionType === SubventionTypes.RE_LEASE)
      return calculateSubventionDiscountTotalFromReLease(initialYearRent, releaseDiscountPercent);
    if(subventionType === SubventionTypes.FORM_OF_MANAGEMENT)
      return calculateSubventionDiscountTotal(initialYearRent, managementSubventions, currentAmountPerArea);
    return 0;
  }

  render() {
    const {
      amountPerArea,
      archived,
      area,
      areaUnitOptions,
      basisOfRent,
      currentLease,
      children,
      field,
      formName,
      id,
      indexOptions,
      intendedUseOptions,
      isSaveClicked,
      leaseAttributes,
      managementTypeOptions,
      onArchive,
      onRemove,
      showLockedAt,
      showPlansInspectedAt,
      showTotal,
      subventionType,
      subventionTypeOptions,
      price,
      totalDiscountedInitialYearRent,
      usersPermissions,
      managementSubventions,
      temporarySubventions,
      typeOptions,
      calculatorTypeOptions,
      calculatorType,
      zone,
    } = this.props;
    const {showSubventions} = this.state;

    const savedBasisOfRent = getBasisOfRentById(currentLease, id);

    // Used by all CalculatorTypes
    const indexValue = getBasisOfRentIndexValue(basisOfRent, indexOptions);
    const basicAnnualRent = calculateBasisOfRentBasicAnnualRent(basisOfRent, indexValue);
    const areaText = this.getAreaText(area);

    // Used by CalculatorTypes.LEASE
    const amountPerAreaText = this.getAmountPerAreaText(amountPerArea);
    const currentAmountPerArea = getBasisOfRentAmountPerArea(basisOfRent, indexValue);

    // Used by CalculatorTypes.LEASE and CalculatorTypes.LEASE2022
    const lockedAtText = this.getLockedText();
    const plansInspectedAtText = this.getPlansInspectedText();
    const initialYearRent = calculateBasisOfRentInitialYearRent(basisOfRent, indexValue, basicAnnualRent);
    const releaseDiscountPercent = this.calculateReLeaseDiscountPercent();
    const releaseDiscountAmount = calculateBasisOfRentSubventionAmount(initialYearRent, releaseDiscountPercent.toString());
    const totalSubventionPercent = this.calculateTotalSubventionPercent();
    const totalSubventionAmount = calculateBasisOfRentSubventionAmount(initialYearRent, totalSubventionPercent.toString());
    const subventionDiscountedInitial = this.getSubventionDiscountedInitial();
    const discountedInitialYearRent = calculateBasisOfRentDiscountedInitialYearRent(basisOfRent, indexValue);
    const rentPerMonth = discountedInitialYearRent != null ? discountedInitialYearRent / 12 : null;
    const rentPer2Months = discountedInitialYearRent != null ? discountedInitialYearRent / 6 : null;
    const rentPerMonthTotal = totalDiscountedInitialYearRent / 12;
    const rentPer2MonthsTotal = totalDiscountedInitialYearRent / 6;

    // Used by CalculatorTypes.TEMPORARY
    const zonePrice = getZonePriceFromValue(zone);
    const temporaryRent = calculateTemporaryRent(zonePrice, area);
    const temporaryRentIndexed = calculateBasicAnnualRentIndexed(temporaryRent * 12, indexValue);

    // Used by CalculatorTypes.ADDITIONAL_YARD
    const rentExtra = calculateExtraRent(price, area);
    const rentExtraIndexed = calculateBasicAnnualRentIndexed(rentExtra, indexValue);

    // Used by CalculatorTypes.FIELD
    const fieldsRent = calculateFieldsRent(price, area);
    const basicAnnualFieldRentIndexed = calculateBasicAnnualRentIndexed(fieldsRent, indexValue);

    // Used by CalculatorTypes.MAST
    const mastAreaRent = 1.5 * calculateFieldsRent(price, area);
    const rackAndHeightPrice = calculateRackAndHeightPrice(children);
    const mastTotal = (mastAreaRent + rackAndHeightPrice) * 0.05;
    const mastTotalIndexed = calculateBasicAnnualRentIndexed(mastTotal, indexValue);

    // Yksikköhinta (ind)
    // text input
    const renderUnitPriceFormField = (showLabel: boolean) => (
      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)}>
        {showLabel && (
          <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.UNIT_PRICE)}>
            {LeaseBasisOfRentsFieldTitles.UNIT_PRICE}
          </FormTextTitle>
        )}
        <FormField
          disableTouched={isSaveClicked}
          onChange={this.onChangeCurrentAmountPerArea}
          fieldAttributes={{
            decimal_places: 2,
            label: 'Yksikköhinta',
            max_digits: 10,
            read_only: false,
            required: false,
            type: 'decimal',
          }}
          disabled={!!savedBasisOfRent && !!savedBasisOfRent.locked_at}
          name={`${field}.current_amount_per_area`}
          unit='€'
          invisibleLabel
          overrideValues={{label: LeaseBasisOfRentsFieldTitles.AMOUNT_PER_AREA}}
        />
      </Authorization>
    );

    // Tuottoprosentti
    // text input
    const renderProfitMarginPercentageFormField = () => (
      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE)}>
        <FormField
          disableTouched={isSaveClicked}
          fieldAttributes={savedBasisOfRent && !!savedBasisOfRent.locked_at
            ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE), required: false}
            : getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE)
          }
          disabled={!!savedBasisOfRent && !!savedBasisOfRent.locked_at}
          name={`${field}.profit_margin_percentage`}
          unit='%'
          overrideValues={{label: LeaseBasisOfRentsFieldTitles.PROFIT_MARGIN_PERCENTAGE}}
          enableUiDataEdit
          tooltipStyle={{right: 17}}
          uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE)}
        />
      </Authorization>
    );

    // Alkuvuosivuokra (ind)
    // Read only text
    const renderInitialYearRentFormField = () => (
      <Authorization allow={
        isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
        isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
        isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
        isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE)
      }>
        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.INITIAL_YEAR_RENT)}>
          {LeaseBasisOfRentsFieldTitles.INITIAL_YEAR_RENT}
        </FormTextTitle>
        <FormText>{!isEmptyValue(initialYearRent) ? `${formatNumber(initialYearRent)} €/v` : '-'}</FormText>
      </Authorization>
    );

    // Indeksi
    // Dropdown
    const renderIndexFormField = () => (
      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)}>
        <FormField
          disableTouched={isSaveClicked}
          fieldAttributes={{...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX), required: false}}
          onChange={this.onChangeIndexOptions}
          disabled={!!savedBasisOfRent && !!savedBasisOfRent.locked_at}
          name={`${field}.index`}
          overrideValues={{
            label: LeaseBasisOfRentsFieldTitles.INDEX,
            options: indexOptions,
          }}
          enableUiDataEdit
          uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.INDEX)}
        />
      </Authorization>
    );

    // Perusvuosivuokra (ind 100)
    // Read only
    const renderBaseYearRentFormField = () => (
      <Authorization allow={
        isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
        isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
      }>
        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.BASE_YEAR_RENT)}>
          {LeaseBasisOfRentsFieldTitles.BASE_YEAR_RENT}
        </FormTextTitle>
        <FormText>{!isEmptyValue(basicAnnualRent) ? `${formatNumber(basicAnnualRent)} €/v` : '-'}</FormText>
      </Authorization>
    );

    if(archived && savedBasisOfRent) {
      return <BasisOfRent
        areaUnitOptions={areaUnitOptions}
        basisOfRent={basisOfRent}
        indexOptions={indexOptions}
        intendedUseOptions={intendedUseOptions}
        managementTypeOptions={managementTypeOptions}
        calculatorTypeOptions={calculatorTypeOptions}
        onRemove={onRemove}
        onUnarchive={this.handleUnarchive}
        showTotal={showTotal}
        subventionTypeOptions={subventionTypeOptions}
        totalDiscountedInitialYearRent={totalDiscountedInitialYearRent}
        typeOptions={typeOptions}
      />;
    }

    return(
      <BoxItem className='no-border-on-first-child'>
        <BoxContentWrapper>
          <ActionButtonWrapper>
            <CopyToClipboardButton onClick={this.handleCopyToClipboard} />
            <Authorization allow={isFieldAllowedToEdit(leaseAttributes, LeaseBasisOfRentsFieldPaths.ARCHIVED_AT)}>
              {onArchive && savedBasisOfRent && !savedBasisOfRent.locked_at &&
                <ArchiveButton onClick={this.handleArchive}/>
              }
            </Authorization>
            {(!savedBasisOfRent || !savedBasisOfRent.locked_at) &&
              <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_LEASEBASISOFRENT)}>
                <RemoveButton
                  onClick={onRemove}
                  title='Poista vuokralaskuri'
                />
              </Authorization>
            }
          </ActionButtonWrapper>
          <Row>
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.TYPE)}>
              <Column small={6} medium={4} large={2}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.TYPE)}
                  onChange={this.onChangeTypeOptions}
                  name={`${field}.type`}
                  overrideValues={{
                    label: 'Laskurin tyyppi',
                  }}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.TYPE)}
                />
              </Column>
            </Authorization>
            {(calculatorType === CalculatorTypes.LEASE || calculatorType === CalculatorTypes.LEASE2022) && <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INTENDED_USE)}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={savedBasisOfRent && !!savedBasisOfRent.locked_at
                    ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.INTENDED_USE), required: false}
                    : getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.INTENDED_USE)
                  }
                  disabled={!!savedBasisOfRent && !!savedBasisOfRent.locked_at}
                  name={`${field}.intended_use`}
                  overrideValues={{label: LeaseBasisOfRentsFieldTitles.INTENDED_USE}}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.INTENDED_USE)}
                />
              </Authorization>
            </Column>}
            {(calculatorType === CalculatorTypes.LEASE || calculatorType === CalculatorTypes.LEASE2022) && <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToEdit(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) || isFieldAllowedToEdit(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT)}
                errorComponent={
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}>
                    <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.AREA)}>{LeaseBasisOfRentsFieldTitles.AREA}</FormTextTitle>
                    <FormText>{areaText}</FormText>
                  </Authorization>
                }
              >
                <FormTextTitle
                  required={isFieldRequired(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.AREA)}
                >
                  {LeaseBasisOfRentsFieldTitles.AREA}
                </FormTextTitle>
                <Row>
                  <Column small={6}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={savedBasisOfRent && !!savedBasisOfRent.locked_at
                          ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA), required: false}
                          : getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)
                        }
                        disabled={!!savedBasisOfRent && !!savedBasisOfRent.locked_at}
                        name={`${field}.area`}
                        invisibleLabel
                        overrideValues={{label: LeaseBasisOfRentsFieldTitles.AREA}}
                      />
                    </Authorization>
                  </Column>
                  <Column small={6}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT)}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={savedBasisOfRent && !!savedBasisOfRent.locked_at
                          ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT), required: false}
                          : getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT)
                        }
                        disabled={!!savedBasisOfRent && !!savedBasisOfRent.locked_at}
                        name={`${field}.area_unit`}
                        invisibleLabel
                        overrideValues={{
                          label: LeaseBasisOfRentsFieldTitles.AREA_UNIT,
                          options: areaUnitOptions,
                        }}
                      />
                    </Authorization>
                  </Column>
                </Row>
              </Authorization>
            </Column>}
            {!!calculatorType && (calculatorType !== CalculatorTypes.LEASE && calculatorType !== CalculatorTypes.LEASE2022) && <Column>
              <Row>
                <Authorization
                  allow={isFieldAllowedToEdit(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) || isFieldAllowedToEdit(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT)}
                  errorComponent={
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}>
                      <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.AREA)}>{LeaseBasisOfRentsFieldTitles.AREA}</FormTextTitle>
                      <FormText>{areaText}</FormText>
                    </Authorization>
                  }
                >
                  {calculatorType === CalculatorTypes.TEMPORARY && <Column small={6} medium={4} large={2}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.ZONE)}
                        name={`${field}.zone`}
                        overrideValues={{
                          label: LeaseBasisOfRentsFieldTitles.ZONE,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.ZONE)}
                      />
                    </Authorization>
                  </Column>}
                  {(calculatorType === CalculatorTypes.ADDITIONAL_YARD || calculatorType === CalculatorTypes.FIELD) && <Column small={4} medium={2} large={1}>
                    <FormTextTitle
                      required={isFieldRequired(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.AREA)}
                    >
                      {LeaseBasisOfRentsFieldTitles.PRICE}
                    </FormTextTitle>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={savedBasisOfRent && !!savedBasisOfRent.locked_at
                          ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA), required: false}
                          : getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)
                        }
                        name={`${field}.amount_per_area`}
                        invisibleLabel
                        unit='€'
                        overrideValues={{label: LeaseBasisOfRentsFieldTitles.PRICE}}
                      />
                    </Authorization>
                  </Column>}
                  {calculatorType === CalculatorTypes.ADDITIONAL_YARD && <Column small={4} medium={2} large={1}>
                    <FormTextTitle>
                      {'Kerroin'}
                    </FormTextTitle>
                    <FormText>{'* 1,5'}</FormText>
                  </Column>}
                  {calculatorType === CalculatorTypes.TEMPORARY && <Column small={4} medium={2} large={1}>
                    <Authorization allow={
                      isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
                      isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
                    }>
                      <FormTextTitle>
                        {'Hinta'}
                      </FormTextTitle>
                      <FormText>{!isEmptyValue(zonePrice) ? `${formatNumber(zonePrice)} €` : '-'}</FormText>
                    </Authorization>
                  </Column>}
                  {calculatorType === CalculatorTypes.MAST &&
                    <Column large={6} medium={9} small={12}>
                      <Row>
                        <Column small={6} medium={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                            <FormTextTitle>{'Laskuri'}</FormTextTitle>
                            <FormText>{`Alue`}</FormText>
                          </Authorization>
                        </Column>
                        <Column small={6} medium={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                            {<FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}
                              name={`${field}.amount_per_area`}
                              unit='€'
                              overrideValues={{label: 'Hinta'}}
                            />}
                          </Authorization>
                        </Column>
                        <Column small={6} medium={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                            <FormTextTitle>{'Kerroin'}</FormTextTitle>
                            <FormText>{`*1,5`}</FormText>
                          </Authorization>
                        </Column>
                        <Column small={6} medium={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}
                              name={`${field}.area`}
                              overrideValues={{label: 'Ala/korkeus'}}
                            />
                          </Authorization>
                        </Column>
                        <Column small={6} medium={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                            <FormTextTitle>{'Yksikkö'}</FormTextTitle>
                            <FormText>{`m${String.fromCharCode(178)}`}</FormText>
                          </Authorization>
                        </Column>
                        <Column small={6} medium={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) && isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                            <FormTextTitle>{'Vuokra'}</FormTextTitle>
                            <FormText>{!isEmptyValue(mastAreaRent) ? `${formatNumber(mastAreaRent)} €` : '-'}</FormText>
                          </Authorization>
                        </Column>
                      </Row>
                    </Column>}
                  {calculatorType === CalculatorTypes.MAST && <Column large={6} medium={9} small={12}></Column>}
                  {calculatorType === CalculatorTypes.MAST &&
                    <AppConsumer>
                      {() => {
                        return <Column large={6} medium={9} small={12}>
                          <FieldArray
                            component={renderMastChildren}
                            leaseAttributes={leaseAttributes}
                            name={`${field}.children`}
                            formName={formName}
                            parentField={field}
                          />
                        </Column>;
                      }}
                    </AppConsumer>
                  }
                  {calculatorType !== CalculatorTypes.MAST && <Column small={6} medium={4} large={2}>
                    <FormTextTitle
                      required={isFieldRequired(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}
                      enableUiDataEdit
                      uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.AREA)}
                    >
                      {LeaseBasisOfRentsFieldTitles.AREA}
                    </FormTextTitle>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={savedBasisOfRent && !!savedBasisOfRent.locked_at
                          ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA), required: false}
                          : getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)
                        }
                        disabled={!!savedBasisOfRent && !!savedBasisOfRent.locked_at}
                        name={`${field}.area`}
                        invisibleLabel
                        unit={calculatorType === CalculatorTypes.FIELD ? 'ha' : `m${String.fromCharCode(178)}`}
                        overrideValues={{label: LeaseBasisOfRentsFieldTitles.AREA}}
                      />
                    </Authorization>
                  </Column>}
                  {calculatorType === CalculatorTypes.ADDITIONAL_YARD && <Column small={3} medium={2} large={1} style={{marginTop: 15}}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA)}>
                      <FormText>{'*5%'}</FormText>
                    </Authorization>
                  </Column>}
                  {calculatorType !== CalculatorTypes.MAST && <Column small={3} medium={2} large={1}>
                    <Authorization allow={
                      isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
                      isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
                    }>
                      {calculatorType !== CalculatorTypes.TEMPORARY &&
                        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.BASE_YEAR_RENT)}>
                          {LeaseBasisOfRentsFieldTitles.RENT}
                        </FormTextTitle>}
                      {calculatorType === CalculatorTypes.TEMPORARY &&
                        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.BASE_YEAR_RENT)}>
                          {'Vuokra/kk'}
                        </FormTextTitle>}
                      {calculatorType === CalculatorTypes.TEMPORARY && <FormText>{!isEmptyValue(temporaryRent) ? `${formatNumber(temporaryRent)} €` : '-'}</FormText>}
                      {calculatorType === CalculatorTypes.ADDITIONAL_YARD && <FormText>{!isEmptyValue(rentExtra) ? `${formatNumber(rentExtra)} €` : '-'}</FormText>}
                      {calculatorType === CalculatorTypes.FIELD && <FormText>{!isEmptyValue(fieldsRent) ? `${formatNumber(fieldsRent)} €` : '-'}</FormText>}
                    </Authorization>
                  </Column>}
                  {calculatorType === CalculatorTypes.TEMPORARY && <Column small={3} medium={2} large={1}>
                    <Authorization allow={
                      isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
                      isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
                    }>
                      {calculatorType === CalculatorTypes.TEMPORARY &&
                        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.BASE_YEAR_RENT)}>
                          {'Vuokra/vuosi'}
                        </FormTextTitle>}
                      <FormText>{!isEmptyValue(temporaryRent) ? `${formatNumber(temporaryRent * 12)} €` : '-'}</FormText>
                    </Authorization>
                  </Column>}
                  {calculatorType !== CalculatorTypes.MAST && <Column small={6} medium={4} large={2}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={savedBasisOfRent && !!savedBasisOfRent.locked_at
                          ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX), required: false}
                          : getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)
                        }
                        disabled={!!savedBasisOfRent && !!savedBasisOfRent.locked_at}
                        name={`${field}.index`}
                        overrideValues={{
                          label: LeaseBasisOfRentsFieldTitles.INDEX,
                          options: indexOptions,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.INDEX)}
                      />
                    </Authorization>
                  </Column>}
                  {calculatorType !== CalculatorTypes.MAST && <Column small={6} medium={4} large={2}>
                    <Authorization allow={
                      isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
                      isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
                    }>
                      <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.BASE_YEAR_RENT)}>
                        {LeaseBasisOfRentsFieldTitles.BASE_YEAR_RENT}
                      </FormTextTitle>
                      {calculatorType === CalculatorTypes.TEMPORARY && <FormText>{!isEmptyValue(temporaryRentIndexed) ? `${formatNumber(temporaryRentIndexed)} €/v` : '-'}</FormText>}
                      {calculatorType === CalculatorTypes.ADDITIONAL_YARD && <FormText>{!isEmptyValue(rentExtraIndexed) ? `${formatNumber(rentExtraIndexed)} €/v` : '-'}</FormText>}
                      {calculatorType === CalculatorTypes.FIELD && <FormText>{!isEmptyValue(basicAnnualFieldRentIndexed) ? `${formatNumber(basicAnnualFieldRentIndexed)} €/v` : '-'}</FormText>}
                    </Authorization>
                  </Column>}
                </Authorization>
              </Row>
            </Column>}

            {showPlansInspectedAt && (calculatorType === CalculatorTypes.LEASE || calculatorType === CalculatorTypes.LEASE2022) &&
              <Column small={6} medium={4} large={2}>
                <Authorization
                  allow={isFieldAllowedToEdit(leaseAttributes, LeaseBasisOfRentsFieldPaths.PLANS_INSPECTED_AT)}
                  errorComponent={
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PLANS_INSPECTED_AT)}>
                      <FormTextTitle>{LeaseBasisOfRentsFieldTitles.PLANS_INSPECTED_AT}</FormTextTitle>
                      <FormText>{plansInspectedAtText}</FormText>
                    </Authorization>
                  }
                >
                  <FormField
                    className='with-top-padding'
                    disableTouched={isSaveClicked}
                    fieldAttributes={savedBasisOfRent && !!savedBasisOfRent.locked_at
                      ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.PLANS_INSPECTED_AT), required: false, type: 'checkbox-date-time'}
                      : {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.PLANS_INSPECTED_AT), type: 'checkbox-date-time'}
                    }
                    disabled={!!savedBasisOfRent && !!savedBasisOfRent.locked_at}
                    invisibleLabel
                    name={`${field}.plans_inspected_at`}
                    overrideValues={{label: LeaseBasisOfRentsFieldTitles.PLANS_INSPECTED_AT}}
                  />
                </Authorization>
              </Column>
            }

            {showLockedAt && (calculatorType === CalculatorTypes.LEASE || calculatorType === CalculatorTypes.LEASE2022) &&
              <Column small={6} medium={4} large={2}>
                <Authorization
                  allow={isFieldAllowedToEdit(leaseAttributes, LeaseBasisOfRentsFieldPaths.LOCKED_AT)}
                  errorComponent={
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.LOCKED_AT)}>
                      <FormTextTitle>{LeaseBasisOfRentsFieldTitles.LOCKED_AT}</FormTextTitle>
                      <FormText>{lockedAtText}</FormText>
                    </Authorization>
                  }
                >
                  <FormField
                    className='with-top-padding'
                    disableTouched={isSaveClicked}
                    fieldAttributes={{
                      ...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.LOCKED_AT),
                      type: 'checkbox-date-time',
                    }}
                    invisibleLabel
                    name={`${field}.locked_at`}
                    overrideValues={{label: LeaseBasisOfRentsFieldTitles.LOCKED_AT}}
                  />
                </Authorization>
              </Column>
            }
          </Row>

          {calculatorType === CalculatorTypes.LEASE && <Row>
            <Column small={6} medium={4} large={2}>
              <Authorization
                allow={isFieldAllowedToEdit(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}
                errorComponent={
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                    <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                      {LeaseBasisOfRentsFieldTitles.AMOUNT_PER_AREA}
                    </FormTextTitle>
                    <FormText>{amountPerAreaText}</FormText>
                  </Authorization>
                }
              >
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                  <FormTextTitle
                    required={isFieldRequired(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}
                  >
                    {LeaseBasisOfRentsFieldTitles.AMOUNT_PER_AREA}
                  </FormTextTitle>
                </Authorization>
                <Row>
                  <Column small={6}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                      <FormField
                        onChange={this.onChangeAmountPerArea}
                        disableTouched={isSaveClicked}
                        fieldAttributes={savedBasisOfRent && !!savedBasisOfRent.locked_at
                          ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA), required: false}
                          : getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
                        }
                        disabled={!!savedBasisOfRent && !!savedBasisOfRent.locked_at}
                        name={`${field}.amount_per_area`}
                        unit='€'
                        invisibleLabel
                        overrideValues={{label: LeaseBasisOfRentsFieldTitles.AMOUNT_PER_AREA}}
                      />
                    </Authorization>
                  </Column>
                  <Column small={6}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT)}>
                      <FormField
                        className='with-slash'
                        disableTouched={isSaveClicked}
                        fieldAttributes={savedBasisOfRent && !!savedBasisOfRent.locked_at
                          ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT), required: false}
                          : getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT)
                        }
                        name={`${field}.area_unit`}
                        disabled
                        invisibleLabel
                        overrideValues={{
                          label: LeaseBasisOfRentsFieldTitles.AREA_UNIT,
                          options: areaUnitOptions,
                        }}
                      />
                    </Authorization>
                  </Column>
                </Row>
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>{renderIndexFormField()}</Column>
            <Column small={6} medium={4} large={2}>{renderUnitPriceFormField(true)}</Column>
            <Column small={6} medium={4} large={2}>{renderProfitMarginPercentageFormField()}</Column>
            <Column small={6} medium={4} large={2}>{renderBaseYearRentFormField()}</Column>
            <Column small={6} medium={4} large={2}>{renderInitialYearRentFormField()}
            </Column>
          </Row>}

          {calculatorType === CalculatorTypes.LEASE2022 && <Row>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)}>
                <FormTextTitle
                  required={isFieldRequired(leaseAttributes, LeaseBasisOfRentsFieldPaths.UNIT_PRICE)}
                  enableUiDataEdit
                  uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.UNIT_PRICE)}
                >
                  {LeaseBasisOfRentsFieldTitles.UNIT_PRICE}
                </FormTextTitle>
              </Authorization>
              <Row>
                <Column small={6}>
                  {renderUnitPriceFormField(false)}
                </Column>
                <Column small={6}>
                  <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT)}>
                    <FormField
                      className='with-slash'
                      disableTouched={isSaveClicked}
                      fieldAttributes={savedBasisOfRent && !!savedBasisOfRent.locked_at
                        ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT), required: false}
                        : getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA_UNIT)
                      }
                      name={`${field}.area_unit`}
                      disabled
                      invisibleLabel
                      overrideValues={{
                        label: LeaseBasisOfRentsFieldTitles.AREA_UNIT,
                        options: areaUnitOptions,
                      }}
                    />
                  </Authorization>
                </Column>
              </Row>
            </Column>
            <Column small={6} medium={4} large={2}>{renderProfitMarginPercentageFormField()}</Column>
            <Column small={6} medium={4} large={2}>{renderInitialYearRentFormField()}</Column>
            <Column small={6} medium={4} large={2}>{renderIndexFormField()}</Column>
            <Column small={6} medium={4} large={2}>{renderBaseYearRentFormField()}</Column>
          </Row>}

          {((subventionType === SubventionTypes.FORM_OF_MANAGEMENT || subventionType === SubventionTypes.RE_LEASE) && showSubventions && (calculatorType === CalculatorTypes.LEASE || calculatorType === CalculatorTypes.LEASE2022)) && <Row>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={savedBasisOfRent && !!savedBasisOfRent.locked_at
                    ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE), required: false}
                    : getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
                  }
                  disabled={(savedBasisOfRent && !!savedBasisOfRent.locked_at) || showSubventions}
                  name={`${field}.subvention_discount_percentage`}
                  unit='%'
                  overrideValues={{label: 'Subventioprosentti'}}
                  enableUiDataEdit
                  tooltipStyle={{right: 17}}
                />
              </Authorization>
            </Column>
            <Column small={5} medium={4} large={3}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)}>
                <FormTextTitle>
                  {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL}
                </FormTextTitle>
                <FormText>{!isEmptyValue(subventionDiscountedInitial) ? `${formatNumber(subventionDiscountedInitial)} €/v` : '-'}</FormText>
              </Authorization>
            </Column>
            <Column small={0} medium={3} large={6}></Column>
          </Row>}

          {showSubventions && (calculatorType === CalculatorTypes.LEASE || calculatorType === CalculatorTypes.LEASE2022) && <Row>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={savedBasisOfRent && !!savedBasisOfRent.locked_at
                    ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE), required: false}
                    : getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
                  }
                  disabled={(savedBasisOfRent && !!savedBasisOfRent.locked_at) || showSubventions}
                  name={`${field}.temporary_subvention_discount_percentage`}
                  unit='%'
                  overrideValues={{label: 'Tilapäisalennuksen prosentti'}}
                  enableUiDataEdit
                  tooltipStyle={{right: 17}}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={8} large={10}></Column>
          </Row>}

          {(calculatorType === CalculatorTypes.LEASE || calculatorType === CalculatorTypes.LEASE2022) && <Row>
            <Column small={6} medium={4} large={2} hidden>
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)}>
                <FormField
                  disableTouched={isSaveClicked}
                  fieldAttributes={{
                    label: 'Lopullinen alennusprosentti',
                    read_only: true,
                    required: false,
                    type: 'string',
                  }}
                  disabled={(savedBasisOfRent && !!savedBasisOfRent.locked_at) || showSubventions}
                  name={`${field}.discount_percentage`}
                  overrideValues={{label: LeaseBasisOfRentsFieldTitles.DISCOUNT_PERCENTAGE}}
                  enableUiDataEdit
                  tooltipStyle={{right: 17}}
                  uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)}
                />
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={3}>
              <Authorization allow={
                isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
                isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
                isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
                isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
                isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
              }>
                <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.DISCOUNTED_INITIAL_YEAR_RENT)}>
                  {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT}
                </FormTextTitle>
                <FormText>{!isEmptyValue(discountedInitialYearRent) ? `${formatNumber(discountedInitialYearRent)} €/v` : '-'}</FormText>
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={
                isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
                isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
                isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
                isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
                isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
              }>
                <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH)}>
                  {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH}
                </FormTextTitle>
                <FormText>{!isEmptyValue(rentPerMonth) ? `${formatNumber(rentPerMonth)} €` : '-'}</FormText>
              </Authorization>
            </Column>
            <Column small={6} medium={4} large={2}>
              <Authorization allow={
                isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
                isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
                isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
                isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
                isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
              }>
                <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS)}>
                  {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS}
                </FormTextTitle>
                <FormText>{!isEmptyValue(rentPer2Months) ? `${formatNumber(rentPer2Months)} €` : '-'}</FormText>
              </Authorization>
            </Column>
            {showTotal && <Fragment>
              <Column small={6} medium={4} large={2}>
                <Authorization allow={
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
                }>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH_TOTAL)}>
                    {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_PER_MONTH_TOTAL}
                  </FormTextTitle>
                  <FormText>{!isEmptyValue(rentPerMonthTotal) ? `${formatNumber(rentPerMonthTotal)} €` : '-'}</FormText>
                </Authorization>
              </Column>
              <Column small={6} medium={4} large={2}>
                <Authorization allow={
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX) &&
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.PROFIT_MARGIN_PERCENTAGE) &&
                  isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.DISCOUNT_PERCENTAGE)
                }>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS_TOTAL)}>
                    {LeaseBasisOfRentsFieldTitles.DISCOUNTED_INITIAL_YEAR_RENT_PER_2_MONTHS_TOTAL}
                  </FormTextTitle>
                  <FormText>{!isEmptyValue(rentPer2MonthsTotal) ? `${formatNumber(rentPer2MonthsTotal)} €` : '-'}</FormText>
                </Authorization>
              </Column>
            </Fragment>}
          </Row>}

          {calculatorType === CalculatorTypes.MAST && <Row>
            <Authorization allow={
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
            }>
              <Column large={2} medium={4} small={6}>
              </Column>
              <Column>
                <Row>
                  <Column small={6}>
                    <Divider />
                  </Column>
                </Row>
              </Column>
            </Authorization>
          </Row>}

          {calculatorType === CalculatorTypes.MAST && <Row>
            <Authorization allow={
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
              isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
            }>
              <Column large={2} medium={4} small={6}>
              </Column>
              <Column>
                <Row>
                  <Column small={6}>
                    <Row>
                      <Column small={6} medium={4} large={2}>
                        <FormText className='semibold'>{'Yhteensä'}</FormText>
                      </Column>
                      <Column small={6}>
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <FormText>{'*5%'}</FormText>
                      </Column>
                      <Column small={6} medium={4} large={2}>
                        <FormText className='semibold'>{`${formatNumber(mastTotal)} €`}</FormText>
                      </Column>
                    </Row>
                  </Column>
                  <Column small={6} medium={4} large={2} style={{marginTop: -15}}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)}>
                      <FormField
                        disableTouched={isSaveClicked}
                        fieldAttributes={savedBasisOfRent && !!savedBasisOfRent.locked_at
                          ? {...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX), required: false}
                          : getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)
                        }
                        disabled={!!savedBasisOfRent && !!savedBasisOfRent.locked_at}
                        name={`${field}.index`}
                        overrideValues={{
                          label: LeaseBasisOfRentsFieldTitles.INDEX,
                          options: indexOptions,
                        }}
                        enableUiDataEdit
                        uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.INDEX)}
                      />
                    </Authorization>
                  </Column>
                  <Column small={6} medium={4} large={2}  style={{marginTop: -15}}>
                    <Authorization allow={
                      isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
                      isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA)
                    }>
                      <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.BASE_YEAR_RENT)}>
                        {LeaseBasisOfRentsFieldTitles.BASE_YEAR_RENT}
                      </FormTextTitle>
                      <FormText>{!isEmptyValue(mastTotalIndexed) ? `${formatNumber(mastTotalIndexed)} €/v` : '-'}</FormText>
                    </Authorization>
                  </Column>
                </Row>
              </Column>
            </Authorization>
          </Row>}

          {(!savedBasisOfRent || !savedBasisOfRent.locked_at) && !showSubventions && (calculatorType === CalculatorTypes.LEASE || calculatorType === CalculatorTypes.LEASE2022) &&
            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_TYPE)}>
              <Row>
                <Column>
                  <AddButtonSecondary
                    label='Lisää subventio'
                    onClick={this.handleAddSubventions}
                  />
                </Column>
              </Row>
            </Authorization>
          }
          {showSubventions && (calculatorType === CalculatorTypes.LEASE || calculatorType === CalculatorTypes.LEASE2022)  &&
            <AppConsumer>
              {({dispatch}) => {
                const handleRemoveSubventions = () => {
                  dispatch({
                    type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                    confirmationFunction: () => {
                      this.handleRemoveSubventions();
                    },
                    confirmationModalButtonClassName: ButtonColors.ALERT,
                    confirmationModalButtonText: ConfirmationModalTexts.DELETE_SUBVENTION.BUTTON,
                    confirmationModalLabel: ConfirmationModalTexts.DELETE_SUBVENTION.LABEL,
                    confirmationModalTitle: ConfirmationModalTexts.DELETE_SUBVENTION.TITLE,
                  });
                };

                return(
                  <WhiteBox>
                    {(!savedBasisOfRent || !savedBasisOfRent.locked_at) &&
                      <ActionButtonWrapper>
                        <RemoveButton
                          onClick={handleRemoveSubventions}
                          title="Poista subventiot"
                        />
                      </ActionButtonWrapper>
                    }
                    <Row>
                      <Column small={6} medium={4} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_TYPE)}>
                          <FormField
                            disableTouched={isSaveClicked}
                            fieldAttributes={{...getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_TYPE), required: true}}
                            name={`${field}.subvention_type`}
                            disabled={(!!savedBasisOfRent && !!savedBasisOfRent.locked_at)}
                            overrideValues={{label: LeaseBasisOfRentsFieldTitles.SUBVENTION_TYPE}}
                            enableUiDataEdit
                            uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.SUBVENTION_TYPE)}
                          />
                        </Authorization>
                      </Column>
                    </Row>
                    {subventionType === SubventionTypes.FORM_OF_MANAGEMENT && (calculatorType === CalculatorTypes.LEASE || calculatorType === CalculatorTypes.LEASE2022) &&
                      <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT_SUBVENTIONS)}>
                        <SubTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(BasisOfRentManagementSubventionsFieldPaths.MANAGEMENT_SUBVENTIONS)}>{BasisOfRentManagementSubventionsFieldTitles.MANAGEMENT_SUBVENTIONS}</SubTitle>
                        <FieldArray
                          component={renderManagementSubventions}
                          disabled={(!!savedBasisOfRent && !!savedBasisOfRent.locked_at)}
                          formName={formName}
                          initialYearRent={initialYearRent}
                          currentAmountPerArea={currentAmountPerArea}
                          leaseAttributes={leaseAttributes}
                          name={`${field}.management_subventions`}
                          usersPermissions={usersPermissions}
                        />
                      </Authorization>
                    }
                    {subventionType === SubventionTypes.RE_LEASE && (calculatorType === CalculatorTypes.LEASE || calculatorType === CalculatorTypes.LEASE2022) &&
                      <Row>
                        <Column small={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT)}
                              name={`${field}.subvention_base_percent`}
                              disabled={(!!savedBasisOfRent && !!savedBasisOfRent.locked_at)}
                              overrideValues={{label: LeaseBasisOfRentsFieldTitles.SUBVENTION_BASE_PERCENT}}
                              unit='%'
                              enableUiDataEdit
                              uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT)}
                            />
                          </Authorization>
                        </Column>
                        <Column small={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                            <FormField
                              disableTouched={isSaveClicked}
                              fieldAttributes={getFieldAttributes(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_GRADUATED_PERCENT)}
                              name={`${field}.subvention_graduated_percent`}
                              disabled={(!!savedBasisOfRent && !!savedBasisOfRent.locked_at)}
                              overrideValues={{label: LeaseBasisOfRentsFieldTitles.SUBVENTION_GRADUATED_PERCENT}}
                              unit='%'
                              enableUiDataEdit
                              uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.SUBVENTION_GRADUATED_PERCENT)}
                            />
                          </Authorization>
                        </Column>
                        <Column small={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT) ||
                            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                            <FormTextTitle  enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.SUBVENTION_RE_LEASE_DISCOUNT_PRECENT)}>
                              {LeaseBasisOfRentsFieldTitles.SUBVENTION_RE_LEASE_DISCOUNT_PRECENT}
                            </FormTextTitle>
                            <FormText>{formatNumber(releaseDiscountPercent)} %</FormText>
                          </Authorization>
                        </Column>
                        <Column small={4} large={2}>
                          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT) ||
                            isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.SUBVENTION_BASE_PERCENT)}>
                            <FormTextTitle  enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseBasisOfRentsFieldPaths.SUBVENTION_RE_LEASE_DISCOUNT_AMOUNT)}>
                              {LeaseBasisOfRentsFieldTitles.SUBVENTION_RE_LEASE_DISCOUNT_AMOUNT}
                            </FormTextTitle>
                            <FormText>{formatNumber(releaseDiscountAmount)} €</FormText>
                          </Authorization>
                        </Column>
                      </Row>
                    }

                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, BasisOfRentTemporarySubventionsFieldPaths.TEMPORARY_SUBVENTIONS)}>
                      <SubTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(BasisOfRentTemporarySubventionsFieldPaths.TEMPORARY_SUBVENTIONS)}>
                        {BasisOfRentTemporarySubventionsFieldTitles.TEMPORARY_SUBVENTIONS}
                      </SubTitle>
                      <FieldArray
                        component={renderTemporarySubventions}
                        leaseAttributes={leaseAttributes}
                        disabled={(!!savedBasisOfRent && !!savedBasisOfRent.locked_at)}
                        formName={formName}
                        initialYearRent={initialYearRent}
                        name={`${field}.temporary_subventions`}
                        usersPermissions={usersPermissions}
                        managementSubventions={managementSubventions}
                        temporarySubventions={temporarySubventions}
                      />
                    </Authorization>

                    <Authorization allow={
                      isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AREA) &&
                      isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.AMOUNT_PER_AREA) &&
                      isFieldAllowedToRead(leaseAttributes, LeaseBasisOfRentsFieldPaths.INDEX)
                    }>
                      <Row>
                        <Column small={12} large={8}>
                          <Divider />
                        </Column>
                      </Row>
                      <Row>
                        <Column small={4} large={6}>
                          <FormText className='semibold'>Yhteensä</FormText>
                        </Column>
                        <Column small={4} large={2}>
                          <FormText className='semibold'>{formatNumber(totalSubventionAmount)} €</FormText>
                        </Column>
                      </Row>
                    </Authorization>
                  </WhiteBox>
                );
              }}
            </AppConsumer>
          }
        </BoxContentWrapper>
      </BoxItem>
    );
  }
}

export default connect(
  (state, props) => {
    const formName = props.formName;
    const selector = formValueSelector(formName);

    return {
      amountPerArea: selector(state, `${props.field}.amount_per_area`),
      currentAmountPerArea: selector(state, `${props.field}.current_amount_per_area`),
      area: selector(state, `${props.field}.area`),
      zone: selector(state, `${props.field}.zone`),
      areaUnit: selector(state, `${props.field}.area_unit`),
      calculatorType: selector(state, `${props.field}.type`),
      basisOfRent: selector(state, `${props.field}`) || {},
      currentLease: getCurrentLease(state),
      discountPercentage: selector(state, `${props.field}.discount_percentage`),
      id: selector(state, `${props.field}.id`),
      index: selector(state, `${props.field}.index`),
      children: selector(state, `${props.field}.children`),
      intendedUse: selector(state, `${props.field}.intended_use`),
      leaseAttributes: getLeaseAttributes(state),
      lockedAt: selector(state, `${props.field}.locked_at`),
      managementSubventions: selector(state, `${props.field}.management_subventions`),
      plansInspectedAt: selector(state, `${props.field}.plans_inspected_at`),
      price: selector(state, `${props.field}.amount_per_area`),
      profitMarginPercentage: selector(state, `${props.field}.profit_margin_percentage`),
      subventionBasePercent: selector(state, `${props.field}.subvention_base_percent`),
      subventionGraduatedPercent: selector(state, `${props.field}.subvention_graduated_percent`),
      subventionType: selector(state, `${props.field}.subvention_type`),
      temporarySubventions: selector(state, `${props.field}.temporary_subventions`),
      usersPermissions: getUsersPermissions(state),
    };
  },
  {
    change,
    clearFields,
  },
)(BasisOfRentEdit);
