import React, { PureComponent, Fragment } from "react";
import { Column, Row } from "react-foundation";
import flowRight from "lodash/flowRight";
import { connect } from "react-redux";
import get from "lodash/get";
import { formatDate, getFieldOptions, getLabelOfOption, isFieldAllowedToRead } from "/src/util/helpers";
import Authorization from "/src/components/authorization/Authorization";
import FormTextTitle from "/src/components/form/FormTextTitle";
import FormText from "/src/components/form/FormText";
import FileDownloadLink from "/src/components/file/FileDownloadLink";
import type { RootState } from "/src/root/types";
import type { Attributes } from "types";
import { getUserFullName } from "/src/users/helpers";
import PlotApplicationInfoCheckCollapse from "/src/plotApplications/components/infoCheck/PlotApplicationInfoCheckCollapse";
import { getApplicationRelatedPlotSearch, getApplicationTargetInfoCheckData } from "/src/plotApplications/selectors";
import { PlotApplicationTargetInfoCheckFieldPaths, PlotApplicationTargetInfoCheckFieldTitles } from "/src/plotApplications/enums";
import { getInitialTargetInfoCheckValues, getMeetingMemoDownloadLink } from "/src/plotApplications/helpers";
import { getAttributes } from "/src/application/selectors";
type TargetSubFieldSetProps = {
  values: any;
  attributes: Attributes;
};

class PlotApplicationTargetInfoCheckManagements extends PureComponent<TargetSubFieldSetProps> {
  render() {
    const {
      values,
      attributes
    } = this.props;
    const financingOptions = getFieldOptions(attributes, PlotApplicationTargetInfoCheckFieldPaths.PROPOSED_MANAGEMENT_FINANCING) || [];
    const typeOptions = getFieldOptions(attributes, PlotApplicationTargetInfoCheckFieldPaths.PROPOSED_MANAGEMENT_TYPE) || [];
    const hitasOptions = getFieldOptions(attributes, PlotApplicationTargetInfoCheckFieldPaths.PROPOSED_MANAGEMENT_HITAS) || [];
    return <div role="table">
        <Row>
          <Column small={4} medium={4} large={2} role="columnheader">
            <FormTextTitle>
              {PlotApplicationTargetInfoCheckFieldTitles.PROPOSED_MANAGEMENT_FINANCING}
            </FormTextTitle>
          </Column>
          <Column small={4} medium={4} large={2} role="columnheader">
            <FormTextTitle>
              {PlotApplicationTargetInfoCheckFieldTitles.PROPOSED_MANAGEMENT_TYPE}
            </FormTextTitle>
          </Column>
          <Column small={3} medium={3} large={2} role="columnheader">
            <FormTextTitle>
              {PlotApplicationTargetInfoCheckFieldTitles.PROPOSED_MANAGEMENT_HITAS}
            </FormTextTitle>
          </Column>
          <Column small={1} medium={1} large={6} />
        </Row>
        {values.length > 0 ? values.map((management, index) => {
        return <Row role="row" key={index}>
            <Column role="cell" small={4} medium={4} large={2}>
              <FormText>
                {getLabelOfOption(typeOptions, management.proposed_management) || '-'}
              </FormText>
            </Column>
            <Column role="cell" small={4} medium={4} large={2}>
              <FormText>
                {getLabelOfOption(financingOptions, management.proposed_financing) || '-'}
              </FormText>
            </Column>
            <Column role="cell" small={3} medium={3} large={2}>
              <FormText>
                {getLabelOfOption(hitasOptions, management.hitas) || '-'}
              </FormText>
            </Column>
          </Row>;
      }) : <FormText>Ei lisättyjä hallinta- ja rahoitusmuotoja.</FormText>}
      </div>;
  }

}

class PlotApplicationTargetInfoCheckConditions extends PureComponent<TargetSubFieldSetProps> {
  render() {
    const {
      values
    } = this.props;
    // can be null
    const conditions = values || [];
    return <div role="table">
        <Row>
          <Column small={12} medium={12} large={12} role="columnheader">
            <FormTextTitle>
              {PlotApplicationTargetInfoCheckFieldTitles.RESERVATION_CONDITIONS}
            </FormTextTitle>
          </Column>
        </Row>
        {conditions.length > 0 ? values.map((condition, index) => {
        return <Row role="row" key={index}>
            <Column role="cell" small={12}>
              <FormText>
                {condition}
              </FormText>
            </Column>
          </Row>;
      }) : <FormText>Ei lisättyjä ehtoja.</FormText>}
      </div>;
  }

}

const PlotApplicationTargetInfoCheckMeetingMemos = ({
  values,
  meetingMemoAttributes
}: TargetSubFieldSetProps & {
  meetingMemoAttributes: Attributes;
}) => {
  return <div role="table">
    <Row>
      <Column small={12} medium={12} large={12} role="columnheader">
        <FormTextTitle>
          Kokous-/neuvottelumuistiot
        </FormTextTitle>
      </Column>
      <Column large={1} />
    </Row>
    {values.length > 0 ? <Fragment>
        <Row>
          <Column small={3} large={4}>
            <Authorization allow={isFieldAllowedToRead(meetingMemoAttributes, 'meeting_memo')}>
              <FormTextTitle>
                {PlotApplicationTargetInfoCheckFieldTitles.MEETING_MEMO_NAME}
              </FormTextTitle>
            </Authorization>
          </Column>
          <Column small={3} large={2}>
            <Authorization allow={isFieldAllowedToRead(meetingMemoAttributes, 'created_at')}>
              <FormTextTitle>
                {PlotApplicationTargetInfoCheckFieldTitles.MEETING_MEMO_UPLOAD_DATE}
              </FormTextTitle>
            </Authorization>
          </Column>
          <Column small={4} large={2}>
            <FormTextTitle>
              {PlotApplicationTargetInfoCheckFieldTitles.MEETING_MEMO_UPLOADED_BY}
            </FormTextTitle>
          </Column>
        </Row>
        {values.map((entry, index) => {
        return <Row key={index}>
              <Column small={3} large={4}>
                <Authorization allow={isFieldAllowedToRead(meetingMemoAttributes, 'name')}>
                  {
                /* not having an associated file shouldn't be possible, but just in case */
              }
                  {entry.meeting_memo ? <FileDownloadLink fileUrl={getMeetingMemoDownloadLink(entry.id)} label={entry.name} /> : '-'}
                </Authorization>
              </Column>
              <Column small={3} large={2}>
                <Authorization allow={isFieldAllowedToRead(meetingMemoAttributes, 'created_at')}>
                  <FormText>{formatDate(entry.created_at) || '-'}</FormText>
                </Authorization>
              </Column>
              <Column small={4} large={2}>
                <FormText>{getUserFullName(entry.user) || '-'}</FormText>
              </Column>
            </Row>;
      })}
      </Fragment> : <FormText>Ei lisättyjä muistioita.</FormText>}
  </div>;
};

type OwnProps = {
  targetId: number;
  section?: any;
  identifier?: any;
};
type Props = OwnProps & {
  attributes: Attributes;
  meetingMemoAttributes: Attributes;
  editTargetInfoCheckItem: (...args: Array<any>) => any;
  values: Record<string, any>;
};

class PlotApplicationTargetInfoCheck extends PureComponent<Props> {
  render(): React.ReactNode {
    const {
      attributes,
      values
    } = this.props;
    const declineReasonOptions = getFieldOptions(attributes, PlotApplicationTargetInfoCheckFieldPaths.DECLINE_REASON) || [];
    return <PlotApplicationInfoCheckCollapse className="PlotApplicationTargetInfoCheck" headerTitle="Kohteen käsittelytiedot">
        <form>
          <Row>
            <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationTargetInfoCheckFieldPaths.RESERVED)}>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle>
                  {PlotApplicationTargetInfoCheckFieldTitles.RESERVED}
                </FormTextTitle>
                <FormText>
                  {values.reserved ? 'Kyllä' : 'Ei'}
                </FormText>
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationTargetInfoCheckFieldPaths.SHARE_OF_RENT_INDICATOR)}>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle>
                  {PlotApplicationTargetInfoCheckFieldTitles.SHARE_OF_RENT}
                </FormTextTitle>
                <FormText>
                  {values.share_of_rental_indicator || '-'} / {values.share_of_rental_denominator || '-'}
                </FormText>
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationTargetInfoCheckFieldPaths.NEGOTIATION_DATE)}>
              <Column small={6} medium={4} large={2}>
                <FormTextTitle>
                  {PlotApplicationTargetInfoCheckFieldTitles.NEGOTIATION_DATE}
                </FormTextTitle>
                <FormText>
                  {formatDate(values.counsel_date) || '-'}
                </FormText>
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationTargetInfoCheckFieldPaths.DECLINE_REASON)}>
              <Column small={6} medium={4} large={3}>
                <FormTextTitle>
                  {PlotApplicationTargetInfoCheckFieldTitles.DECLINE_REASON}
                </FormTextTitle>
                <FormText>
                  {getLabelOfOption(declineReasonOptions, values.decline_reason) || '-'}
                </FormText>
              </Column>
            </Authorization>
            <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationTargetInfoCheckFieldPaths.ADDED_TARGET_TO_APPLICANT)}>
              <Column small={6} medium={4} large={3}>
                <FormTextTitle>
                  {PlotApplicationTargetInfoCheckFieldTitles.ADDED_TARGET_TO_APPLICANT}
                </FormTextTitle>
                <FormText>
                  {values.added_target_to_applicant ? 'Kyllä' : 'Ei'}
                </FormText>
              </Column>
            </Authorization>
          </Row>
          <Row>
            <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationTargetInfoCheckFieldPaths.PROPOSED_MANAGEMENTS)}>
              <Column small={12} medium={12} large={12}>
                <PlotApplicationTargetInfoCheckManagements values={values.proposed_managements} attributes={attributes} />
              </Column>
            </Authorization>
          </Row>
          <Row>
            <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationTargetInfoCheckFieldPaths.RESERVATION_CONDITIONS)}>
              <Column small={12} medium={12} large={12}>
                <PlotApplicationTargetInfoCheckConditions values={values.reservation_conditions} attributes={attributes} />
              </Column>
            </Authorization>
          </Row>
          <Row>
            <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationTargetInfoCheckFieldPaths.ARGUMENTS)}>
              <Column small={12} medium={12} large={12}>
                <FormTextTitle>
                  {PlotApplicationTargetInfoCheckFieldTitles.ARGUMENTS}
                </FormTextTitle>
                <FormText>
                  {values.arguments || '-'}
                </FormText>
              </Column>
            </Authorization>
          </Row>
          <Row>
            <Authorization allow={isFieldAllowedToRead(attributes, PlotApplicationTargetInfoCheckFieldPaths.MEETING_MEMOS)}>
              <Column small={12} medium={12} large={12}>
                <PlotApplicationTargetInfoCheckMeetingMemos values={values.meeting_memos} attributes={attributes} meetingMemoAttributes={get(attributes, PlotApplicationTargetInfoCheckFieldPaths.MEETING_MEMOS)} />
              </Column>
            </Authorization>
          </Row>
        </form>
      </PlotApplicationInfoCheckCollapse>;
  }

}

export default (flowRight(connect((state: RootState, props: Props) => ({
  attributes: getAttributes(state),
  // @ts-ignore: getApplicationTargetInfoCheckData expects array, should fix
  values: getInitialTargetInfoCheckValues(getApplicationRelatedPlotSearch(state), getApplicationTargetInfoCheckData(state), props.targetId)
})))(PlotApplicationTargetInfoCheck) as React.ComponentType<OwnProps>);