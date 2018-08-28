// @flow
import React from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';
import get from 'lodash/get';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import ExternalLink from '$components/links/ExternalLink';
import FormFieldLabel from '$components/form/FormFieldLabel';
import SubTitle from '$components/content/SubTitle';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {ConstructabilityStatus, FormNames} from '$src/leases/enums';
import {getFullAddress} from '$src/leases/helpers';
import {formatDate, formatNumber, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
import {getUserFullName} from '$src/users/helpers';
import {getCollapseStateByKey} from '$src/leases/selectors';

type CommentsProps = {
  comments: ?Array<Object>,
}

const Comments = ({
  comments,
}: CommentsProps) =>
  <div>
    <SubTitle>Huomautukset</SubTitle>
    {comments && !!comments.length
      ? (
        <BoxItemContainer>
          {comments.map((comment) =>
            <BoxItem
              className='no-border-on-last-child'
              key={comment.id}>
              <Row>
                <Column small={12}>
                  <p className='no-margin'>{comment.text || ''}</p>
                  <p>
                    <strong>{getUserFullName(comment.user)}</strong>
                    {comment.modified_at && `, ${formatDate(comment.modified_at)}`}
                    {comment.ahjo_reference_number &&
                      <span>,&nbsp;
                        <ExternalLink
                          className='no-margin'
                          href={getReferenceNumberLink(comment.ahjo_reference_number)}
                          label={comment.ahjo_reference_number}
                        />
                      </span>
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
  areaCollapseState: boolean,
  constructabilityReportCollapseState: boolean,
  constructabilityReportStateOptions: Array<Object>,
  demolitionCollapseState: boolean,
  locationOptions: Array<Object>,
  otherCollapseState: boolean,
  pollutedLandCollapseState: boolean,
  pollutedLandConditionStateOptions: Array<Object>,
  preconstructionCollapseState: boolean,
  receiveCollapseStates: Function,
  stateOptions: Array<Object>,
  typeOptions: Array<Object>,
}

const ConstructabilityItem = ({
  area,
  areaCollapseState,
  constructabilityReportCollapseState,
  constructabilityReportStateOptions,
  demolitionCollapseState,
  locationOptions,
  otherCollapseState,
  pollutedLandCollapseState,
  pollutedLandConditionStateOptions,
  preconstructionCollapseState,
  receiveCollapseStates,
  stateOptions,
  typeOptions,
}: Props) => {
  const handleAreaCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
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
    receiveCollapseStates({
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
    receiveCollapseStates({
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
    receiveCollapseStates({
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
    receiveCollapseStates({
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
    receiveCollapseStates({
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
      defaultOpen={areaCollapseState !== undefined ? areaCollapseState : true}
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
        defaultOpen={preconstructionCollapseState !== undefined ? preconstructionCollapseState : false}
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
        defaultOpen={demolitionCollapseState !== undefined ? demolitionCollapseState : false}
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
        defaultOpen={pollutedLandCollapseState !== undefined ? pollutedLandCollapseState : false}
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
        headerTitle={<h4 className='collapse__header-title'>Pima ja jäte</h4>}
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
        defaultOpen={constructabilityReportCollapseState !== undefined ? constructabilityReportCollapseState : false}
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
        defaultOpen={otherCollapseState !== undefined ? otherCollapseState : false}
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
    const id = get(props, 'area.id');

    return {
      areaCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.CONTRUCTABILITY}.${id}.area`),
      constructabilityReportCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.CONTRUCTABILITY}.${id}.constructability_report`),
      demolitionCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.CONTRUCTABILITY}.${id}.demolition`),
      otherCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.CONTRUCTABILITY}.${id}.other`),
      pollutedLandCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.CONTRUCTABILITY}.${id}.polluted_land`),
      preconstructionCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.CONTRUCTABILITY}.${id}.preconstruction`),
    };
  },
  {
    receiveCollapseStates,
  }
)(ConstructabilityItem);
