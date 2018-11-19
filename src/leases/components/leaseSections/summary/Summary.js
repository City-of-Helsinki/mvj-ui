// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import isEmpty from 'lodash/isEmpty';

import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import ExternalLink from '$components/links/ExternalLink';
import FormText from '$components/form/FormText';
import FormTextTitle from '$components/form/FormTextTitle';
import ListItem from '$components/content/ListItem';
import ListItems from '$components/content/ListItems';
import RelatedLeases from './RelatedLeases';
import RightSubtitle from '$components/content/RightSubtitle';
import ShowMore from '$components/showMore/ShowMore';
import SummaryLeaseInfo from './SummaryLeaseInfo';
import FormTitleAndText from '$components/form/FormTitleAndText';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/leases/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {getContentSummary} from '$src/leases/helpers';
import {formatDate, getAttributeFieldOptions, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
import {getUserFullName} from '$src/users/helpers';
import {getRouteById} from '$src/root/routes';
import {getAttributes, getCollapseStateByKey, getCurrentLease} from '$src/leases/selectors';

import type {Attributes, Lease} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  collapseStateBasic: boolean,
  collapseStateStatistical: boolean,
  currentLease: Lease,
  receiveCollapseStates: Function,
}

type State = {
  classificationOptions: Array<Object>,
  financingOptions: Array<Object>,
  hitasOptions: Array<Object>,
  intendedUseOptions: Array<Object>,
  managementOptions: Array<Object>,
  noticePeriodOptions: Array<Object>,
  regulationOptions: Array<Object>,
  stateOptions: Array<Object>,
  statisticalUseOptions: Array<Object>,
  summary: Object,
  supportiveHousingOptions: Array<Object>,
}

class Summary extends Component<Props, State> {
  state = {
    classificationOptions: [],
    financingOptions: [],
    hitasOptions: [],
    intendedUseOptions: [],
    lessorOptions: [],
    managementOptions: [],
    noticePeriodOptions: [],
    regulationOptions: [],
    stateOptions: [],
    statisticalUseOptions: [],
    summary: {},
    supportiveHousingOptions: [],
  }
  componentWillMount() {
    const {attributes, currentLease} = this.props;

    if(!isEmpty(attributes)) {
      this.updateOptions(attributes);
    }

    if(!isEmpty(currentLease)) {
      this.updateSummary(currentLease);
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.attributes !== this.props.attributes) {
      this.updateOptions(this.props.attributes);
    }

    if(prevProps.currentLease !== this.props.currentLease) {
      this.updateSummary(this.props.currentLease);
    }
  }

  updateOptions = (attributes: Attributes) => {
    this.setState({
      classificationOptions: getAttributeFieldOptions(attributes, 'classification'),
      financingOptions: getAttributeFieldOptions(attributes, 'financing'),
      hitasOptions: getAttributeFieldOptions(attributes, 'hitas'),
      intendedUseOptions: getAttributeFieldOptions(attributes, 'intended_use'),
      managementOptions: getAttributeFieldOptions(attributes, 'management'),
      noticePeriodOptions: getAttributeFieldOptions(attributes, 'notice_period'),
      regulationOptions: getAttributeFieldOptions(attributes, 'regulation'),
      stateOptions: getAttributeFieldOptions(attributes, 'state'),
      statisticalUseOptions: getAttributeFieldOptions(attributes, 'statistical_use'),
      supportiveHousingOptions: getAttributeFieldOptions(attributes, 'supportive_housing'),
    });
  }

  updateSummary = (currentLease: Lease) => {
    this.setState({
      summary: getContentSummary(currentLease),
    });
  }

  handleBasicInfoToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.SUMMARY]: {
          basic: val,
        },
      },
    });
  }

  handleStatisticalInfoToggle = (val: boolean) => {
    const {receiveCollapseStates} = this.props;

    receiveCollapseStates({
      [ViewModes.READONLY]: {
        [FormNames.SUMMARY]: {
          statistical: val,
        },
      },
    });
  }

  render() {
    const {
      classificationOptions,
      financingOptions,
      hitasOptions,
      intendedUseOptions,
      managementOptions,
      noticePeriodOptions,
      regulationOptions,
      stateOptions,
      statisticalUseOptions,
      summary,
      supportiveHousingOptions,
    } = this.state;
    const {collapseStateBasic, collapseStateStatistical} = this.props;
    const infillDevelopmentCompensations = summary.infill_development_compensations;

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
        <Row className='summary__content-wrapper'>
          <Column small={12} medium={8} large={9}>
            <Collapse
              defaultOpen={collapseStateBasic !== undefined ? collapseStateBasic : true}
              headerTitle={<h3 className='collapse__header-title'>Perustiedot</h3>}
              onToggle={this.handleBasicInfoToggle}
            >
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormTitleAndText
                    title='Tyyppi'
                    text={getLabelOfOption(stateOptions, summary.state) || '-'}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormTitleAndText
                    title='Alkupvm'
                    text={formatDate(summary.start_date) || '-'}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormTitleAndText
                    title='Loppupvm'
                    text={formatDate(summary.end_date) || '-'}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormTitleAndText
                    title='Vuokranantaja'
                    text={getContactFullName(summary.lessor) || '-'}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormTitleAndText
                    title='Valmistelija'
                    text={getUserFullName(summary.preparer) || '-'}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormTitleAndText
                    title='Julkisuusluokka'
                    text={getLabelOfOption(classificationOptions, summary.classification) || '-'}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormTitleAndText
                    title='Vuokrauksen käyttötarkoitus'
                    text={getLabelOfOption(intendedUseOptions, summary.intended_use) || '-'}
                  />
                </Column>
                <Column small={12} medium={6} large={8}>
                  <FormTextTitle title='Käyttötarkoituksen huomautus' />
                  <ShowMore text={summary.intended_use_note || '-'} />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormTitleAndText
                    title='Rahoitusmuoto'
                    text={getLabelOfOption(financingOptions, summary.financing) || '-'}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormTitleAndText
                    title='Hallintamuoto'
                    text={getLabelOfOption(managementOptions, summary.management) || '-'}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormTitleAndText
                    title='Siirto-oikeus'
                    text={summary.transferable ? 'Kyllä' : 'Ei'}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormTitleAndText
                    title='Hitas'
                    text={getLabelOfOption(hitasOptions, summary.hitas) || '-'}
                  />
                </Column>
                {/* TODO: Get vuokrausperuste and täydennysrakentaminen via API */}
                <Column small={12} medium={6} large={4}>
                  <FormTitleAndText
                    title='Vuokrausperuste'
                    text={'-'}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormTextTitle title='Täydennysrakentamiskorvaus' />
                  {!infillDevelopmentCompensations || !infillDevelopmentCompensations.length
                    ? <FormText>-</FormText>
                    : <ListItems>
                      {infillDevelopmentCompensations.map((item) =>
                        <ListItem key={item.id}>
                          <ExternalLink
                            className='no-margin'
                            href={`${getRouteById('infillDevelopment')}/${item.id}`}
                            text={item.name || item.id}
                          />
                        </ListItem>
                      )}
                    </ListItems>
                  }
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormTitleAndText
                    title='Irtisanomisaika'
                    text={getLabelOfOption(noticePeriodOptions, summary.notice_period) || '-'}
                  />
                </Column>
                <Column small={12} medium={6} large={8}>
                  <FormTextTitle title='Irtisanomisajan huomautus' />
                  <ShowMore text={summary.notice_note || '-'} />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormTitleAndText
                    title='Diaarinumero'
                    text={summary.reference_number
                      ? <ExternalLink
                        href={getReferenceNumberLink(summary.reference_number)}
                        text={summary.reference_number} />
                      : '-'
                    }
                    textClassName={summary.reference_number ? 'no-margin' : ''}
                  />
                </Column>
                <Column small={12} medium={6} large={8}>
                  <FormTextTitle title='Huomautus' />
                  <ShowMore text={summary.note || '-'} />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormTitleAndText
                    title='Arvonlisävelvollinen'
                    text={summary.is_subject_to_vat ? 'Kyllä' : 'Ei'}
                  />
                </Column>
              </Row>

              <SummaryLeaseInfo />
            </Collapse>

            <Collapse
              defaultOpen={collapseStateStatistical !== undefined ? collapseStateStatistical : true}
              headerTitle={<h3 className='collapse__header-title'>Tilastotiedot</h3>}
              onToggle={this.handleStatisticalInfoToggle}
            >
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormTitleAndText
                    title='Erityisasunnot'
                    text={getLabelOfOption(supportiveHousingOptions, summary.supportive_housing) || '-'}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormTitleAndText
                    title='Tilastollinen pääkäyttötarkoitus'
                    text={getLabelOfOption(statisticalUseOptions, summary.statistical_use) || '-'}
                  />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormTitleAndText
                    title='Sääntely'
                    text={summary.regulated ? 'Kyllä' : 'Ei'}
                  />
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormTitleAndText
                    title='Sääntelymuoto'
                    text={getLabelOfOption(regulationOptions, summary.regulation) || '-'}
                  />
                </Column>
              </Row>
            </Collapse>
          </Column>
          <Column small={12} medium={4} large={3}>
            <RelatedLeases />
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
      collapseStateBasic: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.SUMMARY}.basic`),
      collapseStateStatistical: getCollapseStateByKey(state, `${ViewModes.READONLY}.${FormNames.SUMMARY}.statistical`),
      currentLease: getCurrentLease(state),
    };
  },
  {
    receiveCollapseStates,
  }
)(Summary);
