// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import isEmpty from 'lodash/isEmpty';

import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import ExternalLink from '$components/links/ExternalLink';
import FormFieldLabel from '$components/form/FormFieldLabel';
import ListItems from '$components/content/ListItems';
import RelatedLeases from './RelatedLeases';
import RightSubtitle from '$components/content/RightSubtitle';
import ShowMore from '$components/showMore/ShowMore';
import SummaryLeaseInfo from './SummaryLeaseInfo';
import {receiveCollapseStates} from '$src/leases/actions';
import {ViewModes} from '$src/enums';
import {FormNames} from '$src/leases/enums';
import {getContactFullName} from '$src/contacts/helpers';
import {getContentSummary} from '$src/leases/helpers';
import {getAttributeFieldOptions, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
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
        <Row>
          <Column medium={9}>
            <Collapse
              defaultOpen={collapseStateBasic !== undefined ? collapseStateBasic : true}
              headerTitle={<h3 className='collapse__header-title'>Perustiedot</h3>}
              onToggle={this.handleBasicInfoToggle}
            >
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormFieldLabel>Vuokranantaja</FormFieldLabel>
                  <p>{getContactFullName(summary.lessor) || '-'}</p>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormFieldLabel>Valmistelija</FormFieldLabel>
                  <p>{getUserFullName(summary.preparer) || '-'}</p>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormFieldLabel>Julkisuusluokka</FormFieldLabel>
                  <p>{getLabelOfOption(classificationOptions, summary.classification) || '-'}</p>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormFieldLabel>Vuokrauksen käyttötarkoitus</FormFieldLabel>
                  <p>{getLabelOfOption(intendedUseOptions, summary.intended_use) || '-'}</p>
                </Column>
                <Column small={12} medium={6} large={8}>
                  <FormFieldLabel>Käyttötarkoituksen huomautus</FormFieldLabel>
                  <ShowMore text={summary.intended_use_note || '-'} />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormFieldLabel>Rahoitusmuoto</FormFieldLabel>
                  <p>{getLabelOfOption(financingOptions, summary.financing) || '-'}</p>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormFieldLabel>Hallintamuoto</FormFieldLabel>
                  <p>{getLabelOfOption(managementOptions, summary.management) || '-'}</p>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormFieldLabel>Siirto-oikeus</FormFieldLabel>
                  <p>{summary.transferable ? 'Kyllä' : 'Ei'}</p>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormFieldLabel>Hitas</FormFieldLabel>
                  <p>{getLabelOfOption(hitasOptions, summary.hitas) || '-'}</p>
                </Column>
                {/* TODO: Get vuokrausperuste and täydennysrakentaminen via API */}
                <Column small={12} medium={6} large={4}>
                  <FormFieldLabel>Vuokrausperuste</FormFieldLabel>
                  <p>-</p>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormFieldLabel>Täydennysrakentamiskorvaus</FormFieldLabel>
                  {!infillDevelopmentCompensations || !infillDevelopmentCompensations.length &&
                    <p>-</p>
                  }
                  {infillDevelopmentCompensations && !!infillDevelopmentCompensations.length &&
                    <ListItems>
                      {infillDevelopmentCompensations.map((item) =>
                        <p className='no-margin' key={item.id}>
                          <ExternalLink
                            className='no-margin'
                            href={`${getRouteById('infillDevelopment')}/${item.id}`}
                            label={item.name || item.id}
                          />
                        </p>
                      )}
                    </ListItems>
                  }
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormFieldLabel>Irtisanomisaika</FormFieldLabel>
                  <p>{getLabelOfOption(noticePeriodOptions, summary.notice_period) || '-'}</p>
                </Column>
                <Column small={12} medium={6} large={8}>
                  <FormFieldLabel>Irtisanomisajan huomautus</FormFieldLabel>
                  <ShowMore text={summary.notice_note || '-'} />
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormFieldLabel>Diaarinumero</FormFieldLabel>
                  {summary.reference_number
                    ? <ExternalLink
                      href={getReferenceNumberLink(summary.reference_number)}
                      label={summary.reference_number}
                    />
                    : <p>-</p>
                  }
                </Column>
                <Column small={12} medium={6} large={8}>
                  <FormFieldLabel>Huomautus</FormFieldLabel>
                  <ShowMore text={summary.note || '-'} />
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
                  <FormFieldLabel>Erityisasunnot</FormFieldLabel>
                  <p>{getLabelOfOption(supportiveHousingOptions, summary.supportive_housing) || '-'}</p>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormFieldLabel>Tilastollinen pääkäyttötarkoitus</FormFieldLabel>
                  <p>{getLabelOfOption(statisticalUseOptions, summary.statistical_use) || '-'}</p>
                </Column>
              </Row>
              <Row>
                <Column small={12} medium={6} large={4}>
                  <FormFieldLabel>Sääntely</FormFieldLabel>
                  <p>{summary.regulated ? 'Kyllä' : 'Ei'}</p>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormFieldLabel>Sääntelymuoto</FormFieldLabel>
                  <p>{getLabelOfOption(regulationOptions, summary.regulation) || '-'}</p>
                </Column>
              </Row>
            </Collapse>
          </Column>
          <Column medium={3}>
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
