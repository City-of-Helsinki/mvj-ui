// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import {fetchLessors} from '$src/leases/actions';
import {getContentSummary} from '$src/leases/helpers';
import {getAttributeFieldOptions, getLabelOfOption, getLessorOptions} from '$util/helpers';
import {getAttributes, getCurrentLease, getLessors} from '$src/leases/selectors';
import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import LeaseHistory from './LeaseHistory';
import RightSubtitle from '$components/content/RightSubtitle';
import ShowMore from '$components/showMore/ShowMore';

import type {Lease} from '$src/leases/types';

type Props = {
  attributes: Object,
  currentLease: Lease,
  fetchLessors: Function,
  history: Array<Object>,
  lessors: Array<Object>,
  summary: Object,
}

class Summary extends Component {
  props: Props

  componentWillMount() {
    const {fetchLessors} = this.props;

    fetchLessors();
  }

  render() {
    const {attributes, currentLease, history, lessors} = this.props;
    const summary = getContentSummary(currentLease);
    const classificationOptions = getAttributeFieldOptions(attributes, 'classification');
    const intendedUseOptions = getAttributeFieldOptions(attributes, 'intended_use');
    const supportiveHousingOptions = getAttributeFieldOptions(attributes, 'supportive_housing');
    const statisticalUseOptions = getAttributeFieldOptions(attributes, 'statistical_use');
    const financingOptions = getAttributeFieldOptions(attributes, 'financing');
    const managementOptions = getAttributeFieldOptions(attributes, 'management');
    const regulationOptions = getAttributeFieldOptions(attributes, 'regulation');
    const hitasOptions = getAttributeFieldOptions(attributes, 'hitas');
    const noticePeriodOptions = getAttributeFieldOptions(attributes, 'notice_period');


    const lessorOptions = getLessorOptions(lessors);

    return (
      <div>
        <h2>Yhteenveto</h2>
        <RightSubtitle
          className='publicity-label'
          text={summary.classification
            ? getLabelOfOption(classificationOptions, summary.classification)
            : '-'
          }
        />
        <Divider />
        <Row>
          <Column medium={9}>
            <Collapse
              defaultOpen={true}
              headerTitle={
                <h3 className='collapse__header-title'>Perustiedot</h3>
              }
            >
              <Row>
                <Column small={12} medium={6} large={4}>
                  <label>Vuokranantaja</label>
                  <p>{getLabelOfOption(lessorOptions, summary.lessor) || '-'}</p>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <label>Julkisuusluokka</label>
                  <p>{getLabelOfOption(classificationOptions, summary.classification) || '-'}</p>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <label>Vuokrauksen käyttötarkoitus</label>
                  <p>{getLabelOfOption(intendedUseOptions, summary.intended_use) || '-'}</p>
                </Column>
                <Column small={12} medium={6} large={8}>
                  <label>Vuokrauksen käyttötarkoitus selite</label>
                  <ShowMore text={summary.intended_use_note || '-'} />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <label>Rahoitusmuoto</label>
                  <p>{getLabelOfOption(financingOptions, summary.financing) || '-'}</p>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <label>Hallintamuoto</label>
                  <p>{getLabelOfOption(managementOptions, summary.management) || '-'}</p>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <label>Siirto-oikeus</label>
                  <p>{summary.transferable ? 'Kyllä' : 'Ei'}</p>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <label>Hitas</label>
                  <p>{getLabelOfOption(hitasOptions, summary.hitas) || '-'}</p>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <label>Irtisanomisaika</label>
                  <p>{getLabelOfOption(noticePeriodOptions, summary.notice_period) || '-'}</p>
                </Column>
                <Column small={12} medium={6} large={8}>
                  <label>Irtisanomisajan selite</label>
                  <ShowMore text={summary.notice_note || '-'} />
                </Column>
              </Row>
            </Collapse>

            <Collapse
              defaultOpen={true}
              headerTitle={
                <h3 className='collapse__header-title'>Tilastotiedot</h3>
              }
            >
              <Row>
                <Column small={12} medium={6} large={4}>
                  <label>Erityisasunnot</label>
                  <p>{getLabelOfOption(supportiveHousingOptions, summary.supportive_housing) || '-'}</p>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <label>Tilastollinen pääkäyttötarkoitus</label>
                  <p>{getLabelOfOption(statisticalUseOptions, summary.statistical_use) || '-'}</p>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <label>Sääntely</label>
                  <p>{summary.regulated ? 'Kyllä' : 'Ei'}</p>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <label>Sääntelymuoto</label>
                  <p>{getLabelOfOption(regulationOptions, summary.regulation) || '-'}</p>
                </Column>
              </Row>
            </Collapse>
            </Column>
          <Column medium={3}>
            <LeaseHistory
              history={history}
            />
          </Column>
        </Row>

      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      attributes: getAttributes(state),
      currentLease: getCurrentLease(state),
      lessors: getLessors(state),
    };
  },
  {
    fetchLessors,
  }
)(Summary);
