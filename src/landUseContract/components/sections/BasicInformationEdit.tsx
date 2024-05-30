import React, { Fragment, Component, ReactElement } from "react";
import { connect } from "react-redux";
import { change, FieldArray, reduxForm } from "redux-form";
import { Row, Column } from "react-foundation";
import flowRight from "lodash/flowRight";
import get from "lodash/get";
import AddFileButton from "components/form/AddFileButton";
import EstateIdSelectInput from "components/inputs/EstateIdSelectInput";
import Authorization from "components/authorization/Authorization";
import { ActionTypes, AppConsumer } from "app/AppContext";
import AddButtonThird from "components/form/AddButtonThird";
import Collapse from "components/collapse/Collapse";
import Divider from "components/content/Divider";
import FieldAndRemoveButtonWrapper from "components/form/FieldAndRemoveButtonWrapper";
import FormField from "components/form/FormField";
import FormText from "components/form/FormText";
import FileDownloadLink from "components/file/FileDownloadLink";
import FormTextTitle from "components/form/FormTextTitle";
import RemoveButton from "components/form/RemoveButton";
import SubTitle from "components/content/SubTitle";
import { receiveCollapseStates, receiveFormValidFlags } from "landUseContract/actions";
import { createLandUseAgreementAttachment, deleteLandUseAgreementAttachment } from "landUseAgreementAttachment/actions";
import { ConfirmationModalTexts, FieldTypes, FormNames, ViewModes, Methods } from "enums";
import { ButtonColors } from "components/enums";
import { getAttributes, getCollapseStateByKey, getIsSaveClicked, getCurrentLandUseContract } from "landUseContract/selectors";
import { referenceNumber } from "components/form/validations";
import AddressItemEdit from "./AddressItemEdit";
import type { Attributes, Methods as MethodsType } from "types";
import { getUiDataLandUseContractKey, getUiDataLandUseAgreementAttachmentKey } from "uiData/helpers";
import { LandUseAgreementAttachmentFieldPaths } from "landUseAgreementAttachment/enums";
import { getUserFullName } from "users/helpers";
import { isFieldAllowedToRead, isMethodAllowed, formatDate } from "util/helpers";
import { getMethods as getLandUseAgreementAttachmentMethods, getAttributes as getLandUseAgreementAttachmentAttributes } from "landUseAgreementAttachment/selectors";
import type { LandUseContract } from "landUseContract/types";
type AddressesProps = {
  fields: any;
  formName: string;
  attributes: Record<string, any>;
  isSaveClicked: boolean;
};

const renderAddresses = ({
  fields,
  formName,
  attributes,
  isSaveClicked
}: AddressesProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <Fragment>
            {fields && !!fields.length && <Row>
                <Column small={6} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLandUseContractKey('addresses.child.children.address')}>
                    {'Osoite'}
                  </FormTextTitle>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLandUseContractKey('addresses.child.children.postal_code')}>
                    {'Postinumero'}
                  </FormTextTitle>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLandUseContractKey('addresses.child.children.city')}>
                    {'Kaupunki'}
                  </FormTextTitle>
                </Column>
                <Column small={6} medium={4} large={2}>
                  <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLandUseContractKey('addresses.child.children.is_primary')}>
                    {'Ensisijainen osoite'}
                  </FormTextTitle>
                </Column>
              </Row>}
            {fields && !!fields.length && fields.map((address, index) => {
          const handleRemove = () => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                fields.remove(index);
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: 'Lisää osoite',
              confirmationModalLabel: 'Poista osoite',
              confirmationModalTitle: 'Oletko varma että haluat poistaa osoitteen'
            });
          };

          return <AddressItemEdit key={index} field={address} index={index} attributes={attributes} isSaveClicked={isSaveClicked} onRemove={handleRemove} formName={formName} />;
        })}
            <Row>
              <Column>
                <AddButtonThird className='no-margin' label='Lisää osoite' onClick={handleAdd} />
              </Column>
            </Row> 
          </Fragment>;
    }}
    </AppConsumer>;
};

type AreasProps = {
  attributes: Attributes;
  fields: any;
  isSaveClicked: boolean;
  change: (...args: Array<any>) => any;
  estateIds: [];
  plots: any[];
};

const renderAreas = ({
  attributes,
  fields,
  isSaveClicked,
  change,
  estateIds,
  plots
}: AreasProps): ReactElement => {
  const handleAdd = () => {
    fields.push({});
  };

  return <AppConsumer>
      {({
      dispatch
    }) => {
      return <div>
            <FormTextTitle title='Kiinteistötunnus' />
            {fields && !!fields.length && fields.map((field, index) => {
          const handleRemove = () => {
            dispatch({
              type: ActionTypes.SHOW_CONFIRMATION_MODAL,
              confirmationFunction: () => {
                fields.remove(index);
              },
              confirmationModalButtonClassName: ButtonColors.ALERT,
              confirmationModalButtonText: ConfirmationModalTexts.DELETE_LEASE_AREA.BUTTON,
              confirmationModalLabel: ConfirmationModalTexts.DELETE_LEASE_AREA.LABEL,
              confirmationModalTitle: ConfirmationModalTexts.DELETE_LEASE_AREA.TITLE
            });
          };

          if (plots[index]) {
            change(`${field}.plot`, plots[index].id);
            change(`${field}.estate_id`, plots[index].estate_id);
          }

          return <Row key={index}>
                  <Column>
                    <FieldAndRemoveButtonWrapper field={<Authorization allow={isFieldAllowedToRead(attributes, 'estate_ids.child.children.estate_id')}>
                          <EstateIdSelectInput onChange={estate_id => {
                  if (estate_id && estate_id.value) {
                    change(`${field}.estate_id`, estate_id.value);
                    change(`${field}.plot`, estate_id.id);
                  }
                }} disabled={false} name={`estate_id`} initialValues={estateIds[index]} />
                          <div style={{
                  display: 'none'
                }}>
                            <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'estate_ids.child.children.estate_id')} invisibleLabel name={`${field}.estate_id`} />
                          </div>
                          <div style={{
                  display: 'none'
                }}>
                            <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'plots.child.children.id')} invisibleLabel name={`${field}.plot`} />
                          </div>
                        </Authorization>} removeButton={<RemoveButton className='third-level' onClick={handleRemove} title='Poista kohde' />} />
                  </Column>
                </Row>;
        })}
            <Row>
              <Column>
                <AddButtonThird label='Lisää kohde' onClick={handleAdd} />
              </Column>
            </Row>
          </div>;
    }}
    </AppConsumer>;
};

type Props = {
  attributes: Attributes;
  landUseAgreementAttachmentAttributes: Attributes;
  landUseAgreementAttachmentMethods: MethodsType;
  basicInformationCollapseState: boolean;
  change: (...args: Array<any>) => any;
  isSaveClicked: boolean;
  receiveCollapseStates: (...args: Array<any>) => any;
  createLandUseAgreementAttachment: (...args: Array<any>) => any;
  deleteLandUseAgreementAttachment: (...args: Array<any>) => any;
  receiveFormValidFlags: (...args: Array<any>) => any;
  valid: boolean;
  currentLandUseContract: LandUseContract;
};

class BasicInformationEdit extends Component<Props> {
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

  handleBasicInformationCollapseToggle = (val: boolean) => {
    const {
      receiveCollapseStates
    } = this.props;
    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [formName]: {
          basic_information: val
        }
      }
    });
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
        type: 'general'
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
      landUseAgreementAttachmentAttributes,
      landUseAgreementAttachmentMethods,
      basicInformationCollapseState,
      isSaveClicked,
      change,
      currentLandUseContract
    } = this.props;
    const attachments = get(currentLandUseContract, 'attachments', []).filter(file => file.type === 'general');
    const estateIds = get(currentLandUseContract, 'estate_ids');
    const plots = get(currentLandUseContract, 'plots');
    return <form>
        <h2>Perustiedot</h2>
        <Divider />
        <Collapse defaultOpen={basicInformationCollapseState !== undefined ? basicInformationCollapseState : true} headerTitle='Perustiedot' onToggle={this.handleBasicInformationCollapseToggle}>
          <Row>
            <Authorization allow={isFieldAllowedToRead(attributes, 'estate_ids')}>
              <Column small={6} medium={4} large={2}>
                <FieldArray attributes={attributes} component={renderAreas} isSaveClicked={isSaveClicked} name='estate_ids' enableUiDataEdit change={change} uiDataKey={getUiDataLandUseContractKey('estate_ids')} estateIds={estateIds} plots={plots} />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'definition')}>
              <Column small={6} medium={4} large={2}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'definition')} name='definition' enableUiDataEdit uiDataKey={getUiDataLandUseContractKey('definition')} />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'preparer')}>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle title='Valmistelijat' />
                <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'preparer')} invisibleLabel name='preparer' overrideValues={{
                fieldType: FieldTypes.USER,
                label: 'Valmistelija 1'
              }} enableUiDataEdit uiDataKey={getUiDataLandUseContractKey('preparer')} />
                <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'preparer')} invisibleLabel name='preparer2' overrideValues={{
                fieldType: FieldTypes.USER,
                label: 'Valmistelija 2'
              }} />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'type')}>
              <Column small={6} medium={4} large={2}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'type')} name='type' overrideValues={{
                label: 'Maankäyttösopimuksen tyyppi'
              }} enableUiDataEdit uiDataKey={getUiDataLandUseContractKey('type')} />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'status')}>
              <Column small={6} medium={4} large={2}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'status')} name='status' overrideValues={{
                label: 'Maankäyttösopimuksen tila'
              }} enableUiDataEdit uiDataKey={getUiDataLandUseContractKey('status')} />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'estimated_completion_year')}>
              <Column small={6} medium={4} large={2}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'estimated_completion_year')} name='estimated_completion_year' overrideValues={{
                label: 'Arvioitu toteutumisvuosi'
              }} enableUiDataEdit uiDataKey={getUiDataLandUseContractKey('estimated_completion_year')} />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'estimated_introduction_year')}>
              <Column small={6} medium={4} large={2}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'estimated_introduction_year')} name='estimated_introduction_year' overrideValues={{
                label: 'Arvioitu esittelyvuosi'
              }} enableUiDataEdit uiDataKey={getUiDataLandUseContractKey('estimated_introduction_year')} />
              </Column>
            </Authorization>
          </Row>

          <SubTitle>Osoitteet</SubTitle>
          <FieldArray component={renderAddresses} attributes={attributes} isSaveClicked={isSaveClicked} disabled={isSaveClicked} formName={FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION} name={'addresses'} />

          <Authorization allow={isMethodAllowed(landUseAgreementAttachmentMethods, Methods.GET)}>
            {!!currentLandUseContract.id && <AppConsumer>
                {({
              dispatch
            }) => {
              return <Fragment>
                      <SubTitle enableUiDataEdit uiDataKey={getUiDataLandUseAgreementAttachmentKey(LandUseAgreementAttachmentFieldPaths.ATTACHMENTS)}>
                        {'Liitetiedostot'}
                      </SubTitle>

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

          <SubTitle>Asemakaavatiedot</SubTitle>
          <Row>
            <Authorization allow={isFieldAllowedToRead(attributes, 'plan_reference_number')}>
              <Column small={6} medium={4} large={2}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'plan_reference_number')} name='plan_reference_number' validate={referenceNumber} overrideValues={{
                label: 'Asemakaavan diaarinumero',
                fieldType: FieldTypes.REFERENCE_NUMBER
              }} enableUiDataEdit uiDataKey={getUiDataLandUseContractKey('plan_reference_number')} />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'plan_number')}>
              <Column small={6} medium={4} large={2}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'plan_number')} name='plan_number' overrideValues={{
                label: 'Asemakaavan numero'
              }} enableUiDataEdit uiDataKey={getUiDataLandUseContractKey('plan_number')} />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'state')}>
              <Column small={6} medium={4} large={2}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'state')} name='state' overrideValues={{
                label: 'Asemakaavan käsittelyvaihe'
              }} enableUiDataEdit uiDataKey={getUiDataLandUseContractKey('state')} />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'plan_acceptor')}>
              <Column small={6} medium={4} large={2}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'plan_acceptor')} name='plan_acceptor' overrideValues={{
                label: 'Asemakaavan hyväksyjä'
              }} enableUiDataEdit uiDataKey={getUiDataLandUseContractKey('plan_acceptor')} />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'plan_lawfulness_date')}>
              <Column small={6} medium={4} large={2}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'plan_lawfulness_date')} name='plan_lawfulness_date' overrideValues={{
                label: 'Asemakaavan lainvoimaisuuspvm'
              }} enableUiDataEdit uiDataKey={getUiDataLandUseContractKey('plan_lawfulness_date')} />
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'project_area')}>
              <Column small={6} medium={4} large={2}>
                <FormField disableTouched={isSaveClicked} fieldAttributes={get(attributes, 'project_area')} name='project_area' overrideValues={{
                label: 'Hankealue'
              }} enableUiDataEdit uiDataKey={getUiDataLandUseContractKey('project_area')} />
              </Column>
            </Authorization>
          </Row>
        </Collapse>
      </form>;
  }

}

const formName = FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION;
export default flowRight(connect(state => {
  return {
    attributes: getAttributes(state),
    basicInformationCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${formName}.basic_information`),
    isSaveClicked: getIsSaveClicked(state),
    currentLandUseContract: getCurrentLandUseContract(state),
    landUseAgreementAttachmentMethods: getLandUseAgreementAttachmentMethods(state),
    landUseAgreementAttachmentAttributes: getLandUseAgreementAttachmentAttributes(state)
  };
}, {
  receiveCollapseStates,
  receiveFormValidFlags,
  createLandUseAgreementAttachment,
  deleteLandUseAgreementAttachment
}), reduxForm({
  form: formName,
  destroyOnUnmount: false,
  change
}))(BasicInformationEdit) as React.ComponentType<any>;