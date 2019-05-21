// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';

import {ActionTypes, AppConsumer} from '$src/app/AppContext';
import ActionButtonWrapper from '$components/form/ActionButtonWrapper';
import AddFileButton from '$components/form/AddFileButton';
import Authorization from '$components/authorization/Authorization';
import BoxItem from '$components/content/BoxItem';
import FileDownloadLink from '$components/file/FileDownloadLink';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import RemoveButton from '$components/form/RemoveButton';
import SubTitle from '$components/content/SubTitle';
import {createLeaseInspectionAttachment, deleteLeaseInspectionAttachment} from '$src/leaseInspectionAttachment/actions';
import {DeleteModalLabels, DeleteModalTitles, FormNames} from '$src/enums';
import {ButtonColors, FieldTypes} from '$components/enums';
import {
  LeaseInspectionAttachmentsFieldPaths,
  LeaseInspectionAttachmentsFieldTitles,
  LeaseInspectionsFieldPaths,
  LeaseInspectionsFieldTitles,
} from '$src/leases/enums';
import {UsersPermissions} from '$src/usersPermissions/enums';
import {getContentInspections} from '$src/leases/helpers';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {getUserFullName} from '$src/users/helpers';
import {
  findItemById,
  formatDate,
  getFieldAttributes,
  hasPermissions,
  isFieldAllowedToRead,
} from '$util/helpers';
import {
  getAttributes as getLeaseAttributes,
  getCurrentLease,
  getIsSaveClicked,
} from '$src/leases/selectors';
import {getUsersPermissions} from '$src/usersPermissions/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';
import type {UsersPermissions as UsersPermissionsType} from '$src/usersPermissions/types';

type Props = {
  createLeaseInspectionAttachment: Function,
  currentLease: Lease,
  deleteLeaseInspectionAttachment: Function,
  field: any,
  inspectionId: ?number,
  isSaveClicked: boolean,
  leaseAttributes: Attributes,
  onRemove: Function,
  usersPermissions: UsersPermissionsType,
}

const InspectionItemEdit = ({
  createLeaseInspectionAttachment,
  currentLease,
  deleteLeaseInspectionAttachment,
  field,
  inspectionId,
  isSaveClicked,
  leaseAttributes,
  onRemove,
  usersPermissions,
}: Props) => {
  const handleAddInspectionAttachment = (e: any) => {
    if(!inspectionId) return;

    createLeaseInspectionAttachment({
      lease: currentLease.id,
      data: {
        inspection: inspectionId,
      },
      file: e.target.files[0],
    });
  };

  const handleDeleteInspectionAttachment = (fileId: number) => {
    deleteLeaseInspectionAttachment({
      id: fileId,
      lease: currentLease.id,
    });
  };

  const inspections = getContentInspections(currentLease);
  const inspection = inspectionId ? findItemById(inspections, inspectionId) : null;
  const inspectionAttachments = inspection ? inspection.attachments : [];

  return (
    <AppConsumer>
      {({dispatch}) => {
        return(
          <BoxItem className='no-border-on-first-child'>
            <ActionButtonWrapper>
              <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_INSPECTION)}>
                <RemoveButton
                  onClick={onRemove}
                  title="Poista tarkastus"
                />
              </Authorization>
            </ActionButtonWrapper>
            <Row>
              <Column small={6} medium={4} large={2}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseInspectionsFieldPaths.INSPECTOR)}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(leaseAttributes, LeaseInspectionsFieldPaths.INSPECTOR)}
                    name={`${field}.inspector`}
                    overrideValues={{label: LeaseInspectionsFieldTitles.INSPECTOR}}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(LeaseInspectionsFieldPaths.INSPECTOR)}
                  />
                </Authorization>
              </Column>
              <Column small={6} medium={4} large={2}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseInspectionsFieldPaths.SUPERVISION_DATE)}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(leaseAttributes, LeaseInspectionsFieldPaths.SUPERVISION_DATE)}
                    name={`${field}.supervision_date`}
                    overrideValues={{label: LeaseInspectionsFieldTitles.SUPERVISION_DATE}}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(LeaseInspectionsFieldPaths.SUPERVISION_DATE)}
                  />
                </Authorization>
              </Column>
              <Column small={6} medium={4} large={2}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseInspectionsFieldPaths.SUPERVISED_DATE)}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(leaseAttributes, LeaseInspectionsFieldPaths.SUPERVISED_DATE)}
                    name={`${field}.supervised_date`}
                    overrideValues={{label: LeaseInspectionsFieldTitles.SUPERVISED_DATE}}
                    enableUiDataEdit
                    uiDataKey={getUiDataLeaseKey(LeaseInspectionsFieldPaths.SUPERVISED_DATE)}
                  />
                </Authorization>
              </Column>
              <Column small={6} medium={12} large={6}>
                <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseInspectionsFieldPaths.DESCRIPTION)}>
                  <FormField
                    disableTouched={isSaveClicked}
                    fieldAttributes={getFieldAttributes(leaseAttributes, LeaseInspectionsFieldPaths.DESCRIPTION)}
                    name={`${field}.description`}
                    enableUiDataEdit
                    tooltipStyle={{right: 25}}
                    uiDataKey={getUiDataLeaseKey(LeaseInspectionsFieldPaths.DESCRIPTION)}
                    overrideValues={{
                      fieldType: FieldTypes.TEXTAREA,
                      label: LeaseInspectionsFieldTitles.DESCRIPTION,
                    }}
                  />
                </Authorization>
              </Column>
            </Row>
            {inspectionId &&
              <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseInspectionAttachmentsFieldPaths.ATTACHMENTS)}>
                <SubTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseInspectionAttachmentsFieldPaths.ATTACHMENTS)}>
                  {LeaseInspectionAttachmentsFieldTitles.ATTACHMENTS}
                </SubTitle>

                {!hasPermissions(usersPermissions, UsersPermissions.ADD_INSPECTIONATTACHMENT) && !inspectionAttachments.length &&
                  <FormText>Ei tiedostoja</FormText>
                }

                {!!inspectionAttachments.length &&
                  <Fragment>
                    <Row>
                      <Column small={3} large={4}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseInspectionAttachmentsFieldPaths.FILE)}>
                          <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseInspectionAttachmentsFieldPaths.FILE)}>
                            {LeaseInspectionAttachmentsFieldTitles.FILE}
                          </FormTextTitle>
                        </Authorization>
                      </Column>
                      <Column small={3} large={2}>
                        <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseInspectionAttachmentsFieldPaths.UPLOADED_AT)}>
                          <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseInspectionAttachmentsFieldPaths.UPLOADED_AT)}>
                            {LeaseInspectionAttachmentsFieldTitles.UPLOADED_AT}
                          </FormTextTitle>
                        </Authorization>
                      </Column>
                      <Column small={3} large={2}>
                        <FormTextTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseInspectionAttachmentsFieldPaths.UPLOADER)}>
                          {LeaseInspectionAttachmentsFieldTitles.UPLOADER}
                        </FormTextTitle>
                      </Column>
                    </Row>
                    {inspectionAttachments.map((file, index) => {
                      const handleRemove = () => {
                        dispatch({
                          type: ActionTypes.SHOW_CONFIRMATION_MODAL,
                          confirmationFunction: () => {
                            handleDeleteInspectionAttachment(file.id);
                          },
                          confirmationModalButtonClassName: ButtonColors.ALERT,
                          confirmationModalButtonText: 'Poista',
                          confirmationModalLabel: DeleteModalLabels.LEASE_INSPECTION_ATTACHMENT,
                          confirmationModalTitle: DeleteModalTitles.LEASE_INSPECTION_ATTACHMENT,
                        });
                      };

                      return (
                        <Row key={index}>
                          <Column small={3} large={4}>
                            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseInspectionAttachmentsFieldPaths.FILE)}>
                              <FileDownloadLink
                                fileUrl={file.file}
                                label={file.filename}
                              />
                            </Authorization>
                          </Column>
                          <Column small={3} large={2}>
                            <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseInspectionAttachmentsFieldPaths.UPLOADED_AT)}>
                              <FormText>{formatDate(file.uploaded_at) || '-'}</FormText>
                            </Authorization>
                          </Column>
                          <Column small={3} large={2}>
                            <FormText>{getUserFullName((file.uploader)) || '-'}</FormText>
                          </Column>
                          <Column small={3} large={2}>
                            <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.DELETE_INSPECTIONATTACHMENT)}>
                              <RemoveButton
                                className='third-level'
                                onClick={handleRemove}
                                style={{right: 12, height: 'unset'}}
                                title="Poista liitetiedosto"
                              />
                            </Authorization>
                          </Column>
                        </Row>
                      );
                    })}
                  </Fragment>
                }

                <Authorization allow={hasPermissions(usersPermissions, UsersPermissions.ADD_INSPECTIONATTACHMENT)}>
                  <AddFileButton
                    label='Lisää tiedosto'
                    name={`add_inspection_attachment_button_${inspectionId}`}
                    onChange={handleAddInspectionAttachment}
                  />
                </Authorization>
              </Authorization>
            }
          </BoxItem>
        );
      }}
    </AppConsumer>
  );
};

const selector = formValueSelector(FormNames.LEASE_INSPECTIONS);

export default connect(
  (state, props) => {
    return {
      currentLease: getCurrentLease(state),
      inspectionId: selector(state, `${props.field}.id`),
      isSaveClicked: getIsSaveClicked(state),
      leaseAttributes: getLeaseAttributes(state),
      usersPermissions: getUsersPermissions(state),
    };
  },
  {
    createLeaseInspectionAttachment,
    deleteLeaseInspectionAttachment,
  }
)(InspectionItemEdit);
