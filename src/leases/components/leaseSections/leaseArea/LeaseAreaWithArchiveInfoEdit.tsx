import React, { Fragment, ReactElement } from "react";
import { connect } from "react-redux";
import { formValueSelector } from "redux-form";
import { Row, Column } from "react-foundation";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";
import Authorization from "/src/components/authorization/Authorization";
import Collapse from "/src/components/collapse/Collapse";
import CollapseHeaderSubtitle from "/src/components/collapse/CollapseHeaderSubtitle";
import Divider from "/src/components/content/Divider";
import FormField from "/src/components/form/FormField";
import FormText from "/src/components/form/FormText";
import FormTextTitle from "/src/components/form/FormTextTitle";
import LeaseArea from "./LeaseArea";
import LeaseAreaEdit from "./LeaseAreaEdit";
import { receiveCollapseStates } from "/src/leases/actions";
import { FormNames, ViewModes } from "enums";
import { LeaseAreasFieldPaths, LeaseAreasFieldTitles, LeaseAreaAddressesFieldPaths } from "/src/leases/enums";
import { UsersPermissions } from "usersPermissions/enums";
import { getFullAddress, getLeaseAreaById } from "/src/leases/helpers";
import { formatDate, formatNumber, getFieldAttributes, getFieldOptions, getLabelOfOption, hasPermissions, isFieldAllowedToEdit, isFieldAllowedToRead } from "util/helpers";
import { getUiDataLeaseKey } from "/src/uiData/helpers";
import { getAttributes, getCollapseStateByKey, getCurrentLease, getErrorsByFormName, getIsSaveClicked } from "/src/leases/selectors";
import { getUsersPermissions } from "usersPermissions/selectors";
import type { Attributes } from "types";
import type { Lease } from "/src/leases/types";
import type { UsersPermissions as UsersPermissionsType } from "usersPermissions/types";
type Props = {
  archivedAt: string | null | undefined;
  areaCollapseState: boolean;
  areaId: number;
  attributes: Attributes;
  currentLease: Lease;
  decisionOptions: Array<Record<string, any>>;
  editedArea: Record<string, any>;
  errors: Record<string, any> | null | undefined;
  field: string;
  index: number;
  isActive: boolean;
  isSaveClicked: boolean;
  onArchive: (...args: Array<any>) => any;
  onRemove: (...args: Array<any>) => any;
  onUnarchive: (...args: Array<any>) => any;
  receiveCollapseStates: (...args: Array<any>) => any;
  usersPermissions: UsersPermissionsType;
};

const LeaseAreaWithArchiveInfoEdit = ({
  archivedAt,
  areaCollapseState,
  areaId,
  attributes,
  currentLease,
  decisionOptions,
  editedArea,
  errors,
  field,
  index,
  isActive,
  isSaveClicked,
  onArchive,
  onRemove,
  onUnarchive,
  receiveCollapseStates,
  usersPermissions
}: Props): ReactElement => {
  const handleArchive = () => {
    onArchive(index, editedArea);
  };

  const handleUnarchive = () => {
    onUnarchive(index, editedArea);
  };

  const handleAreaCollapseToggle = (val: boolean) => {
    if (!areaId) {
      return;
    }

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.LEASE_AREAS]: {
          [areaId]: {
            area: val
          }
        }
      }
    });
  };

  const typeOptions = getFieldOptions(attributes, LeaseAreasFieldPaths.TYPE);
  const locationOptions = getFieldOptions(attributes, LeaseAreasFieldPaths.LOCATION);
  const savedArea = getLeaseAreaById(currentLease, areaId);
  const archived = Boolean(savedArea && savedArea.archived_at);
  const areaErrors = get(errors, field);
  return <Collapse archived={archived} defaultOpen={areaCollapseState !== undefined ? areaCollapseState : !archived} hasErrors={isSaveClicked && !isEmpty(areaErrors)} headerSubtitles={savedArea && <Fragment>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.TYPE)}>
              <CollapseHeaderSubtitle>{getLabelOfOption(typeOptions, savedArea.type) || '-'}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.ADDRESSES)}>
              <CollapseHeaderSubtitle>{getFullAddress(get(savedArea, 'addresses[0]')) || '-'}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.AREA)}>
              <CollapseHeaderSubtitle>{formatNumber(savedArea.area) || '-'} m<sup>2</sup></CollapseHeaderSubtitle>
            </Authorization>
          </Column>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.LOCATION)}>
              <CollapseHeaderSubtitle>{getLabelOfOption(locationOptions, savedArea.location) || '-'}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>
        </Fragment>} headerTitle={<Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.IDENTIFIER)}>
          {savedArea ? savedArea.identifier || '-' : '-'}
        </Authorization>} onArchive={isFieldAllowedToEdit(attributes, LeaseAreasFieldPaths.ARCHIVED_AT) && isActive && areaId ? handleArchive : null} onRemove={hasPermissions(usersPermissions, UsersPermissions.DELETE_LEASEAREA) ? onRemove : null} onUnarchive={isFieldAllowedToEdit(attributes, LeaseAreasFieldPaths.ARCHIVED_AT) && !isActive && areaId ? handleUnarchive : null} onToggle={handleAreaCollapseToggle}>
      {isActive && <LeaseAreaEdit field={field} index={index} savedArea={savedArea} />}

      {!isActive && <LeaseArea area={savedArea} />}
      {!isActive && <Divider className='lease-area-divider' />}
      {!isActive && <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.ARCHIVED_AT)}>
              <FormTextTitle uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.ARCHIVED_AT)}>
                {LeaseAreasFieldTitles.ARCHIVED_AT}
              </FormTextTitle>
              <FormText>{formatDate(archivedAt) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.ARCHIVED_DECISION)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.ARCHIVED_DECISION)} name={`${field}.archived_decision`} overrideValues={{
            label: LeaseAreasFieldTitles.ARCHIVED_DECISION,
            options: decisionOptions
          }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.ARCHIVED_DECISION)} />
            </Authorization>
          </Column>
          <Column small={12} medium={4} large={8}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.ARCHIVED_NOTE)}>
              <FormField disableTouched={isSaveClicked} fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.ARCHIVED_NOTE)} name={`${field}.archived_note`} overrideValues={{
            label: LeaseAreasFieldTitles.ARCHIVED_NOTE
          }} enableUiDataEdit uiDataKey={getUiDataLeaseKey(LeaseAreasFieldPaths.ARCHIVED_NOTE)} />
            </Authorization>
          </Column>
        </Row>}
    </Collapse>;
};

const formName = FormNames.LEASE_AREAS;
const selector = formValueSelector(formName);
export default connect((state, props) => {
  const id = selector(state, `${props.field}.id`);
  return {
    archivedAt: selector(state, `${props.field}.archived_at`),
    areaCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.LEASE_AREAS}.${id}.area`),
    areaId: id,
    attributes: getAttributes(state),
    currentLease: getCurrentLease(state),
    editedArea: selector(state, props.field),
    errors: getErrorsByFormName(state, formName),
    isSaveClicked: getIsSaveClicked(state),
    usersPermissions: getUsersPermissions(state)
  };
}, {
  receiveCollapseStates
})(LeaseAreaWithArchiveInfoEdit);