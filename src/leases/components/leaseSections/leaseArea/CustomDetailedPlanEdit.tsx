import React, { Fragment, PureComponent } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router";
import { FieldArray, reduxForm, change } from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import AddButtonSecondary from "@/components/form/AddButtonSecondary";
import { ActionTypes, AppConsumer } from "@/app/AppContext";
import BoxItemContainer from "@/components/content/BoxItemContainer";
import BoxItem from "@/components/content/BoxItem";
import BoxContentWrapper from "@/components/content/BoxContentWrapper";
import ActionButtonWrapper from "@/components/form/ActionButtonWrapper";
import Authorization from "@/components/authorization/Authorization";
import FormText from "@/components/form/FormText";
import FormField from "@/components/form/FormField";
import RemoveButton from "@/components/form/RemoveButton";
import { ButtonColors } from "@/components/enums";
import { ConfirmationModalTexts } from "@/enums";
import { FormNames } from "@/enums";
import { LeaseAreaCustomDetailedPlanFieldPaths, LeaseAreaCustomDetailedPlanFieldTitles, LeaseAreaUsageDistributionFieldPaths, LeaseAreaUsageDistributionFieldTitles, LeaseAreaCustomDetailedPlanInfoLinksFieldPaths, LeaseAreaCustomDetailedPlanInfoLinksFieldTitles } from "@/leases/enums";
import type { Attributes } from "types";
import { UsersPermissions } from "@/usersPermissions/enums";
import type { UsersPermissions as UsersPermissionsType } from "@/usersPermissions/types";
import { getUiDataLeaseKey } from "@/uiData/helpers";
import { getAttributes } from "@/leases/selectors";
import { getUsersPermissions } from "@/usersPermissions/selectors";
import { getFieldAttributes, hasPermissions, isFieldAllowedToEdit, isFieldAllowedToRead } from "@/util/helpers";
type UsageDistributionsProps = {
  attributes: Attributes;
  buttonTitle: string;
  collapseState: boolean;
  errors: Record<string, any>;
  fields: any;
  isSaveClicked: boolean;
  noDataText: string;
  onCollapseToggle: (...args: Array<any>) => any;
  title: string;
  uiDataKey: string;
  usersPermissions: UsersPermissionsType;
};

const renderUsageDistributions = ({
  attributes,
  buttonTitle,
  fields,
  isSaveClicked,
  noDataText,
  usersPermissions
}: UsageDistributionsProps): React.ReactNode => {
  const handleAdd = () => {
    fields.push({
      usage_distributions: [{}]
    });
  };

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Fragment>
            {!isFieldAllowedToEdit(attributes, LeaseAreaCustomDetailedPlanFieldPaths.USAGE_DISTRIBUTIONS) && (!fields || !fields.length) && <FormText>{noDataText}</FormText>}

            {!!fields.length && <BoxItemContainer>
                {fields.map((usageDistribution, index) => {
            const handleRemove = () => {
              dispatch({
                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                confirmationFunction: () => {
                  fields.remove(index);
                },
                confirmationModalButtonClassName: ButtonColors.ALERT,
                confirmationModalButtonText: ConfirmationModalTexts.DELETE_USAGE_DISTRIBUTIONS.BUTTON,
                confirmationModalLabel: ConfirmationModalTexts.DELETE_USAGE_DISTRIBUTIONS.LABEL,
                confirmationModalTitle: ConfirmationModalTexts.DELETE_USAGE_DISTRIBUTIONS.TITLE
              });
            };

            return <BoxItem key={index}>
                      <BoxContentWrapper>
                        <ActionButtonWrapper>
                          <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_USAGEDISTRIBUTION)}>
                            <RemoveButton onClick={handleRemove} title="Poista käyttöjakauma" />
                          </Authorization>
                        </ActionButtonWrapper>
                        <Row>
                          {
                    /* Käyttöjakauma */
                  }
                          <Column small={4} medium={4} large={4}>
                            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaUsageDistributionFieldPaths.DISTRIBUTION)}>
                              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaUsageDistributionFieldPaths.DISTRIBUTION)} name={`${usageDistribution}.distribution`} overrideValues={{
                        label: LeaseAreaUsageDistributionFieldTitles.DISTRIBUTION
                      }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaUsageDistributionFieldPaths.DISTRIBUTION)} />
                            </Authorization>
                          </Column>
                          {
                    /* Rakennusoikeus */
                  }
                          <Column small={4} medium={4} large={4}>
                            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaUsageDistributionFieldPaths.BUILD_PERMISSION)}>
                              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaUsageDistributionFieldPaths.BUILD_PERMISSION)} name={`${usageDistribution}.build_permission`} unit='k-m²' overrideValues={{
                        label: LeaseAreaUsageDistributionFieldTitles.BUILD_PERMISSION
                      }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaUsageDistributionFieldPaths.BUILD_PERMISSION)} />
                            </Authorization>
                          </Column>
                          {
                    /* huomautus */
                  }
                          <Column small={4} medium={4} large={4}>
                            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaUsageDistributionFieldPaths.NOTE)}>
                              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaUsageDistributionFieldPaths.NOTE)} name={`${usageDistribution}.note`} overrideValues={{
                        label: LeaseAreaUsageDistributionFieldTitles.NOTE
                      }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaUsageDistributionFieldPaths.NOTE)} />
                            </Authorization>
                          </Column>
                        </Row>
                      </BoxContentWrapper>
                    </BoxItem>;
          })}
              </BoxItemContainer>}
            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_USAGEDISTRIBUTION)}>
              <Row>
                <Column>
                  <AddButtonSecondary className={fields.length === 0 ? 'no-top-margin' : ''} label={buttonTitle} onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </Fragment>;
    }}
    </AppConsumer>;
};

type InfoLinksProps = {
  attributes: Attributes;
  buttonTitle: string;
  collapseState: boolean;
  errors: Record<string, any>;
  fields: any;
  isSaveClicked: boolean;
  noDataText: string;
  onCollapseToggle: (...args: Array<any>) => any;
  title: string;
  uiDataKey: string;
  usersPermissions: UsersPermissionsType;
};

const renderInfoLinks = ({
  attributes,
  buttonTitle,
  fields,
  isSaveClicked,
  noDataText,
  usersPermissions
}: InfoLinksProps): React.ReactNode => {
  const handleAdd = () => {
    fields.push({
      info_links: [{}]
    });
  };

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Fragment>
            {!isFieldAllowedToEdit(attributes, LeaseAreaCustomDetailedPlanFieldPaths.INFO_LINKS) && (!fields || !fields.length) && <FormText>{noDataText}</FormText>}

            {!!fields.length && <BoxItemContainer>
                {fields.map((infoLink, index) => {
            const handleRemove = () => {
              dispatch({
                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                confirmationFunction: () => {
                  fields.remove(index);
                },
                confirmationModalButtonClassName: ButtonColors.ALERT,
                confirmationModalButtonText: ConfirmationModalTexts.DELETE_INFO_LINKS.BUTTON,
                confirmationModalLabel: ConfirmationModalTexts.DELETE_INFO_LINKS.LABEL,
                confirmationModalTitle: ConfirmationModalTexts.DELETE_INFO_LINKS.TITLE
              });
            };

            return <BoxItem key={index}>
                      <BoxContentWrapper>
                        <ActionButtonWrapper>
                          <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.CHANGE_CUSTOMDETAILEDPLAN_INFOLINKS)}>
                            <RemoveButton onClick={handleRemove} title="Poista lisätietolinkki" />
                          </Authorization>
                        </ActionButtonWrapper>
                        <Row>
                          {
                    /* Lisätietolinkin kuvaus */
                  }
                          <Column small={4} medium={4} large={4}>
                            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanInfoLinksFieldPaths.DESCRIPTION)}>
                              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaCustomDetailedPlanInfoLinksFieldPaths.DESCRIPTION)} name={`${infoLink}.description`} overrideValues={{
                        label: LeaseAreaCustomDetailedPlanInfoLinksFieldTitles.DESCRIPTION
                      }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanInfoLinksFieldPaths.DESCRIPTION)} />
                            </Authorization>
                          </Column>
                          {
                    /* Lisätietolinkki */
                  }
                          <Column small={4} medium={4} large={4}>
                            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanInfoLinksFieldPaths.URL)}>
                              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaCustomDetailedPlanInfoLinksFieldPaths.URL)} name={`${infoLink}.url`} overrideValues={{
                        label: LeaseAreaCustomDetailedPlanInfoLinksFieldTitles.URL
                      }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanInfoLinksFieldPaths.URL)} />
                            </Authorization>
                          </Column>
                          {
                    /* Kieli */
                  }
                          <Column small={4} medium={4} large={4}>
                            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanInfoLinksFieldPaths.LANGUAGE)}>
                              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaCustomDetailedPlanInfoLinksFieldPaths.LANGUAGE)} name={`${infoLink}.language`} overrideValues={{
                        label: LeaseAreaCustomDetailedPlanInfoLinksFieldTitles.LANGUAGE
                      }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanInfoLinksFieldPaths.LANGUAGE)} />
                            </Authorization>
                          </Column>
                        </Row>
                      </BoxContentWrapper>
                    </BoxItem>;
          })}
              </BoxItemContainer>}


            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_USAGEDISTRIBUTION)}>
              <Row>
                <Column>
                  <AddButtonSecondary className={!fields.length ? 'no-top-margin' : ''} label={buttonTitle} onClick={handleAdd} />
                </Column>
              </Row>
            </Authorization>
          </Fragment>;
    }}
    </AppConsumer>;
};

type OwnProps = {
  field: string;
  onRemove: (...args: Array<any>) => any;
};
type Props = OwnProps & {
  usersPermissions: UsersPermissionsType;
  attributes: Attributes;
  isSaveClicked: boolean;
  errors: Record<string, any>;
};

class CustomDetailedPlanEdit extends PureComponent<Props> {
  render() {
    const {
      attributes,
      usersPermissions,
      onRemove,
      isSaveClicked,
      field,
      errors
    } = this.props;
    return <BoxContentWrapper>
        <BoxItem className='no-border-on-first-child no-border-on-last-child'>
          <ActionButtonWrapper>
            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_CUSTOMDETAILEDPLAN)}>
              <RemoveButton onClick={onRemove} title="Poista oma muu alue" />
            </Authorization>
          </ActionButtonWrapper>
          <Row>
            {
            /* Kohteen tunnus */
          }
            <Column small={12} medium={4} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.IDENTIFIER)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaCustomDetailedPlanFieldPaths.IDENTIFIER)} name={`${field}.identifier`} overrideValues={{
                label: LeaseAreaCustomDetailedPlanFieldTitles.IDENTIFIER
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.IDENTIFIER)} />
              </Authorization>
            </Column>
            {
            /* Kaavayksikön käyttötarkoitus */
          }
            <Column small={12} medium={4} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.INTENDED_USE)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaCustomDetailedPlanFieldPaths.INTENDED_USE)} name={`${field}.intended_use`} overrideValues={{
                label: LeaseAreaCustomDetailedPlanFieldTitles.INTENDED_USE
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.INTENDED_USE)} />
              </Authorization>
            </Column>
            {
            /* Osoite */
          }
            <Column small={12} medium={4} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.ADDRESS)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaCustomDetailedPlanFieldPaths.ADDRESS)} name={`${field}.address`} overrideValues={{
                label: LeaseAreaCustomDetailedPlanFieldTitles.ADDRESS
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.ADDRESS)} />
              </Authorization>
            </Column>
          </Row>
          <Row>
            {
            /* Kokonaisala */
          }
            <Column small={12} medium={4} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.AREA)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaCustomDetailedPlanFieldPaths.AREA)} name={`${field}.area`} unit='m²' overrideValues={{
                label: LeaseAreaCustomDetailedPlanFieldTitles.AREA
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.AREA)} />
              </Authorization>
            </Column>
            {
            /* Kaavayksikön olotila*/
          }
            <Column small={12} medium={4} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.STATE)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaCustomDetailedPlanFieldPaths.STATE)} name={`${field}.state`} overrideValues={{
                label: LeaseAreaCustomDetailedPlanFieldTitles.STATE
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.STATE)} />
              </Authorization>
            </Column>
            {
            /* Kaavayksikön laji */
          }
            <Column small={12} medium={4} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.TYPE)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaCustomDetailedPlanFieldPaths.TYPE)} name={`${field}.type`} overrideValues={{
                label: LeaseAreaCustomDetailedPlanFieldTitles.TYPE
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.TYPE)} />
              </Authorization>
            </Column>
          </Row>
          <Row>
            {
            /* Asemakaava */
          }
            <Column small={12} medium={4} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.DETAILED_PLAN)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaCustomDetailedPlanFieldPaths.DETAILED_PLAN)} name={`${field}.detailed_plan`} overrideValues={{
                label: LeaseAreaCustomDetailedPlanFieldTitles.DETAILED_PLAN
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.DETAILED_PLAN)} />
              </Authorization>
            </Column>
            {
            /* Asemakaavan viim. käsittelypvm */
          }
            <Column small={12} medium={4} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaCustomDetailedPlanFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE)} name={`${field}.detailed_plan_latest_processing_date`} overrideValues={{
                label: LeaseAreaCustomDetailedPlanFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE)} />
              </Authorization>
            </Column>
            {
            /* Asemak. käsittelypvm huomautus */
          }
            <Column small={12} medium={4} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaCustomDetailedPlanFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE)} name={`${field}.detailed_plan_latest_processing_date_note`} overrideValues={{
                label: LeaseAreaCustomDetailedPlanFieldTitles.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.DETAILED_PLAN_LATEST_PROCESSING_DATE_NOTE)} />
              </Authorization>
            </Column>
            {
            /* Kokonaisrakennusoikeus */
          }
            <Column small={12} medium={4} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.RENT_BUILD_PERMISSION)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaCustomDetailedPlanFieldPaths.RENT_BUILD_PERMISSION)} name={`${field}.rent_build_permission`} unit='k-m²' overrideValues={{
                label: LeaseAreaCustomDetailedPlanFieldTitles.RENT_BUILD_PERMISSION
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.RENT_BUILD_PERMISSION)} />
              </Authorization>
            </Column>
            {
            /* Arvioitu rakentamisen valmius */
          }
            <Column small={12} medium={4} large={4}>
              <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaCustomDetailedPlanFieldPaths.PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT)}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreaCustomDetailedPlanFieldPaths.PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT)} name={`${field}.preconstruction_estimated_construction_readiness_moment`} overrideValues={{
                label: LeaseAreaCustomDetailedPlanFieldTitles.PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT
              }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.PRECONSTRUCTION_ESTIMATED_CONSTRUCTION_READINESS_MOMENT)} />
              </Authorization>
            </Column>
          </Row>
          {
          /* Käyttöjakauma */
        }
          <Row>
            <Column small={12} large={12}>
              <Authorization allow={isFieldAllowedToEdit(attributes, LeaseAreaCustomDetailedPlanFieldPaths.USAGE_DISTRIBUTIONS)}>
                <FieldArray attributes={attributes} buttonTitle='Lisää käyttöjakauma' component={renderUsageDistributions} errors={errors} isSaveClicked={isSaveClicked} name={`${field}.usage_distributions`} noDataText='Ei käyttöjakaumia' title='Käyttöjakaumat' usersPermissions={usersPermissions} uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.USAGE_DISTRIBUTIONS)} />
              </Authorization>
            </Column>
          </Row>
          {
          /* Lisätietolinkit */
        }
          <Row>
            <Column small={12} large={12}>
              <Authorization allow={isFieldAllowedToEdit(attributes, LeaseAreaCustomDetailedPlanFieldPaths.INFO_LINKS)}>
                <FieldArray attributes={attributes} buttonTitle='Lisää lisätietolinkki' component={renderInfoLinks} errors={errors} isSaveClicked={isSaveClicked} name={`${field}.info_links`} noDataText='Ei lisätietolinkkejä' title='Lisätietolinkit' usersPermissions={usersPermissions} uiDataKey={getUiDataLeaseKey(LeaseAreaCustomDetailedPlanFieldPaths.INFO_LINKS)} />
              </Authorization>
            </Column>
          </Row>
        </BoxItem>
      </BoxContentWrapper>;
  }

}

const formName = FormNames.LEASE_AREAS;
export default (flowRight(
withRouter, connect(state => {
  return {
    attributes: getAttributes(state),
    usersPermissions: getUsersPermissions(state)
  };
}), reduxForm({
  form: formName,
  destroyOnUnmount: false,
  change
}))(CustomDetailedPlanEdit) as React.ComponentType<OwnProps>);