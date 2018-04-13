// @flow
import React from 'react';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';

import BoxItem from '$components/content/BoxItem';
import BoxItemContainer from '$components/content/BoxItemContainer';
import Collapse from '$components/collapse/Collapse';
import {formatDate, getAttributeFieldOptions, getLabelOfOption} from '$util/helpers';
import {ConstructabilityStatus} from '$src/leases/enums';

import type {Attributes} from '$src/leases/types';
import type {UserList} from '$src/users/types';

type CommentsProps = {
  comments: ?Array<Object>,
  userOptions: Array<Object>,
}

const Comments = ({comments, userOptions}: CommentsProps) => {
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
                      <strong>{getLabelOfOption(userOptions, comment.user)}</strong>
                      {comment.modified_at && `, ${formatDate(comment.modified_at)}`}
                      {comment.AHJO_number && `, diaarinumero ${comment.AHJO_number}`}
                    </p>
                  </Column>
                </Row>
              </BoxItem>
            )}
          </BoxItemContainer>
        ) : (
          <p><em>Ei selityksiä.</em></p>
        )
      }
    </div>
  );
};

type StatusIndicatorProps = {
  researchState: string,
  stateOptions: string,
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
  attributes: Attributes,
  users: UserList,
}

const ConstructabilityItem = ({area, attributes, users}: Props) => {
  const getUserOptions = (users: UserList) => {
    if(!users || !users.length) {
      return [];
    }
    return users.map((user) => {
      return {
        value: user.id,
        label: `${user.first_name} ${user.last_name}`,
      };
    });
  };

  const stateOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.preconstruction_state');
  const pollutedLandConditionStateOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.polluted_land_rent_condition_state');
  const constructabilityReportStateOptions = getAttributeFieldOptions(attributes, 'lease_areas.child.children.constructability_report_investigation_state');
  const userOptions = getUserOptions(users);

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
      >
        <Comments
          comments={area.descriptionsPreconstruction}
          userOptions={userOptions}
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
        >
        <Comments
          comments={area.descriptionsDemolition}
          userOptions={userOptions}
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
        >
        <div>
          <Row>
            <Column small={6} medium={3} large={2}>
              <label>Vuokraehdot</label>
              <p>{getLabelOfOption(pollutedLandConditionStateOptions, area.polluted_land_rent_condition_state) || '-'}</p>
            </Column>
            <Column small={6} medium={3} large={2}>
              <label>Päivämäärä</label>
              <p>{formatDate(area.polluted_land_rent_condition_date) || '–'}</p>
            </Column>
            <Column small={6} medium={3} large={2}>
              <label>PIMA valmistelija</label>
              <p>{getLabelOfOption(userOptions, area.polluted_land_planner) || '–'}</p>
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
          userOptions={userOptions}
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
        }>
        <div>
          <Row>
            <Column small={6} medium={3} large={2}>
              <label>Selvitys</label>
              <p>{getLabelOfOption(constructabilityReportStateOptions, area.constructability_report_investigation_state) || '-'}</p>
            </Column>
            <Column small={6} medium={3} large={2}>
              <label>Allekirjoituspäivämäärä</label>
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
          userOptions={userOptions}
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
        }>
        <Comments
          comments={area.descriptionsOther}
          userOptions={userOptions}
        />
      </Collapse>
    </div>
  );
};

export default ConstructabilityItem;
