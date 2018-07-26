// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import FormFieldLabel from '$components/form/FormFieldLabel';
import {receiveCollapseStatuses} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {ConstructabilityStatus, FormNames} from '$src/leases/enums';
import {getFullAddress} from '$src/leases/helpers';
import {formatDate, formatNumber, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
import {getUserFullName} from '$src/users/helpers';
import {getCollapseStatusByKey} from '$src/leases/selectors';

type CommentsProps = {
  comments: ?Array<Object>,
}

const Comments = ({
  comments,
}: CommentsProps) =>
  <div>
    {comments && !!comments.length
      ? (
        <BoxItemContainer>
          {comments.map((comment) =>
            <BoxItem
              key={comment.id}>
              <Row>
                <Column small={12}>
                  <p className='no-margin'>{comment.text || ''}</p>
                  <p>
                    <strong>{getUserFullName(comment.user)}</strong>
                    {comment.modified_at && `, ${formatDate(comment.modified_at)}`}
                    {comment.ahjo_reference_number &&
                      <span>, <a className='no-margin' target='_blank' href={getReferenceNumberLink(comment.ahjo_reference_number)}>{comment.ahjo_reference_number}</a></span>
                    }
                  </p>
                </Column>
              </Row>
            </BoxItem>
          )}
        </BoxItemContainer>
      ) : (
        <p><em>Ei huomautuksia.</em></p>
      )
    }
  </div>;

type StatusIndicatorProps = {
  researchState: string,
  stateOptions: Array<Object>,
}

const StatusIndicator = ({researchState, stateOptions}: StatusIndicatorProps) =>
  <div>
    <div className={
      classNames(
        {'collapse__header-neutral': !researchState || researchState === ConstructabilityStatus.UNVERIFIED},
        {'collapse__header-alert': researchState === ConstructabilityStatus.REQUIRES_MEASURES},
        {'collapse__header-success': researchState === ConstructabilityStatus.COMPLETE}
      )
    }>
      <i/>
      <span>
        {getLabelOfOption(stateOptions, researchState || ConstructabilityStatus.UNVERIFIED)}
      </span>
    </div>
  </div>;


type Props = {
  area: Object,
  areaCollapseStatus: boolean,
  constructabilityReportCollapseStatus: boolean,
  constructabilityReportStateOptions: Array<Object>,
  demolitionCollapseStatus: boolean,
  locationOptions: Array<Object>,
  otherCollapseStatus: boolean,
  pollutedLandCollapseStatus: boolean,
  pollutedLandConditionStateOptions: Array<Object>,
  preconstructionCollapseStatus: boolean,
  receiveCollapseStatuses: Function,
  stateOptions: Array<Object>,
  typeOptions: Array<Object>,
}

const ConstructabilityItem = ({
  area,
  areaCollapseStatus,
  constructabilityReportCollapseStatus,
  constructabilityReportStateOptions,
  demolitionCollapseStatus,
  locationOptions,
  otherCollapseStatus,
  pollutedLandCollapseStatus,
  pollutedLandConditionStateOptions,
  preconstructionCollapseStatus,
  receiveCollapseStatuses,
  stateOptions,
  typeOptions,
}: Props) => {
  const handleAreaCollapseToggle = (val: boolean) => {
    receiveCollapseStatuses({
      [ViewModes.READONLY]: {
        [FormNames.CONTRUCTABILITY]: {
          [area.id]: {
            area: val,
          },
        },
      },
    });
  };

  const handlePreconstructionCollapseToggle = (val: boolean) => {
    receiveCollapseStatuses({
      [ViewModes.READONLY]: {
        [FormNames.CONTRUCTABILITY]: {
          [area.id]: {
            preconstruction: val,
          },
        },
      },
    });
  };

  const handleDemolitionCollapseToggle = (val: boolean) => {
    receiveCollapseStatuses({
      [ViewModes.READONLY]: {
        [FormNames.CONTRUCTABILITY]: {
          [area.id]: {
            demolition: val,
          },
        },
      },
    });
  };

  const handlePollutedLandCollapseToggle = (val: boolean) => {
    receiveCollapseStatuses({
      [ViewModes.READONLY]: {
        [FormNames.CONTRUCTABILITY]: {
          [area.id]: {
            polluted_land: val,
          },
        },
      },
    });
  };

  const handleConstructabilityReportCollapseToggle = (val: boolean) => {
    receiveCollapseStatuses({
      [ViewModes.READONLY]: {
        [FormNames.CONTRUCTABILITY]: {
          [area.id]: {
            constructability_report: val,
          },
        },
      },
    });
  };

  const handleOtherCollapseToggle = (val: boolean) => {
    receiveCollapseStatuses({
      [ViewModes.READONLY]: {
        [FormNames.CONTRUCTABILITY]: {
          [area.id]: {
            other: val,
          },
        },
      },
    });
  };

  return (
    <Collapse key={area.id}
      defaultOpen={areaCollapseStatus !== undefined ? areaCollapseStatus : true}
      header={
        <div>
          <Column>
            <span className='collapse__header-subtitle'>
              {getLabelOfOption(typeOptions, area.type) || '-'}
            </span>
          </Column>
          <Column>
            <span className='collapse__header-subtitle'>
              {getFullAddress(area)}
            </span>
          </Column>
          <Column>
            <span className='collapse__header-subtitle'>
              {formatNumber(area.area)} m<sup>2</sup> / {getLabelOfOption(locationOptions, area.location)}
            </span>
          </Column>
        </div>
      }
      headerTitle={<h3 className='collapse__header-title'>{area.identifier || '-'}</h3>}
      onToggle={handleAreaCollapseToggle}
    >
      <Collapse
        className='collapse__secondary'
        defaultOpen={preconstructionCollapseStatus !== undefined ? preconstructionCollapseStatus : false}
        header={
          <div>
            <Column>
              <StatusIndicator
                researchState={area.preconstruction_state}
                stateOptions={stateOptions}
              />
            </Column>
          </div>
        }
        headerTitle={<h4 className='collapse__header-title'>Esirakentaminen, johtosiirrot ja kunnallistekniikka</h4>}
        onToggle={handlePreconstructionCollapseToggle}
        showTitleOnOpen={true}
      >
        <Comments
          comments={area.descriptionsPreconstruction}
        />
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={demolitionCollapseStatus !== undefined ? demolitionCollapseStatus : false}
        header={
          <div>
            <Column>
              <StatusIndicator
                researchState={area.demolition_state}
                stateOptions={stateOptions}
              />
            </Column>
          </div>
        }
        headerTitle={<h4 className='collapse__header-title'>Purku</h4>}
        onToggle={handleDemolitionCollapseToggle}
        showTitleOnOpen={true}
      >
        <Comments
          comments={area.descriptionsDemolition}
        />
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={pollutedLandCollapseStatus !== undefined ? pollutedLandCollapseStatus : false}
        header={
          <div>
            <Column>
              <StatusIndicator
                researchState={area.polluted_land_state}
                stateOptions={stateOptions}
              />
            </Column>
          </div>
        }
        headerTitle={<h4 className='collapse__header-title'>Pima</h4>}
        onToggle={handlePollutedLandCollapseToggle}
        showTitleOnOpen={true}
      >
        <div>
          <Row>
            <Column small={6} medium={3} large={2}>
              <FormFieldLabel>Vuokraehdot</FormFieldLabel>
              <p>{getLabelOfOption(pollutedLandConditionStateOptions, area.polluted_land_rent_condition_state) || '-'}</p>
            </Column>
            <Column small={6} medium={3} large={2}>
              <FormFieldLabel>Pvm</FormFieldLabel>
              <p>{formatDate(area.polluted_land_rent_condition_date) || '–'}</p>
            </Column>
            <Column small={6} medium={3} large={2}>
              <FormFieldLabel>PIMA valmistelija</FormFieldLabel>
              <p>{getUserFullName(area.polluted_land_planner) || '–'}</p>
            </Column>
            <Column small={6} medium={3} large={2}>
              <FormFieldLabel>ProjectWise numero</FormFieldLabel>
              <p>{area.polluted_land_projectwise_number || '-'}</p>
            </Column>
            <Column small={6} medium={3} large={2}>
              <FormFieldLabel>Matti raportti</FormFieldLabel>
              <p>{area.polluted_land_matti_report_number || '-'}</p>
            </Column>
          </Row>
        </div>
        <Comments
          comments={area.descriptionsPollutedLand}
        />
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={constructabilityReportCollapseStatus !== undefined ? constructabilityReportCollapseStatus : false}
        header={
          <div>
            <Column>
              <StatusIndicator
                researchState={area.constructability_report_state}
                stateOptions={stateOptions}
              />
            </Column>
          </div>
        }
        headerTitle={<h4 className='collapse__header-title'>Rakennettavuusselvitys</h4>}
        onToggle={handleConstructabilityReportCollapseToggle}
        showTitleOnOpen={true}
      >
        <div>
          <Row>
            <Column small={6} medium={3} large={2}>
              <FormFieldLabel>Selvitys</FormFieldLabel>
              <p>{getLabelOfOption(constructabilityReportStateOptions, area.constructability_report_investigation_state) || '-'}</p>
            </Column>
            <Column small={6} medium={3} large={2}>
              <FormFieldLabel>Allekirjoituspvm</FormFieldLabel>
              <p>{formatDate(area.constructability_report_signing_date) || '–'}</p>
            </Column>
            <Column small={6} medium={3} large={2}>
              <FormFieldLabel>Allekirjoittaja</FormFieldLabel>
              <p>{area.constructability_report_signer || '-'}</p>
            </Column>
            <Column small={6} medium={3} large={2}>
              <FormFieldLabel>Geoteknisen palvelun tiedosto</FormFieldLabel>
              <p>{area.constructability_report_geotechnical_number || '-'}</p>
            </Column>
          </Row>
        </div>
        <Comments
          comments={area.descriptionsReport}
        />
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={otherCollapseStatus !== undefined ? otherCollapseStatus : false}
        header={
          <div>
            <Column>
              <StatusIndicator
                researchState={area.other_state}
                stateOptions={stateOptions}
              />
            </Column>
          </div>
        }
        headerTitle={<h4 className='collapse__header-title'>Muut</h4>}
        onToggle={handleOtherCollapseToggle}
        showTitleOnOpen={true}
      >
        <Comments
          comments={area.descriptionsOther}
        />
      </Collapse>
    </Collapse>
  );
};

export default connect(
  (state, props) => {
    const id = props.area.id;

    return {
      areaCollapseStatus: getCollapseStatusByKey(state, `${ViewModes.READONLY}.${FormNames.CONTRUCTABILITY}.${id}.area`),
      constructabilityReportCollapseStatus: getCollapseStatusByKey(state, `${ViewModes.READONLY}.${FormNames.CONTRUCTABILITY}.${id}.constructability_report`),
      demolitionCollapseStatus: getCollapseStatusByKey(state, `${ViewModes.READONLY}.${FormNames.CONTRUCTABILITY}.${id}.demolition`),
      otherCollapseStatus: getCollapseStatusByKey(state, `${ViewModes.READONLY}.${FormNames.CONTRUCTABILITY}.${id}.other`),
      pollutedLandCollapseStatus: getCollapseStatusByKey(state, `${ViewModes.READONLY}.${FormNames.CONTRUCTABILITY}.${id}.polluted_land`),
      preconstructionCollapseStatus: getCollapseStatusByKey(state, `${ViewModes.READONLY}.${FormNames.CONTRUCTABILITY}.${id}.preconstruction`),
    };
  },
  {
    receiveCollapseStatuses,
  }
)(ConstructabilityItem);
