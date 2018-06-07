// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import {formatDate, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
import {getUserFullName} from '$src/users/helpers';
import {ConstructabilityStatus} from '$src/leases/enums';

type CommentsProps = {
  comments: ?Array<Object>,
}

const Comments = ({
  comments,
}: CommentsProps) => {
  return (
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
    </div>
  );
};

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
  constructabilityReportStateOptions: Array<Object>,
  pollutedLandConditionStateOptions: Array<Object>,
  stateOptions: Array<Object>,
}

const ConstructabilityItem = ({
  area,
  constructabilityReportStateOptions,
  pollutedLandConditionStateOptions,
  stateOptions,
}: Props) => {
  return (
    <div>
      <Collapse
        className='collapse__secondary'
        defaultOpen={false}
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
        headerTitle={
          <h4 className='collapse__header-title'>Esirakentaminen, johtosiirrot ja kunnallistekniikka</h4>
        }
        showTitleOnOpen={true}
      >
        <Comments
          comments={area.descriptionsPreconstruction}
        />
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={false}
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
        headerTitle={
          <h4 className='collapse__header-title'>Purku</h4>
        }
        showTitleOnOpen={true}
      >
        <Comments
          comments={area.descriptionsDemolition}
        />
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={false}
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
        headerTitle={
          <h4 className='collapse__header-title'>Pima</h4>
        }
        showTitleOnOpen={true}
      >
        <div>
          <Row>
            <Column small={6} medium={3} large={2}>
              <label>Vuokraehdot</label>
              <p>{getLabelOfOption(pollutedLandConditionStateOptions, area.polluted_land_rent_condition_state) || '-'}</p>
            </Column>
            <Column small={6} medium={3} large={2}>
              <label>Pvm</label>
              <p>{formatDate(area.polluted_land_rent_condition_date) || '–'}</p>
            </Column>
            <Column small={6} medium={3} large={2}>
              <label>PIMA valmistelija</label>
              <p>{getUserFullName(area.polluted_land_planner) || '–'}</p>
            </Column>
            <Column small={6} medium={3} large={2}>
              <label>ProjectWise numero</label>
              <p>{area.polluted_land_projectwise_number || '-'}</p>
            </Column>
            <Column small={6} medium={3} large={2}>
              <label>Matti raportti</label>
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
        defaultOpen={false}
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
        headerTitle={
          <h4 className='collapse__header-title'>Rakennettavuusselvitys</h4>
        }
        showTitleOnOpen={true}
      >
        <div>
          <Row>
            <Column small={6} medium={3} large={2}>
              <label>Selvitys</label>
              <p>{getLabelOfOption(constructabilityReportStateOptions, area.constructability_report_investigation_state) || '-'}</p>
            </Column>
            <Column small={6} medium={3} large={2}>
              <label>Allekirjoituspvm</label>
              <p>{formatDate(area.constructability_report_signing_date) || '–'}</p>
            </Column>
            <Column small={6} medium={3} large={2}>
              <label>Allekirjoittaja</label>
              <p>{area.constructability_report_signer || '-'}</p>
            </Column>
            <Column small={6} medium={3} large={2}>
              <label>Geotekninenpalvelun tiedosto</label>
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
        defaultOpen={false}
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
        headerTitle={
          <h4 className='collapse__header-title'>Muut</h4>
        }
        showTitleOnOpen={true}
      >
        <Comments
          comments={area.descriptionsOther}
        />
      </Collapse>
    </div>
  );
};

export default ConstructabilityItem;
