// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';

import Collapse from '$components/collapse/Collapse';
import {formatDate, getLabelOfOption} from '$util/helpers';
import {
  constructionEligibilityRentConditionsOptions,
  constructionEligibilityReportOptions,
  researchStateOptions,
} from '$src/constants';

type CommentsProps = {
  comments: ?Array<Object>,
}

const Comments = ({comments}: CommentsProps) => {
  return (
    <div>
      {comments && comments.length > 0
        ? (
          <div>
            {comments.map((comment, index) =>
              <div className='construction-eligibility__comment-item'  key={index}>
                <Row>
                  <Column medium={12} className='explanation'>
                    <p>{get(comment, 'comment', '')}</p>
                    <p className='info'><strong>{get(comment, 'comment_author', '')}</strong>, {formatDate(comment.comment_date)}{comment.AHJO_number && `, diaarinumero ${comment.AHJO_number}`}</p>
                  </Column>
                </Row>
              </div>
            )}
          </div>
        ) : (
          <div className='construction-eligibility__comment-item no-comments'>
            <p><em>Ei lisättyjä selityksiä.</em></p>
          </div>
        )
      }
    </div>
  );
};

type StatusIndicatorProps = {
  researchState: string,
}

const StatusIndicator = ({researchState}: StatusIndicatorProps) =>
  <div>
    <span className={
      classNames(
        {'collapse__header-neutral': researchState === '0'},
        {'collapse__header-alert': researchState === '1'},
        {'collapse__header-success': researchState === '2'}
      )
    }>
      <i/>{getLabelOfOption(researchStateOptions, researchState)}
    </span>
  </div>;


type Props = {
  eligibility: Object,
}

const ConstructionEligibilityItem = ({eligibility}: Props) => {
  const {
    contamination,
    construction_investigation,
    demolition,
    other,
    preconstruction,
  } = eligibility;

  return (
    <div>
      <Collapse
        className='collapse__secondary'
        defaultOpen={false}
        header={
          <Row>
            <Column medium={9} large={8}>
              <span className='collapse__header-title'>Esirakentaminen, johtosiirrot ja kunnallistekniikka</span>
            </Column>
            <Column medium={3} large={4}>
              <StatusIndicator researchState={get(preconstruction, 'research_state')} />
            </Column>
          </Row>
        }>
        <Comments comments={get(preconstruction, 'comments')} />
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={false}
        header={
          <Row>
            <Column medium={9} large={8}>
              <span className='collapse__header-title'>Purku</span>
            </Column>
            <Column medium={3} large={4}>
              <StatusIndicator researchState={get(demolition, 'research_state')} />
            </Column>
          </Row>
        }>
        <Comments comments={get(demolition, 'comments')} />
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={false}
        header={
          <Row>
            <Column medium={9} large={8}>
              <span className='collapse__header-title'>PIMA</span>
            </Column>
            <Column medium={3} large={4}>
              <StatusIndicator researchState={get(contamination, 'research_state')} />
            </Column>
          </Row>
        }>
        <div className='section-item'>
          <Row>
            <Column medium={3} large={2}>
              <label>Vuokraehdot</label>
              <p>{getLabelOfOption(constructionEligibilityRentConditionsOptions, get(contamination, 'rent_conditions', '')) || '-'}</p>
            </Column>
            <Column medium={3} large={2}>
              <label>Päivämäärä</label>
              <p>{formatDate(get(contamination, 'rent_condition_date')) || '–'}</p>
            </Column>
            <Column medium={3} large={2}>
              <label>PIMA valmistelija</label>
              <p>{get(contamination, 'contamination_author') || '–'}</p>
            </Column>
            <Column medium={3} large={2}>
              <label>ProjectWise numero</label>
              <p>{get(contamination, 'projectwise_number') || '-'}</p>
            </Column>
            <Column medium={3} large={2}>
              <label>Matti raportti</label>
              <p>{get(contamination, 'matti_report') || '-'}</p>
            </Column>
          </Row>
        </div>
        <Comments
          comments={get(contamination, 'comments')}
        />
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={false}
        header={
          <Row>
            <Column medium={9} large={8}>
              <span className='collapse__header-title'>Rakennettavuusselvitys</span>
            </Column>
            <Column medium={3} large={4}>
              <StatusIndicator researchState={get(construction_investigation, 'research_state')} />
            </Column>
          </Row>
        }>
        <div className='section-item'>
          <Row>
            <Column medium={3} large={2}>
              <label>Selvitys</label>
              <p>{getLabelOfOption(constructionEligibilityReportOptions, get(construction_investigation, 'report')) || '-'}</p>
            </Column>
            <Column medium={3} large={2}>
              <label>Allekirjoituspäivämäärä</label>
              <p>{formatDate(get(construction_investigation, 'signing_date')) || '–'}</p>
            </Column>
            <Column medium={3} large={2}>
              <label>Allekirjoittaja</label>
              <p>{get(eligibility.construction_investigation, 'report_author') || '-'}</p>
            </Column>
            <Column medium={3} large={2}>
              <label>Geotekninenpalvelun tiedosto</label>
              <p>{get(construction_investigation, 'geotechnical_number') || '-'}</p>
            </Column>
          </Row>
        </div>
        <Comments comments={get(construction_investigation, 'comments')} />
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={false}
        header={
          <Row>
            <Column medium={9} large={8}>
              <span className='collapse__header-title'>Muut</span>
            </Column>
            <Column medium={3} large={4}>
              <StatusIndicator researchState={get(other, 'research_state')} />
            </Column>
          </Row>
        }>
        <Comments comments={get(other, 'comments')} />
      </Collapse>
    </div>
  );
};

export default ConstructionEligibilityItem;
