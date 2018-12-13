//@flow
import React from 'react';
import {connect} from 'react-redux';
import {formValueSelector} from 'redux-form';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import type {Element} from 'react';

import Collapse from '$components/collapse/Collapse';
import CollapseHeaderTitle from '$components/collapse/CollapseHeaderTitle';
import Divider from '$components/content/Divider';
import FormField from '$components/form/FormField';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import LeaseArea from './LeaseArea';
import LeaseAreaEdit from './LeaseAreaEdit';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/leases/enums';
import {formatDate} from '$util/helpers';
import {getAttributes, getCollapseStateByKey, getErrorsByFormName, getIsSaveClicked} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type Props = {
  areaCollapseState: boolean,
  areasData: Array<Object>,
  areaId: number,
  attributes: Attributes,
  decisionOptions: Array<Object>,
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
  areaCollapseState,
  areasData,
  areaId,
  attributes,
  decisionOptions,
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
  const getAreaById = (id: number) => id ? areasData.find((area) => area.id === id) : {};

  const savedArea = getAreaById(areaId);

  const handleArchive = () => {
    onArchive(index, savedArea);
  };

  const handleUnarchive = () => {
    onUnarchive(index, savedArea);
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

  const areaErrors = get(errors, field);

  return (
    <Collapse
      className={classNames({'not-active': !isActive})}
      defaultOpen={areaCollapseState !== undefined ? areaCollapseState : isActive}
      hasErrors={isSaveClicked && !isEmpty(areaErrors)}
      headerTitle={<CollapseHeaderTitle>{savedArea ? (savedArea.identifier || '-') : '-'}</CollapseHeaderTitle>}
      onArchive={(isActive && savedArea && savedArea.id) ? handleArchive : null}
      onRemove={onRemove}
      onUnarchive={(!isActive && savedArea && savedArea.id) ? handleUnarchive : null}
      onToggle={handleAreaCollapseToggle}
    >
      {isActive &&
        <LeaseAreaEdit
          areasData={areasData}
          field={field}
          index={index}
          savedArea={savedArea}
        />
      }

      {!isActive &&
        <LeaseArea
          area={savedArea}
        />
      }
      {!isActive && <Divider className='lease-area-divider'/>}
      {!isActive &&
        <Row>
          <Column small={6} medium={4} large={2}>
            <FormTextTitle title='Arkistoitu' />
            <FormText>{formatDate(get(savedArea, 'archived_at')) || '-'}</FormText>
          </Column>
          <Column small={6} medium={4} large={2}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.archived_decision')}
              name={`${field}.archived_decision`}
              overrideValues={{
                label: 'Päätös',
                options: decisionOptions,
              }}
            />
          </Column>
          <Column small={12} medium={4} large={8}>
            <FormField
              disableTouched={isSaveClicked}
              fieldAttributes={get(attributes, 'lease_areas.child.children.archived_note')}
              name={`${field}.archived_note`}
              overrideValues={{
                label: 'Huomautus',
              }}
            />
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
      areaCollapseState: getCollapseStateByKey(state, `${ViewModes.EDIT}.${FormNames.LEASE_AREAS}.${id}.area`),
      areaId: id,
      attributes: getAttributes(state),
      errors: getErrorsByFormName(state, formName),
      isSaveClicked: getIsSaveClicked(state),
    };
  },
  {
    receiveCollapseStates,
  }
)(LeaseAreaWithArchiveInfoEdit);
