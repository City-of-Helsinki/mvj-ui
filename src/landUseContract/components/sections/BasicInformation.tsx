import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import Authorization from "/src/components/authorization/Authorization";
import Collapse from "/src/components/collapse/Collapse";
import Divider from "/src/components/content/Divider";
import ExternalLink from "/src/components/links/ExternalLink";
import FormText from "/src/components/form/FormText";
import FormTextTitle from "/src/components/form/FormTextTitle";
import ListItem from "/src/components/content/ListItem";
import ListItems from "/src/components/content/ListItems";
import SubTitle from "/src/components/content/SubTitle";
import { receiveCollapseStates } from "/src/landUseContract/actions";
import { FormNames, ViewModes } from "enums";
import { LandUseAgreementAttachmentFieldPaths } from "/src/landUseAgreementAttachment/enums";
import { getContentBasicInformation } from "/src/landUseContract/helpers";
import { getUserFullName } from "users/helpers";
import { formatDate, getFieldOptions, getLabelOfOption, getReferenceNumberLink, isFieldAllowedToRead } from "util/helpers";
import { getAttributes, getCollapseStateByKey, getCurrentLandUseContract } from "/src/landUseContract/selectors";
import { getUiDataLandUseContractKey, getUiDataLandUseAgreementAttachmentKey } from "/src/uiData/helpers";
import { getAttributes as getLandUseAgreementAttachmentAttributes } from "/src/landUseAgreementAttachment/selectors";
import type { Attributes } from "types";
import type { LandUseContract } from "/src/landUseContract/types";
import FileDownloadLink from "/src/components/file/FileDownloadLink";
type Props = {
  attributes: Attributes;
  basicInformationCollapseState: boolean;
  currentLandUseContract: LandUseContract;
  receiveCollapseStates: (...args: Array<any>) => any;
  landUseAgreementAttachmentAttributes: Attributes;
};

const BasicInformation = ({
  attributes,
  basicInformationCollapseState,
  currentLandUseContract,
  receiveCollapseStates,
  landUseAgreementAttachmentAttributes
}: Props) => {
  const handleBasicInformationCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION]: {
          basic_information: val
        }
      }
    });
  };

  const basicInformation = getContentBasicInformation(currentLandUseContract),
        stateOptions = getFieldOptions(attributes, 'state'),
        planAcceptorOptions = getFieldOptions(attributes, 'plan_acceptor'),
        landUseContractTypeOptions = getFieldOptions(attributes, 'type'),
        landUseContractDefinitionOptions = getFieldOptions(attributes, 'definition'),
        landUseContractStatusOptions = getFieldOptions(attributes, 'status'),
        attachments = get(currentLandUseContract, 'attachments', []).filter(file => file.type === 'general');
  return <Fragment>
      <h2>Perustiedot</h2>
      <Divider />
      <Collapse defaultOpen={basicInformationCollapseState !== undefined ? basicInformationCollapseState : true} headerTitle='Perustiedot' onToggle={handleBasicInformationCollapseToggle}>
        <Row>
          <Authorization allow={isFieldAllowedToRead(attributes, 'estate_ids')}>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle title='Kiinteistötunnus' uiDataKey={getUiDataLandUseContractKey('estate_ids')} />
              {!!basicInformation.estate_ids && !!basicInformation.estate_ids.length ? <ListItems>
                  {basicInformation.estate_ids.map((estate_id, index) => <ListItem key={index}>{estate_id.estate_id || '-'}</ListItem>)}
                </ListItems> : <FormText>-</FormText>}
            </Column>
          </Authorization>
          <Authorization allow={isFieldAllowedToRead(attributes, 'definition')}>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={getUiDataLandUseContractKey('definition')}>
                {get(attributes, 'definition.label') || 'Maankäyttösopimuksen määritelmä'}
              </FormTextTitle>
              <FormText>{getLabelOfOption(landUseContractDefinitionOptions, basicInformation.definition) || '-'}</FormText>
            </Column>
          </Authorization>
          <Authorization allow={isFieldAllowedToRead(attributes, 'preparer')}>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle title='Valmistelijat' uiDataKey={getUiDataLandUseContractKey('preparer')} />
              <ListItems>
                <ListItem>{getUserFullName(basicInformation.preparer) || '-'}</ListItem>
                <ListItem>{getUserFullName(basicInformation.preparer2) || '-'}</ListItem>
              </ListItems>
            </Column>
          </Authorization>
          <Authorization allow={isFieldAllowedToRead(attributes, 'type')}>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={getUiDataLandUseContractKey('type')}>
                {'Maankäyttösopimuksen tyyppi'}
              </FormTextTitle>
              <FormText>{getLabelOfOption(landUseContractTypeOptions, basicInformation.type) || '-'}</FormText>
            </Column>
          </Authorization>
          <Authorization allow={isFieldAllowedToRead(attributes, 'status')}>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={getUiDataLandUseContractKey('status')}>
                {'Maankäyttösopimuksen tila'}
              </FormTextTitle>
              <FormText>{getLabelOfOption(landUseContractStatusOptions, basicInformation.status) || '-'}</FormText>
            </Column>
          </Authorization>
          <Authorization allow={isFieldAllowedToRead(attributes, 'estimated_completion_year')}>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={getUiDataLandUseContractKey('estimated_completion_year')}>
                {'Arvioitu toteutumisvuosi'}
              </FormTextTitle>
              <FormText>{basicInformation.estimated_completion_year || '-'}</FormText>
            </Column>
          </Authorization>
          <Authorization allow={isFieldAllowedToRead(attributes, 'estimated_introduction_year')}>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={getUiDataLandUseContractKey('estimated_introduction_year')}>
                {'Arvioitu esittelyvuosi'}
              </FormTextTitle>
              <FormText>{basicInformation.estimated_introduction_year || '-'}</FormText>
            </Column>
          </Authorization>
        </Row>

        <SubTitle>Osoitteet</SubTitle>
        {basicInformation.addresses && basicInformation.addresses.map((address, index) => <Row key={index}>
            <Authorization allow={isFieldAllowedToRead(attributes, 'addresses.child.children.address')}>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle uiDataKey={getUiDataLandUseContractKey('addresses.child.children.address')}>
                  {'Osoite'}
                </FormTextTitle>
                <FormText>{address.address || '-'}</FormText>
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'addresses.child.children.postal_code')}>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle uiDataKey={getUiDataLandUseContractKey('addresses.child.children.postal_code')}>
                  {'Postinumero'}
                </FormTextTitle>
                <FormText>{address.postal_code || '-'}</FormText>
              </Column>
            </Authorization>

            <Authorization allow={isFieldAllowedToRead(attributes, 'addresses.child.children.city')}>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle uiDataKey={getUiDataLandUseContractKey('addresses.child.children.city')}>
                  {'Kaupunki'}
                </FormTextTitle>
                <FormText>{address.city || '-'}</FormText>
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, 'addresses.child.children.is_primary')}>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle uiDataKey={getUiDataLandUseContractKey('addresses.child.children.is_primary')}>
                  {'Ensisijainen osoite'}
                </FormTextTitle>
                <FormText>{address.is_primary ? 'Kyllä' : 'ei'}</FormText>
              </Column>
            </Authorization>
          </Row>)}

        {!attachments.length && <FormText>Ei liitetiedostoja</FormText>}
        {!!attachments.length && <Fragment>
            <Row>
              <Column small={3} large={4}>
                <Authorization allow={isFieldAllowedToRead(landUseAgreementAttachmentAttributes, LandUseAgreementAttachmentFieldPaths.FILE)}>
                  <FormTextTitle uiDataKey={getUiDataLandUseAgreementAttachmentKey(LandUseAgreementAttachmentFieldPaths.FILE)}>
                    {'Tiedoston nimi'}
                  </FormTextTitle>
                </Authorization>
              </Column>
              <Column small={3} large={2}>
                <Authorization allow={isFieldAllowedToRead(landUseAgreementAttachmentAttributes, LandUseAgreementAttachmentFieldPaths.UPLOADED_AT)}>
                  <FormTextTitle uiDataKey={getUiDataLandUseAgreementAttachmentKey(LandUseAgreementAttachmentFieldPaths.UPLOADED_AT)}>
                    {'Ladattu'}
                  </FormTextTitle>
                </Authorization>
              </Column>
              <Column small={3} large={2}>
                <FormTextTitle uiDataKey={getUiDataLandUseAgreementAttachmentKey(LandUseAgreementAttachmentFieldPaths.UPLOADER)}>
                  {'Lataaja'}
                </FormTextTitle>
              </Column>
            </Row>

            {attachments.map((file, index) => {
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
                </Row>;
        })}
          </Fragment>}

        <SubTitle>Asemakaavatiedot</SubTitle>
        <Row>
          <Authorization allow={isFieldAllowedToRead(attributes, 'plan_reference_number')}>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={getUiDataLandUseContractKey('plan_reference_number')}>
                {'Asemakaavan diaarinumero'}
              </FormTextTitle>
              <FormText>{basicInformation.plan_reference_number ? <ExternalLink className='no-margin' href={getReferenceNumberLink(basicInformation.plan_reference_number)} text={basicInformation.plan_reference_number} /> : '-'}</FormText>
            </Column>
          </Authorization>
          <Authorization allow={isFieldAllowedToRead(attributes, 'plan_number')}>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={getUiDataLandUseContractKey('plan_number')}>
                {'Asemakaavan numero'}
              </FormTextTitle>
              <FormText>{basicInformation.plan_number || '-'}</FormText>
            </Column>
          </Authorization>
          <Authorization allow={isFieldAllowedToRead(attributes, 'state')}>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={getUiDataLandUseContractKey('state')}>
                {'Asemakaavan käsittelyvaihe'}
              </FormTextTitle>
              <FormText>{getLabelOfOption(stateOptions, basicInformation.state) || '-'}</FormText>
            </Column>
          </Authorization>
          <Authorization allow={isFieldAllowedToRead(attributes, 'plan_acceptor')}>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={getUiDataLandUseContractKey('plan_acceptor')}>
                {'Asemakaavan hyväksyjä'}
              </FormTextTitle>
              <FormText>{getLabelOfOption(planAcceptorOptions, basicInformation.plan_acceptor) || '-'}</FormText>
            </Column>
          </Authorization>
          <Authorization allow={isFieldAllowedToRead(attributes, 'plan_lawfulness_date')}>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={getUiDataLandUseContractKey('plan_lawfulness_date')}>
                {'Asemakaavan lainvoimaisuuspvm'}
              </FormTextTitle>
              <FormText>{formatDate(basicInformation.plan_lawfulness_date) || '-'}</FormText>
            </Column>
          </Authorization>
          <Authorization allow={isFieldAllowedToRead(attributes, 'project_area')}>
            <Column small={6} medium={4} large={2}>
              <FormTextTitle uiDataKey={getUiDataLandUseContractKey('project_area')}>
                {'Hankealue'}
              </FormTextTitle>
              <FormText>{basicInformation.project_area || '-'}</FormText>
            </Column>
          </Authorization>
        </Row>
      </Collapse>
    </Fragment>;
};

export default connect(state => {
  return {
    attributes: getAttributes(state),
    basicInformationCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.LAND_USE_CONTRACT_BASIC_INFORMATION}.basic_information`),
    currentLandUseContract: getCurrentLandUseContract(state),
    landUseAgreementAttachmentAttributes: getLandUseAgreementAttachmentAttributes(state)
  };
}, {
  receiveCollapseStates
})(BasicInformation);