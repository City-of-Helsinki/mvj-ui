// @flow
import React from 'react';
import get from 'lodash/get';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';
import Collapse from '../../../../components/Collapse';
import * as helpers from '../../../helpers';

type Props = {
  eligibility: Object,
}

const ConstructionEligibility = ({eligibility}: Props) => {
  return (
    <div>
      <Collapse
        className='collapse__secondary'
        defaultOpen={false}
        header={
          <Row>
            <Column small={8}><span className='collapse__header-title'>Esirakentaminen ja johtosiirrot</span></Column>
            <Column small={4}><span className={classNames({'collapse__header-neutral': eligibility.preconstruction.research_state === 'Tarkistamatta'}, {'collapse__header-alert': eligibility.preconstruction.research_state === 'Vaati toimenpiteitä'}, {'collapse__header-success': eligibility.preconstruction.research_state === 'Valmis'})}><i/>{get(eligibility.preconstruction, 'research_state')}</span></Column>
          </Row>
        }
      >
        {eligibility.preconstruction.comments.length > 0 && eligibility.preconstruction.comments.map((comment, index) =>
          <div className='section-item' key={index}>
            <Row>
              <Column medium={12} className='explanation'>
                <p>{get(comment, 'comment', '')}</p>
                <p><strong>{get(comment, 'comment_author', '')}</strong>, {helpers.formatDate(get(comment, 'comment_date'), '')}{comment.AHJO_number && `, diaarinumero ${comment.AHJO_number}`}</p>
              </Column>
            </Row>
          </div>
        )}
        {eligibility.preconstruction.comments.length === 0 &&
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
            <Column small={4}><span className={classNames({'collapse__header-neutral': eligibility.demolition.research_state === 'Tarkistamatta'}, {'collapse__header-alert': eligibility.demolition.research_state === 'Vaati toimenpiteitä'}, {'collapse__header-success': eligibility.demolition.research_state === 'Valmis'})}><i/>{get(eligibility.demolition, 'research_state')}</span></Column>
          </Row>
        }
      >
        {eligibility.demolition.comments.length > 0 && eligibility.demolition.comments.map((comment, index) =>
          <div className='section-item'  key={index}>
            <Row>
              <Column medium={12} className='explanation'>
                <p>{get(comment, 'comment', '')}</p>
                <p><strong>{get(comment, 'comment_author', '')}</strong>, {helpers.formatDate(get(comment, 'comment_date'), '')}{comment.AHJO_number && `, diaarinumero ${comment.AHJO_number}`}</p>
              </Column>
            </Row>
          </div>
        )}
        {eligibility.demolition.comments.length === 0 &&
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
            <Column small={4}><span className={classNames({'collapse__header-neutral': eligibility.contamination.research_state === 'Tarkistamatta'}, {'collapse__header-alert': eligibility.contamination.research_state === 'Vaati toimenpiteitä'}, {'collapse__header-success': eligibility.contamination.research_state === 'Valmis'})}><i/>{get(eligibility.contamination, 'research_state')}</span></Column>
          </Row>
        }
      >
        <div className='section-item'>
          <Row>
            <Column medium={4}>
              <label>Vuokraehdot</label>
              <p>{eligibility.contamination.rent_conditions ? get(eligibility.contamination, 'rent_conditions', '–') : '–'}</p>
              <label>ProjectWise numero</label>
              <p>{eligibility.contamination.projectwise_number ? get(eligibility.contamination, 'projectwise_number', '–') : '–'}</p>
            </Column>
            <Column medium={4}>
              <label>Päivämäärä</label>
              <p>{eligibility.contamination.rent_condition_date ? helpers.formatDate(get(eligibility.contamination, 'rent_condition_date', '–')) : '–'}</p>
              <label>Matti raportti</label>
              <p>{eligibility.contamination.contamination_author ? get(eligibility.contamination, 'contamination_author', '–') : '–'}</p>
            </Column>
            <Column medium={4}>
              <label>PIMA valmistelija</label>
              <p>{eligibility.contamination.rent_condition_date ? helpers.formatDate(get(eligibility.contamination, 'rent_condition_date', '–')) : '–'}</p>
            </Column>
          </Row>
        </div>
        {eligibility.contamination.comments.length > 0 && eligibility.contamination.comments.map((comment, index) =>
          <div className='section-item' key={index}>
            <Row>
              <Column medium={12} className='explanation'>
                <p>{get(comment, 'comment', '')}</p>
                <p><strong>{get(comment, 'comment_author', '')}</strong>, {helpers.formatDate(get(comment, 'comment_date', ''))}{comment.AHJO_number && `, diaarinumero ${comment.AHJO_number}`}</p>
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
            <Column small={4}><span className={classNames({'collapse__header-neutral': eligibility.construction_investigation.research_state === 'Tarkistamatta'}, {'collapse__header-alert': eligibility.construction_investigation.research_state === 'Vaati toimenpiteitä'}, {'collapse__header-success': eligibility.construction_investigation.research_state === 'Valmis'})}><i/>{get(eligibility.construction_investigation, 'research_state')}</span></Column>
          </Row>
        }
      >
        <div className='section-item'>
          <Row>
            <Column medium={4}>
              <label>Selvitys</label>
              <p>{eligibility.construction_investigation.report ? get(eligibility.construction_investigation, 'report', '–') : '–'}</p>
              <label>Geotekninenpalvelun tiedosto</label>
              <p>{eligibility.construction_investigation.geotechnical_number ? get(eligibility.construction_investigation, 'geotechnical_number', '–') : '–'}</p>
            </Column>
            <Column medium={4}>
              <label>Allekirjoituspäivämäärä</label>
              <p>{eligibility.construction_investigation.signing_date ? helpers.formatDate(get(eligibility.construction_investigation, 'signing_date', '–')) : '–'}</p>
            </Column>
            <Column medium={4}>
              <label>Selvityksen tekijä</label>
              <p>{eligibility.construction_investigation.report_author ? get(eligibility.construction_investigation, 'report_author', '–') : '–'}</p>
            </Column>
          </Row>
        </div>
        {eligibility.construction_investigation.comments.length > 0 && eligibility.construction_investigation.comments.map((comment, index) =>
          <div className='section-item' key={index}>
            <Row>
              <Column medium={12} className='explanation'>
                <p>{get(comment, 'comment', '')}</p>
                <p><strong>{get(comment, 'comment_author', '')}</strong>, {helpers.formatDate(get(comment, 'comment_date', ''))}{comment.AHJO_number && `, diaarinumero ${comment.AHJO_number}`}</p>
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
            <Column small={4}><span className={classNames({'collapse__header-neutral': eligibility.other.research_state === 'Tarkistamatta'}, {'collapse__header-alert': eligibility.other.research_state === 'Vaati toimenpiteitä'}, {'collapse__header-success': eligibility.other.research_state === 'Valmis'})}><i/>{get(eligibility.other, 'research_state')}</span></Column>
          </Row>
        }
      >
        {eligibility.other.comments.length > 0 && eligibility.other.comments.map((comment, index) =>
          <div className='section-item'  key={index}>
            <Row>
              <Column medium={12} className='explanation'>
                <p>{get(comment, 'comment', '')}</p>
                <p><strong>{get(comment, 'comment_author', '')}</strong>, {helpers.formatDate(get(comment, 'comment_date', ''))}{comment.AHJO_number && `, diaarinumero ${comment.AHJO_number}`}</p>
              </Column>
            </Row>
          </div>
        )}
        {eligibility.other.comments.length === 0 &&
          <div className='section-item'>
            <p><em>Ei ole vielä selityksiä.</em></p>
          </div>
        }
      </Collapse>
    </div>
  );
};

export default ConstructionEligibility;
