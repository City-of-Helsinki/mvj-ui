// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';
import Collapse from '../../../../components/Collapse';

import {formatDate} from '../../../../util/helpers';

type Props = {
  eligibility: Object,
}

const ConstructionEligibility = ({eligibility}: Props) => {
  const {contamination, construction_investigation, demolition, other, preconstruction} = eligibility;
  return (
    <div>
      <Collapse
        className='collapse__secondary'
        defaultOpen={false}
        header={
          <Row>
            <Column small={8}><span className='collapse__header-title'>ESIRAKENTAMINEN, JOHTOSIIRROT JA KUNNALLISTEKNIIKKA</span></Column>
            <Column small={4}>
              <span className={
                classNames(
                  {'collapse__header-neutral': preconstruction.research_state === 'Tarkistamatta'},
                  {'collapse__header-alert': preconstruction.research_state === 'Vaati toimenpiteitä'},
                  {'collapse__header-success': eligibility.preconstruction.research_state === 'Valmis'}
                )
              }>
                <i/>{get(eligibility.preconstruction, 'research_state')}
              </span>
            </Column>
          </Row>
        }
      >
        {preconstruction.comments && preconstruction.comments.length > 0 && preconstruction.comments.map((comment, index) =>
          <div className='section-item' key={index}>
            <Row>
              <Column medium={12} className='explanation'>
                <p>{get(comment, 'comment', '')}</p>
                <p><strong>{get(comment, 'comment_author', '')}</strong>, {formatDate(comment.comment_date)}{comment.AHJO_number && `, diaarinumero ${comment.AHJO_number}`}</p>
              </Column>
            </Row>
          </div>
        )}
        {!preconstruction.comments || preconstruction.comments.length === 0 &&
          <div className='section-item'>
            <p><em>Ei ole vielä selityksiä.</em></p>
          </div>
        }
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={false}
        header={
          <Row>
            <Column small={8}><span className='collapse__header-title'>Purku</span></Column>
            <Column small={4}>
              <span className={
                classNames(
                  {'collapse__header-neutral': demolition.research_state === 'Tarkistamatta'},
                  {'collapse__header-alert': eligibility.demolition.research_state === 'Vaati toimenpiteitä'},
                  {'collapse__header-success': eligibility.demolition.research_state === 'Valmis'}
                )}>
                <i/>{get(eligibility.demolition, 'research_state')}
              </span>
            </Column>
          </Row>
        }
      >
        {demolition.comments && demolition.comments.length > 0 && demolition.comments.map((comment, index) =>
          <div className='section-item'  key={index}>
            <Row>
              <Column medium={12} className='explanation'>
                <p>{get(comment, 'comment', '')}</p>
                <p><strong>{get(comment, 'comment_author', '')}</strong>, {formatDate(comment.comment_date)}{comment.AHJO_number && `, diaarinumero ${comment.AHJO_number}`}</p>
              </Column>
            </Row>
          </div>
        )}
        {!demolition || demolition.comments.length === 0 &&
          <div className='section-item'>
            <p><em>Ei ole vielä selityksiä.</em></p>
          </div>
        }
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={false}
        header={
          <Row>
            <Column small={8}><span className='collapse__header-title'>PIMA</span></Column>
            <Column small={4}>
              <span className={
                classNames(
                  {'collapse__header-neutral': contamination.research_state === 'Tarkistamatta'},
                  {'collapse__header-alert': contamination.research_state === 'Vaati toimenpiteitä'},
                  {'collapse__header-success': contamination.research_state === 'Valmis'}
                )
              }
              >
                <i/>{get(contamination, 'research_state')}
              </span>
            </Column>
          </Row>
        }
      >
        <div className='section-item'>
          <Row>
            <Column medium={4}>
              <label>Vuokraehdot</label>
              <p>{get(contamination, 'rent_conditions', '–')}</p>
              <label>ProjectWise numero</label>
              <p>{get(contamination, 'projectwise_number', '–')}</p>
            </Column>
            <Column medium={4}>
              <label>Päivämäärä</label>
              <p>{contamination.rent_condition_date ? formatDate(contamination.rent_condition_date) : '–'}</p>
              <label>Matti raportti</label>
              <p>{get(contamination, 'matti_report', '–')}</p>
            </Column>
            <Column medium={4}>
              <label>PIMA valmistelija</label>
              <p>{contamination.contamination_author ? contamination.contamination_author : '–'}</p>
            </Column>
          </Row>
        </div>
        {contamination.comments && contamination.comments.length > 0 && contamination.comments.map((comment, index) =>
          <div className='section-item' key={index}>
            <Row>
              <Column medium={12} className='explanation'>
                <p>{get(comment, 'comment', '')}</p>
                <p><strong>{get(comment, 'comment_author', '')}</strong>, {formatDate(comment.comment_date)}{comment.AHJO_number && `, diaarinumero ${comment.AHJO_number}`}</p>
              </Column>
            </Row>
          </div>
        )}
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={false}
        header={
          <Row>
            <Column small={8}><span className='collapse__header-title'>Rakennettavuusselvitys</span></Column>
            <Column small={4}>
              <span className={
                classNames(
                  {'collapse__header-neutral': construction_investigation.research_state === 'Tarkistamatta'},
                  {'collapse__header-alert': construction_investigation.research_state === 'Vaati toimenpiteitä'},
                  {'collapse__header-success': construction_investigation.research_state === 'Valmis'}
                )
              }>
                <i/>{get(eligibility.construction_investigation, 'research_state')}
              </span>
            </Column>
          </Row>
        }
      >
        <div className='section-item'>
          <Row>
            <Column medium={4}>
              <label>Selvitys</label>
              <p>{get(construction_investigation, 'report', '–')}</p>
              <label>Geotekninenpalvelun tiedosto</label>
              <p>{get(construction_investigation, 'geotechnical_number', '–')}</p>
            </Column>
            <Column medium={4}>
              <label>Allekirjoituspäivämäärä</label>
              <p>{construction_investigation.signing_date ? formatDate(construction_investigation.signing_date) : '–'}</p>
            </Column>
            <Column medium={4}>
              <label>Allekirjoittaja</label>
              <p>{get(eligibility.construction_investigation, 'report_author', '–')}</p>
            </Column>
          </Row>
        </div>
        {construction_investigation.comments && construction_investigation.comments.length > 0 && construction_investigation.comments.map((comment, index) =>
          <div className='section-item' key={index}>
            <Row>
              <Column medium={12} className='explanation'>
                <p>{get(comment, 'comment', '')}</p>
                <p><strong>{get(comment, 'comment_author', '')}</strong>, {formatDate(comment.comment_date)}{comment.AHJO_number && `, diaarinumero ${comment.AHJO_number}`}</p>
              </Column>
            </Row>
          </div>
        )}
      </Collapse>

      <Collapse
        className='collapse__secondary'
        defaultOpen={false}
        header={
          <Row>
            <Column small={8}><span className='collapse__header-title'>Muut</span></Column>
            <Column small={4}>
              <span
                className={
                  classNames(
                    {'collapse__header-neutral': other.research_state === 'Tarkistamatta'},
                    {'collapse__header-alert': other.research_state === 'Vaati toimenpiteitä'},
                    {'collapse__header-success': other.research_state === 'Valmis'}
                  )
                }
              >
                <i/>{get(eligibility.other, 'research_state')}
              </span>
            </Column>
          </Row>
        }
      >
        {other.comments && other.comments.length > 0 && other.comments.map((comment, index) =>
          <div className='section-item'  key={index}>
            <Row>
              <Column medium={12} className='explanation'>
                <p>{get(comment, 'comment', '')}</p>
                <p><strong>{get(comment, 'comment_author', '')}</strong>, {formatDate(comment.comment_date)}{comment.AHJO_number && `, diaarinumero ${comment.AHJO_number}`}</p>
              </Column>
            </Row>
          </div>
        )}
        {!other.comments || other.comments.length === 0 &&
          <div className='section-item'>
            <p><em>Ei ole vielä selityksiä.</em></p>
          </div>
        }
      </Collapse>
    </div>
  );
};

export default ConstructionEligibility;
