import React, { Component, Fragment, ReactElement } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import { FieldArray, formValueSelector, reduxForm, change } from "redux-form";
import flowRight from "lodash/flowRight";
import get from "lodash/get";
import Authorization from "/src/components/authorization/Authorization";
import AddFileButton from "/src/components/form/AddFileButton";
import { ActionTypes, AppConsumer } from "/src/app/AppContext";
import AddButtonThird from "/src/components/form/AddButtonThird";
import Divider from "/src/components/content/Divider";
import FormField from "/src/components/form/FormField";
import FormText from "/src/components/form/FormText";
import FormTextTitle from "/src/components/form/FormTextTitle";
import GreenBox from "/src/components/content/GreenBox";
import SubTitle from "/src/components/content/SubTitle";
import WhiteBox from "/src/components/content/WhiteBox";
import { receiveFormValidFlags } from "/src/landUseContract/actions";
import { getCurrentLandUseContract } from "/src/landUseContract/selectors";
import type { LandUseContract } from "/src/landUseContract/types";
import { FormNames } from "enums";
import RemoveButton from "/src/components/form/RemoveButton";
import { ButtonColors } from "/src/components/enums";
import { convertStrToDecimalNumber, formatNumber } from "util/helpers";
import { getAttributes, getIsSaveClicked } from "/src/landUseContract/selectors";
import UnitPricesUsedInCalculations from "./UnitPricesUsedInCalculations";
import type { Attributes, Methods as MethodsType } from "types";
import { getUserFullName } from "/src/users/helpers";
import { ConfirmationModalTexts, Methods } from "enums";
import { formatDate, isFieldAllowedToRead, isMethodAllowed } from "util/helpers";
import FileDownloadLink from "/src/components/file/FileDownloadLink";
import { getUiDataLandUseAgreementAttachmentKey } from "/src/uiData/helpers";
import { getMethods as getLandUseAgreementAttachmentMethods, getAttributes as getLandUseAgreementAttachmentAttributes } from "/src/landUseAgreementAttachment/selectors";
import { LandUseAgreementAttachmentFieldPaths } from "/src/landUseAgreementAttachment/enums";
import { createLandUseAgreementAttachment, deleteLandUseAgreementAttachment } from "/src/landUseAgreementAttachment/actions";
type InvoicesProps = {
  attributes: Attributes;
  fields: any;
  isSaveClicked: boolean;
  change: (...args: Array<any>) => any;
  formName: string;
};

const renderUnitPricesUsedInCalculation = ({
  attributes,
  fields,
  isSaveClicked
}: InvoicesProps): ReactElement => {
  const handleAdd = () => fields.push({});

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <div>
            {fields && !!fields.length && <div>
                <Row>
                  <Column large={2}>
                    <FormTextTitle title='Kaavayksikön käyttötarkoitus' />
                  </Column>
                  <Column large={2}>
                    <FormTextTitle title='Hallintamuoto' />
                  </Column>
                  <Column large={1}>
                    <FormTextTitle title='Suojeltu' />
                  </Column>
                  <Column large={1}>
                    <FormTextTitle title='k-m²' />
                  </Column>
                  <Column large={1}>
                    <FormTextTitle title='Yksikköhinta €' />
                  </Column>
                  <Column large={1}>
                    <FormTextTitle title='Alennus %' />
                  </Column>
                  <Column large={1}>
                    <FormTextTitle title='Käytetty hinta' />
                  </Column>
                  <Column large={1}>
                    <FormTextTitle title='Summa' />
                  </Column>
                </Row>
                {fields.map((field, index) => {
            const handleRemove = () => {
              dispatch({
                type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                confirmationFunction: () => {
                  fields.remove(index);
                },
                confirmationModalButtonClassName: ButtonColors.ALERT,
                confirmationModalButtonText: 'Poista yksikköhinta',
                confirmationModalLabel: 'Poista yksikköhinta',
                confirmationModalTitle: 'Oletko varma että haluat poistaa yksikköhinnan'
              });
            };

            return <UnitPricesUsedInCalculations key={index} onRemove={handleRemove} attributes={attributes} isSaveClicked={isSaveClicked} formName={formName} field={field} />;
          })}
              </div>}
            <Row>
              <Column>
                <AddButtonThird label='Lisää yksikköhinta' onClick={handleAdd} />
              </Column>
            </Row>
          </div>;
    }}
    </AppConsumer>;
};

type Props = {
  attributes: Attributes;
  isSaveClicked: boolean;
  receiveFormValidFlags: (...args: Array<any>) => any;
  valid: boolean;
  cashCompensation: number;
  landCompensation: number;
  otherCompensation: number;
  firstInstallmentIncrease: number;
  change: (...args: Array<any>) => any;
  currentLandUseContract: LandUseContract;
  landUseAgreementAttachmentMethods: MethodsType;
  landUseAgreementAttachmentAttributes: Attributes;
  createLandUseAgreementAttachment: (...args: Array<any>) => any;
  deleteLandUseAgreementAttachment: (...args: Array<any>) => any;
};

class CompensationsEdit extends Component<Props> {
  componentDidUpdate(prevProps) {
    const {
      receiveFormValidFlags
    } = this.props;

    if (prevProps.valid !== this.props.valid) {
      receiveFormValidFlags({
        [formName]: this.props.valid
      });
    }
  }

  getTotal = () => {
    const {
      cashCompensation,
      landCompensation,
      otherCompensation,
      firstInstallmentIncrease
    } = this.props;
    return convertStrToDecimalNumber(cashCompensation) + convertStrToDecimalNumber(landCompensation) + convertStrToDecimalNumber(otherCompensation) + convertStrToDecimalNumber(firstInstallmentIncrease);
  };
  handleFileChange = e => {
    const {
      createLandUseAgreementAttachment,
      currentLandUseContract
    } = this.props;
    createLandUseAgreementAttachment({
      id: currentLandUseContract.id,
      data: {
        land_use_agreement: currentLandUseContract.id,
        type: 'compensation_calculation'
      },
      file: e.target.files[0]
    });
  };
  handleDeleteLandUseAgreementAttachmentFile = (fileId: number) => {
    const {
      deleteLandUseAgreementAttachment,
      currentLandUseContract
    } = this.props;
    deleteLandUseAgreementAttachment({
      id: currentLandUseContract.id,
      fileId
    });
  };

  render() {
    const {
      attributes,
      isSaveClicked,
      change,
      currentLandUseContract,
      landUseAgreementAttachmentMethods,
      landUseAgreementAttachmentAttributes
    } = this.props;
    const total = this.getTotal();
    const attachments = get(currentLandUseContract, 'attachments', []).filter(file => file.type === 'compensation_calculation');
    return <form>
        <GreenBox>
          <Row>
            <Column small={12} large={6}>
              <SubTitle>Maankäyttökorvaus</SubTitle>
              <WhiteBox>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormTextTitle title='Maankäyttökorvaus' />
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormTextTitle title='Korvauksen määrä' />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormText>Rahakorvaus</FormText>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'compensations.children.cash_compensation')} invisibleLabel name='compensations.cash_compensation' unit='€' />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormText>Maakorvaus</FormText>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'compensations.children.land_compensation')} invisibleLabel name='compensations.land_compensation' unit='€' />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormText>Muu</FormText>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'compensations.children.other_compensation')} invisibleLabel name='compensations.other_compensation' unit='€' />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormText className='no-margin'>1. maksuerän korotus</FormText>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'compensations.children.first_installment_increase')} invisibleLabel name='compensations.first_installment_increase' unit='€' />
                  </Column>
                </Row>
                <Divider />
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormText className='semibold'>Yhteensä</FormText>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormText>{`${formatNumber(total)} €`}</FormText>
                  </Column>
                </Row>
              </WhiteBox>
            </Column>
          </Row>
        </GreenBox>
        <GreenBox className={'with-top-margin'}>
          <Row>
            <Column small={12} large={6}>
              <SubTitle>Korvauksetta luovutettavat yleiset alueet</SubTitle>
              <WhiteBox>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormTextTitle title='Kaavayksikön käyttötarkoitus' />
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormTextTitle title='Hankinta-arvo €' />
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormTextTitle title='m²' />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormText>Katu (9901)</FormText>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'compensations.children.street_acquisition_value')} invisibleLabel name='compensations.street_acquisition_value' unit='€' />
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'compensations.children.street_area')} invisibleLabel name='compensations.street_area' unit='m²' />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormText>Puisto (9903)</FormText>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'compensations.children.park_acquisition_value')} invisibleLabel name='compensations.park_acquisition_value' unit='€' />
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'compensations.children.park_area')} invisibleLabel name='compensations.park_area' unit='m²' />
                  </Column>
                </Row>
                <Row>
                  <Column small={6} medium={3} large={4}>
                    <FormText>Muut</FormText>
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'compensations.children.other_acquisition_value')} invisibleLabel name='compensations.other_acquisition_value' unit='€' />
                  </Column>
                  <Column small={6} medium={3} large={4}>
                    <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'compensations.children.other_area')} invisibleLabel name='compensations.other_area' unit='m²' />
                  </Column>
                </Row>
              </WhiteBox>
            </Column>
          </Row>
        </GreenBox>
        <GreenBox className={'with-top-margin'}>
          <Row>
            <Column small={12} large={6}>
              <SubTitle>Maankäyttökorvaus laskelma</SubTitle>
            
              <Authorization allow={isMethodAllowed(landUseAgreementAttachmentMethods, Methods.GET)}>
                {!!currentLandUseContract.id && <AppConsumer>
                  {({
                  dispatch
                }) => {
                  return <Fragment>
                        {!!attachments && !!attachments.length && <Fragment>
                            <Row>
                              <Column small={3} large={4}>
                                <Authorization allow={isFieldAllowedToRead(landUseAgreementAttachmentAttributes, LandUseAgreementAttachmentFieldPaths.FILE)}>
                                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLandUseAgreementAttachmentKey(LandUseAgreementAttachmentFieldPaths.FILE)}>
                                    {'Tiedoston nimi'}
                                  </FormTextTitle>
                                </Authorization>
                              </Column>
                              <Column small={3} large={2}>
                                <Authorization allow={isFieldAllowedToRead(landUseAgreementAttachmentAttributes, LandUseAgreementAttachmentFieldPaths.UPLOADED_AT)}>
                                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLandUseAgreementAttachmentKey(LandUseAgreementAttachmentFieldPaths.UPLOADED_AT)}>
                                    {'Ladattu'}
                                  </FormTextTitle>
                                </Authorization>
                              </Column>
                              <Column small={3} large={2}>
                                <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLandUseAgreementAttachmentKey(LandUseAgreementAttachmentFieldPaths.UPLOADER)}>
                                  {'Lataaja'}
                                </FormTextTitle>
                              </Column>
                            </Row>
                            {attachments.map((file, index) => {
                        const handleRemove = () => {
                          dispatch({
                            type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                            confirmationFunction: () => {
                              this.handleDeleteLandUseAgreementAttachmentFile(file.id);
                            },
                            confirmationModalButtonClassName: ButtonColors.ALERT,
                            confirmationModalButtonText: ConfirmationModalTexts.DELETE_ATTACHMENT.BUTTON,
                            confirmationModalLabel: ConfirmationModalTexts.DELETE_ATTACHMENT.LABEL,
                            confirmationModalTitle: ConfirmationModalTexts.DELETE_ATTACHMENT.TITLE
                          });
                        };

                        return <Row key={index}>
                                  <Column small={3} large={4}>
                                    <Authorization allow={isFieldAllowedToRead(landUseAgreementAttachmentAttributes, LandUseAgreementAttachmentFieldPaths.FILE)}>
                                      <FileDownloadLink fileUrl={file.file} label={file.filename} />
                                    </Authorization>
                                  </Column>
                                  <Column small={3} large={2}>
                                    <Authorization allow={isFieldAllowedToRead(landUseAgreementAttachmentAttributes, LandUseAgreementAttachmentFieldPaths.UPLOADED_AT)}>
                                      <FormText>{formatDate(file.uploaded_at) || '-'}</FormText>
                                    </Authorization>
                                  </Column>
                                  <Column small={3} large={2}>
                                    <FormText>{getUserFullName(file.uploader) || '-'}</FormText>
                                  </Column>
                                  <Column small={3} large={2}>
                                    <Authorization allow={isMethodAllowed(landUseAgreementAttachmentMethods, Methods.DELETE)}>
                                      <RemoveButton className='third-level' onClick={handleRemove} style={{
                                right: 12
                              }} title="Poista liitetiedosto" />
                                    </Authorization>
                                  </Column>
                                </Row>;
                      })}
                          </Fragment>}
                        <Authorization allow={isMethodAllowed(landUseAgreementAttachmentMethods, Methods.POST)}>
                          <AddFileButton label='Lisää tiedosto' name={`${currentLandUseContract.id}`} onChange={this.handleFileChange} />
                        </Authorization>
                      </Fragment>;
                }}
                </AppConsumer>}
              </Authorization>
              
            </Column>
          </Row>
        </GreenBox>
        <GreenBox className={'with-top-margin'}>
          <Row>
            <Column>
              <SubTitle>Laskelmassa käytetyt yksikköhinnat</SubTitle>
              <WhiteBox>
                <Row>
                  <Column>
                    <FieldArray component={renderUnitPricesUsedInCalculation} attributes={attributes} isSaveClicked={isSaveClicked} change={change} disabled={isSaveClicked} formName={FormNames.LAND_USE_CONTRACT_COMPENSATIONS} name={'compensations.unit_prices_used_in_calculation'} />
                  </Column>
                </Row>
              </WhiteBox>
            </Column>
          </Row>
        </GreenBox>
      </form>;
  }

}

const formName = FormNames.LAND_USE_CONTRACT_COMPENSATIONS;
const selector = formValueSelector(formName);
export default flowRight(connect(state => {
  return {
    attributes: getAttributes(state),
    isSaveClicked: getIsSaveClicked(state),
    cashCompensation: selector(state, 'compensations.cash_compensation'),
    landCompensation: selector(state, 'compensations.land_compensation'),
    otherCompensation: selector(state, 'compensations.other_compensation'),
    firstInstallmentIncrease: selector(state, 'compensations.first_installment_increase'),
    currentLandUseContract: getCurrentLandUseContract(state),
    landUseAgreementAttachmentMethods: getLandUseAgreementAttachmentMethods(state),
    landUseAgreementAttachmentAttributes: getLandUseAgreementAttachmentAttributes(state)
  };
}, {
  receiveFormValidFlags,
  createLandUseAgreementAttachment,
  deleteLandUseAgreementAttachment
}), reduxForm({
  form: formName,
  destroyOnUnmount: false,
  change
}))(CompensationsEdit) as React.ComponentType<any>;