//@flow
import React from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import Authorization from '$components/authorization/Authorization';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import LeaseArea from './LeaseArea';
import LeaseAreaEdit from './LeaseAreaEdit';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames, LeaseAreasFieldPaths, LeaseAreasFieldTitles} from '$src/leases/enums';
import {formatDate, getFieldAttributes, isFieldAllowedToEdit, isFieldAllowedToRead} from '$util/helpers';
import {getLeaseAreaById} from '$src/leases/helpers';
import {
  getAttributes,
  getCollapseStateByKey,
  getCurrentLease,
  getErrorsByFormName,
  getIsSaveClicked,
} from '$src/leases/selectors';

import type {Attributes} from '$src/types';
import type {Lease} from '$src/leases/types';

type Props = {
  archivedAt: ?string,
  areaCollapseState: boolean,
  areaId: number,
  attributes: Attributes,
  currentLease: Lease,
  decisionOptions: Array<Object>,
  editedArea: Object,
  errors: ?Object,
  field: string,
  index: number,
  isActive: boolean,
  isSaveClicked: boolean,
  onArchive: Function,
  onRemove: Function,
  onUnarchive: Function,
  receiveCollapseStates: Function,
}

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
}: Props): Element<*> => {
  const handleArchive = () => {
    onArchive(index, editedArea);
  };

  const handleUnarchive = () => {
    onUnarchive(index, editedArea);
  };

  const handleAreaCollapseToggle = (val: boolean) => {
    if(!areaId) {return;}

    receiveCollapseStates({
      [ViewModes.EDIT]: {
        [FormNames.LEASE_AREAS]: {
          [areaId]: {
            area: val,
          },
        },
      },
    });
  };

  const savedArea = getLeaseAreaById(currentLease, areaId);
  const areaErrors = get(errors, field);

  return (
    <Collapse
      className={classNames({'not-active': !isActive})}
      defaultOpen={areaCollapseState !== undefined ? areaCollapseState : isActive}
      hasErrors={isSaveClicked && !isEmpty(areaErrors)}
      headerTitle={
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.IDENTIFIER)}>
          {savedArea ? (savedArea.identifier || '-') : '-'}
        </Authorization>
      }
      onArchive={(isFieldAllowedToEdit(attributes, LeaseAreasFieldPaths.ARCHIVED_AT) && isActive && areaId)
        ? handleArchive
        : null
      }
      onRemove={isFieldAllowedToEdit(attributes, LeaseAreasFieldPaths.LEASE_AREAS) ? onRemove : null}
      onUnarchive={(isFieldAllowedToEdit(attributes, LeaseAreasFieldPaths.ARCHIVED_AT) && !isActive && areaId)
        ? handleUnarchive
        : null
      }
      onToggle={handleAreaCollapseToggle}
    >
      {isActive &&
        <LeaseAreaEdit
          field={field}
          index={index}
          savedArea={savedArea}
        />
      }

      {!isActive && <LeaseArea area={savedArea} />}
      {!isActive && <Divider className='lease-area-divider'/>}
      {!isActive &&
        <Row>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.ARCHIVED_AT)}>
              <FormTextTitle>{LeaseAreasFieldTitles.ARCHIVED_AT}</FormTextTitle>
              <FormText>{formatDate(archivedAt) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={4} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.ARCHIVED_DECISION)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.ARCHIVED_DECISION)}
                name={`${field}.archived_decision`}
                overrideValues={{
                  label: LeaseAreasFieldTitles.ARCHIVED_DECISION,
                  options: decisionOptions,
                }}
              />
            </Authorization>
          </Column>
          <Column small={12} medium={4} large={8}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.ARCHIVED_NOTE)}>
              <FormField
                disableTouched={isSaveClicked}
                fieldAttributes={getFieldAttributes(attributes, LeaseAreasFieldPaths.ARCHIVED_NOTE)}
                name={`${field}.archived_note`}
                overrideValues={{label: LeaseAreasFieldTitles.ARCHIVED_NOTE}}
              />
            </Authorization>
          </Column>
        </Row>
      }
    </Collapse>
  );
};


const formName = FormNames.LEASE_AREAS;
const selector = formValueSelector(formName);

export default connect(
  (state, props) => {
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
    };
  },
  {
    receiveCollapseStates,
  }
)(LeaseAreaWithArchiveInfoEdit);
