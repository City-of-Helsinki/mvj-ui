import React, { Fragment } from "react";
import { Row, Column } from "react-foundation";
import Authorization from "/src/components/authorization/Authorization";
import FileDownloadLink from "/src/components/file/FileDownloadLink";
import FormText from "/src/components/form/FormText";
import FormTextTitle from "/src/components/form/FormTextTitle";
import ShowMore from "/src/components/showMore/ShowMore";
import SubTitle from "/src/components/content/SubTitle";
import { LeaseInspectionAttachmentsFieldPaths, LeaseInspectionAttachmentsFieldTitles, LeaseInspectionsFieldPaths, LeaseInspectionsFieldTitles } from "/src/leases/enums";
import { getUiDataLeaseKey } from "/src/uiData/helpers";
import { formatDate, isFieldAllowedToRead } from "/src/util/helpers";
import { getUserFullName } from "/src/users/helpers";
import type { Attributes } from "types";
type Props = {
  inspection: Record<string, any>;
  leaseAttributes: Attributes;
};

const InspectionItem = ({
  inspection,
  leaseAttributes
}: Props) => {
  const inspectionAttachments = inspection.attachments;
  return <Fragment>
      <Row>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseInspectionsFieldPaths.INSPECTOR)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseInspectionsFieldPaths.INSPECTOR)}>
              {LeaseInspectionsFieldTitles.INSPECTOR}
            </FormTextTitle>
            <FormText>{inspection.inspector || '–'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseInspectionsFieldPaths.SUPERVISION_DATE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseInspectionsFieldPaths.SUPERVISION_DATE)}>
              {LeaseInspectionsFieldTitles.SUPERVISION_DATE}
            </FormTextTitle>
            <FormText className={inspection.supervision_date && !inspection.supervised_date ? 'alert' : ''}>{inspection.supervision_date ? <span><i />{formatDate(inspection.supervision_date)}</span> : '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4} large={2}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseInspectionsFieldPaths.SUPERVISED_DATE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseInspectionsFieldPaths.SUPERVISED_DATE)}>
              {LeaseInspectionsFieldTitles.SUPERVISED_DATE}
            </FormTextTitle>
            <FormText className={inspection.supervised_date ? 'success' : ''}>{inspection.supervised_date ? <span><i />{formatDate(inspection.supervised_date)}</span> : '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={12} large={6}>
          <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseInspectionsFieldPaths.DESCRIPTION)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseInspectionsFieldPaths.DESCRIPTION)}>
              {LeaseInspectionsFieldTitles.DESCRIPTION}
            </FormTextTitle>
            <ShowMore text={inspection.description || '–'} />
          </Authorization>
        </Column>
      </Row>

      <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseInspectionAttachmentsFieldPaths.ATTACHMENTS)}>
        <SubTitle enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseInspectionAttachmentsFieldPaths.ATTACHMENTS)}>
          {LeaseInspectionAttachmentsFieldTitles.ATTACHMENTS}
        </SubTitle>

        {!inspectionAttachments.length && <FormText>Ei tiedostoja</FormText>}

        {!!inspectionAttachments.length && <Fragment>
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
          return <Row key={index}>
                  <Column small={3} large={4}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseInspectionAttachmentsFieldPaths.FILE)}>
                      <FileDownloadLink fileUrl={file.file} label={file.filename} />
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <Authorization allow={isFieldAllowedToRead(leaseAttributes, LeaseInspectionAttachmentsFieldPaths.UPLOADED_AT)}>
                      <FormText>{formatDate(file.uploaded_at) || '-'}</FormText>
                    </Authorization>
                  </Column>
                  <Column small={3} large={2}>
                    <FormText>{getUserFullName(file.uploader) || '-'}</FormText>
                  </Column>
                </Row>;
        })}
          </Fragment>}
      </Authorization>
    </Fragment>;
};

export default InspectionItem;