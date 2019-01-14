// @flow
import React, {Fragment} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';
import get from 'lodash/get';

import Authorization from '$components/authorization/Authorization';
import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import CollapseHeaderSubtitle from '$components/collapse/CollapseHeaderSubtitle';
import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import ListItem from '$components/content/ListItem';
import SubTitle from '$components/content/SubTitle';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {
  ConstructabilityStatus,
  FormNames,
  LeaseAreaAddressesFieldPaths,
  LeaseAreasFieldPaths,
  LeaseAreasFieldTitles,
  LeaseConstructabilityDescriptionsFieldPaths,
  LeaseConstructabilityDescriptionsFieldTitles,
} from '$src/leases/enums';
import {getFullAddress} from '$src/leases/helpers';
import {
  formatDate,
  formatNumber,
  getLabelOfOption,
  getReferenceNumberLink,
  isEmptyValue,
  isFieldAllowedToRead,
} from '$util/helpers';
import {getUserFullName} from '$src/users/helpers';
import {getAttributes, getCollapseStateByKey} from '$src/leases/selectors';

import type {Attributes} from '$src/types';

type CommentsProps = {
  attributes: Attributes,
  comments: ?Array<Object>,
}

const Comments = ({
  attributes,
  comments,
}: CommentsProps) =>
  <Fragment>
    <SubTitle>{LeaseConstructabilityDescriptionsFieldTitles.CONSTRUCTABILITY_DESCRIPTIONS}</SubTitle>
    {comments && !!comments.length
      ? (
        <BoxItemContainer>
          {comments.map((comment) =>
            <BoxItem
              className='no-border-on-last-child'
              key={comment.id}>
              <Row>
                <Column small={12}>
                  <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.AHJO_REFERENCE_NUMBER)}>
                    <ListItem>{comment.text || ''}</ListItem>
                  </Authorization>
                  <FormText>
                    <strong>{getUserFullName(comment.user)}</strong>
                    {comment.modified_at && `, ${formatDate(comment.modified_at)}`}
                    <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.AHJO_REFERENCE_NUMBER)}>
                      {comment.ahjo_reference_number &&
                        <span>,&nbsp;
                          <ExternalLink
                            className='no-margin'
                            href={getReferenceNumberLink(comment.ahjo_reference_number)}
                            text={comment.ahjo_reference_number}
                          />
                        </span>
                      }
                    </Authorization>
                  </FormText>
                </Column>
              </Row>
            </BoxItem>
          )}
        </BoxItemContainer>
      ) : (
        <FormText><em>Ei huomautuksia.</em></FormText>
      )
    }
  </Fragment>;

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
  attributes: Attributes,
  constructabilityReportCollapseState: boolean,
  constructabilityReportInvestigationStateOptions: Array<Object>,
  constructabilityStateOptions: Array<Object>,
  demolitionCollapseState: boolean,
  locationOptions: Array<Object>,
  otherCollapseState: boolean,
  pollutedLandCollapseState: boolean,
  pollutedLandRentConditionStateOptions: Array<Object>,
  preconstructionCollapseState: boolean,
  receiveCollapseStates: Function,
  typeOptions: Array<Object>,
}

const ConstructabilityItem = ({
  area,
  areaCollapseState,
  attributes,
  constructabilityReportCollapseState,
  constructabilityReportInvestigationStateOptions,
  constructabilityStateOptions,
  demolitionCollapseState,
  locationOptions,
  otherCollapseState,
  pollutedLandCollapseState,
  pollutedLandRentConditionStateOptions,
  preconstructionCollapseState,
  receiveCollapseStates,
  typeOptions,
}: Props) => {
  const handleAreaCollapseToggle = (val: boolean) => {
    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.CONSTRUCTABILITY]: {
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
        [FormNames.CONSTRUCTABILITY]: {
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
        [FormNames.CONSTRUCTABILITY]: {
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
        [FormNames.CONSTRUCTABILITY]: {
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
        [FormNames.CONSTRUCTABILITY]: {
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
        [FormNames.CONSTRUCTABILITY]: {
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
      headerSubtitles={
        <Fragment>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.TYPE)}>
              <CollapseHeaderSubtitle>{getLabelOfOption(typeOptions, area.type) || '-'}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreaAddressesFieldPaths.ADDRESSES)}>
              <CollapseHeaderSubtitle>{getFullAddress(area)}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>
          <Column>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.AREA)}>
              <CollapseHeaderSubtitle>{!isEmptyValue(area.area) ? `${formatNumber(area.area)} m²` : '-'}{area.location ? ` / ${getLabelOfOption(locationOptions, area.location)}` : ''}</CollapseHeaderSubtitle>
            </Authorization>
          </Column>
        </Fragment>
      }
      headerTitle={
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.IDENTIFIER)}>
          {area.identifier || '-'}
        </Authorization>
      }
      onToggle={handleAreaCollapseToggle}
      showTitleOnOpen
    >
      <Collapse
        className='collapse__secondary'
        defaultOpen={preconstructionCollapseState !== undefined ? preconstructionCollapseState : false}
        headerSubtitles={
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.PRECONSTRUCTION_STATE)}>
            <Column>
              <StatusIndicator
                researchState={area.preconstruction_state}
                stateOptions={constructabilityStateOptions}
              />
            </Column>
          </Authorization>
        }
        headerTitle='Esirakentaminen, johtosiirrot ja kunnallistekniikka'
        onToggle={handlePreconstructionCollapseToggle}
        showTitleOnOpen={true}
      >
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS)}>
          <Comments attributes={attributes} comments={area.descriptionsPreconstruction} />
        </Authorization>
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={demolitionCollapseState !== undefined ? demolitionCollapseState : false}
        headerSubtitles={
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.DEMOLITION_STATE)}>
            <Column>
              <StatusIndicator
                researchState={area.demolition_state}
                stateOptions={constructabilityStateOptions}
              />
            </Column>
          </Authorization>
        }
        headerTitle='Purku'
        onToggle={handleDemolitionCollapseToggle}
        showTitleOnOpen={true}
      >
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS)}>
          <Comments attributes={attributes} comments={area.descriptionsDemolition} />
        </Authorization>
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={pollutedLandCollapseState !== undefined ? pollutedLandCollapseState : false}
        headerSubtitles={
          <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_STATE)}>
            <Column>
              <StatusIndicator
                researchState={area.polluted_land_state}
                stateOptions={constructabilityStateOptions}
              />
            </Column>
          </Authorization>
        }
        headerTitle='Pima ja jäte'
        onToggle={handlePollutedLandCollapseToggle}
        showTitleOnOpen={true}
      >
        <Row>
          <Column small={6} medium={3} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_RENT_CONDITION_STATE)}>
              <FormTextTitle>{LeaseAreasFieldTitles.POLLUTED_LAND_RENT_CONDITION_STATE}</FormTextTitle>
              <FormText>{getLabelOfOption(pollutedLandRentConditionStateOptions, area.polluted_land_rent_condition_state) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={3} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_RENT_CONDITION_DATE)}>
              <FormTextTitle>{LeaseAreasFieldTitles.POLLUTED_LAND_RENT_CONDITION_DATE}</FormTextTitle>
              <FormText>{formatDate(area.polluted_land_rent_condition_date) || '–'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={3} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_PLANNER)}>
              <FormTextTitle>{LeaseAreasFieldTitles.POLLUTED_LAND_PLANNER}</FormTextTitle>
              <FormText>{getUserFullName(area.polluted_land_planner) || '–'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={3} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_PROJECTWISE_NUMBER)}>
              <FormTextTitle>{LeaseAreasFieldTitles.POLLUTED_LAND_PROJECTWISE_NUMBER}</FormTextTitle>
              <FormText>{area.polluted_land_projectwise_number || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={3} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.POLLUTED_LAND_MATTI_REPORT_NUMBER)}>
              <FormTextTitle>{LeaseAreasFieldTitles.POLLUTED_LAND_MATTI_REPORT_NUMBER}</FormTextTitle>
              <FormText>{area.polluted_land_matti_report_number || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>

        <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS)}>
          <Comments attributes={attributes} comments={area.descriptionsPollutedLand} />
        </Authorization>
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={constructabilityReportCollapseState !== undefined ? constructabilityReportCollapseState : false}
        headerSubtitles={
          <Column>
            <StatusIndicator
              researchState={area.constructability_report_state}
              stateOptions={constructabilityStateOptions}
            />
          </Column>
        }
        headerTitle='Rakennettavuusselvitys'
        onToggle={handleConstructabilityReportCollapseToggle}
        showTitleOnOpen={true}
      >
        <Row>
          <Column small={6} medium={3} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_INVESTIGATION_STATE)}>
              <FormTextTitle>{LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT_INVESTIGATION_STATE}</FormTextTitle>
              <FormText>{getLabelOfOption(constructabilityReportInvestigationStateOptions, area.constructability_report_investigation_state) || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={3} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_SIGNING_DATE)}>
              <FormTextTitle>{LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT_SIGNING_DATE}</FormTextTitle>
              <FormText>{formatDate(area.constructability_report_signing_date) || '–'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={3} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_SIGNER)}>
              <FormTextTitle>{LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT_SIGNER}</FormTextTitle>
              <FormText>{area.constructability_report_signer || '-'}</FormText>
            </Authorization>
          </Column>
          <Column small={6} medium={3} large={2}>
            <Authorization allow={isFieldAllowedToRead(attributes, LeaseAreasFieldPaths.CONSTRUCTABILITY_REPORT_GEOTECHNICAL_NUMBER)}>
              <FormTextTitle>{LeaseAreasFieldTitles.CONSTRUCTABILITY_REPORT_GEOTECHNICAL_NUMBER}</FormTextTitle>
              <FormText>{area.constructability_report_geotechnical_number || '-'}</FormText>
            </Authorization>
          </Column>
        </Row>

        <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS)}>
          <Comments attributes={attributes} comments={area.descriptionsReport} />
        </Authorization>
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={otherCollapseState !== undefined ? otherCollapseState : false}
        headerSubtitles={
          <Column>
            <StatusIndicator
              researchState={area.other_state}
              stateOptions={constructabilityStateOptions}
            />
          </Column>
        }
        headerTitle='Muut'
        onToggle={handleOtherCollapseToggle}
        showTitleOnOpen={true}
      >
        <Authorization allow={isFieldAllowedToRead(attributes, LeaseConstructabilityDescriptionsFieldPaths.CONSTRUCTABILITY_DESCRIPTIONS)}>
          <Comments attributes={attributes} comments={area.descriptionsOther} />
        </Authorization>
      </Collapse>
    </Collapse>
  );
};

export default connect(
  (state, props) => {
    const id = get(props, 'area.id');

    return {
      areaCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.CONSTRUCTABILITY}.${id}.area`),
      attributes: getAttributes(state),
      constructabilityReportCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.CONSTRUCTABILITY}.${id}.constructability_report`),
      demolitionCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.CONSTRUCTABILITY}.${id}.demolition`),
      otherCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.CONSTRUCTABILITY}.${id}.other`),
      pollutedLandCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.CONSTRUCTABILITY}.${id}.polluted_land`),
      preconstructionCollapseState: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.CONSTRUCTABILITY}.${id}.preconstruction`),
    };
  },
  {
    receiveCollapseStates,
  }
)(ConstructabilityItem);
