// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';

import {getAttributeFieldOptions, getLabelOfOption, getLessorOptions} from '$util/helpers';
import {getLessors} from '$src/leases/selectors';
import {fetchLessors} from '$src/leases/actions';
import Collapse from '$components/collapse/Collapse';
import ShowMore from '$components/showMore/ShowMore';

type Props = {
  attributes: Object,
  fetchLessors: Function,
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
    const {attributes, lessors, summary} = this.props;
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
        <Collapse
          defaultOpen={true}
          headerTitle={
            <h4 className='collapse__header-title'>Perustiedot</h4>
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
            <h4 className='collapse__header-title'>Tilastotiedot</h4>
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
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      lessors: getLessors(state),
    };
  },
  {
    fetchLessors,
  }
)(Summary);
