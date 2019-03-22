// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';

import Authorization from '$components/authorization/Authorization';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import ShowMore from '$components/showMore/ShowMore';
import {LeaseInspectionsFieldPaths, LeaseInspectionsFieldTitles} from '$src/leases/enums';
import {getUiDataLeaseKey} from '$src/uiData/helpers';
import {formatDate, isFieldAllowedToRead} from '$util/helpers';

import type {Attributes} from '$src/types';

type Props = {
  attributes: Attributes,
  inspection: Object,
  largeScreen?: boolean,
}

const InspectionItem = ({attributes, inspection, largeScreen}: Props) => {
  if(largeScreen) {
    return(
      <Row>
        <Column large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.INSPECTOR)}>
            <FormText>{inspection.inspector || '–'}</FormText>
          </Authorization>
        </Column>
        <Column large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.SUPERVISION_DATE)}>
            <FormText className={(inspection.supervision_date && !inspection.supervised_date) ? 'alert' : ''}>{inspection.supervision_date ? <span><i/>{formatDate(inspection.supervision_date)}</span> : '-'}</FormText>
          </Authorization>
        </Column>
        <Column large={2}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.SUPERVISED_DATE)}>
            <FormText className={inspection.supervised_date ? 'success' : ''}>{inspection.supervised_date ? <span><i/>{formatDate(inspection.supervised_date)}</span> : '-'}</FormText>
          </Authorization>
        </Column>
        <Column large={6}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.DESCRIPTION)}>
            <ShowMore text={inspection.description || '–'} />
          </Authorization>
        </Column>
      </Row>
    );
  } else {
    return (
      <Row>
        <Column small={6} medium={4}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.INSPECTOR)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseInspectionsFieldPaths.INSPECTOR)}>
              {LeaseInspectionsFieldTitles.INSPECTOR}
            </FormTextTitle>
            <FormText>{inspection.inspector || '–'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.SUPERVISION_DATE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseInspectionsFieldPaths.SUPERVISION_DATE)}>
              {LeaseInspectionsFieldTitles.SUPERVISION_DATE}
            </FormTextTitle>
            <FormText className={(inspection.supervision_date && !inspection.supervised_date) ? 'alert' : ''}>{inspection.supervision_date ? <span><i/>{formatDate(inspection.supervision_date)}</span> : '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={4}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.SUPERVISED_DATE)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseInspectionsFieldPaths.SUPERVISED_DATE)}>
              {LeaseInspectionsFieldTitles.SUPERVISED_DATE}
            </FormTextTitle>
            <FormText className={inspection.supervised_date ? 'success' : ''}>{inspection.supervised_date ? <span><i/>{formatDate(inspection.supervised_date)}</span> : '-'}</FormText>
          </Authorization>
        </Column>
        <Column small={6} medium={12}>
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseInspectionsFieldPaths.DESCRIPTION)}>
            <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseInspectionsFieldPaths.DESCRIPTION)}>
              {LeaseInspectionsFieldTitles.DESCRIPTION}
            </FormTextTitle>
            <ShowMore text={inspection.description || '–'} />
          </Authorization>
        </Column>
      </Row>
    );
  }
};

export default InspectionItem;
