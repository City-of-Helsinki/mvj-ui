// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import classNames from 'classnames';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import Collapse from '$components/collapse/Collapse';
import Divider from '$components/content/Divider';
import FormFieldLabel from '$components/form/FormFieldLabel';
import LeaseHistory from './LeaseHistory';
import ListItems from '$components/content/ListItems';
import RightSubtitle from '$components/content/RightSubtitle';
import ShowMore from '$components/showMore/ShowMore';
import {fetchLessors} from '$src/contacts/actions';
import {ConstructabilityStatus} from '$src/leases/enums';
import {getContactFullName, getLessorOptions} from '$src/contacts/helpers';
import {getContentSummary, getFullAddress} from '$src/leases/helpers';
import {getNoticePeriodOptions} from '$src/noticePeriod/helpers';
import {getAttributeFieldOptions, getLabelOfOption, getReferenceNumberLink} from '$util/helpers';
import {getRouteById} from '$src/root/routes';
import {getLessors} from '$src/contacts/selectors';
import {getAttributes, getCurrentLease} from '$src/leases/selectors';
import {getNoticePeriods} from '$src/noticePeriod/selectors';

import type {Attributes, Lease} from '$src/leases/types';
import type {NoticePeriodList} from '$src/NoticePeriod/types';

type StatusIndicatorProps = {
  researchState: string,
  stateOptions: Array<Object>,
}

const StatusIndicator = ({researchState, stateOptions}: StatusIndicatorProps) =>
  <p
    className={classNames(
      'no-margin',
      {'summary__status-indicator_neutral': !researchState || researchState === ConstructabilityStatus.UNVERIFIED},
      {'summary__status-indicator_alert': researchState === ConstructabilityStatus.REQUIRES_MEASURES},
      {'summary__status-indicator_success': researchState === ConstructabilityStatus.COMPLETE}
    )}
  >
    {getLabelOfOption(stateOptions, researchState || ConstructabilityStatus.UNVERIFIED)}
  </p>;

type Props = {
  attributes: Attributes,
  currentLease: Lease,
  fetchLessors: Function,
  history: Array<Object>,
  lessors: Array<Object>,
  noticePeriods: NoticePeriodList,
  summary: Object,
}

type State = {
  classificationOptions: Array<Object>,
  constructabilityStateOptions: Array<Object>,
  financingOptions: Array<Object>,
  hitasOptions: Array<Object>,
  intendedUseOptions: Array<Object>,
  lessorOptions: Array<Object>,
  managementOptions: Array<Object>,
  noticePeriodOptions: Array<Object>,
  preparerOptions: Array<Object>,
  regulationOptions: Array<Object>,
  statisticalUseOptions: Array<Object>,
  summary: Object,
  supportiveHousingOptions: Array<Object>,
}

class Summary extends Component<Props, State> {
  state = {
    classificationOptions: [],
    constructabilityStateOptions: [],
    financingOptions: [],
    hitasOptions: [],
    intendedUseOptions: [],
    lessorOptions: [],
    managementOptions: [],
    noticePeriodOptions: [],
    preparerOptions: [],
    regulationOptions: [],
    statisticalUseOptions: [],
    summary: {},
    supportiveHousingOptions: [],
  }
  componentWillMount() {
    const {attributes, currentLease, fetchLessors, lessors, noticePeriods} = this.props;

    fetchLessors();
    if(!isEmpty(attributes)) {
      this.updateOptions(attributes);
    }
    if(!isEmpty(currentLease)) {
      this.updateSummary(currentLease);
    }
    if(!isEmpty(lessors)) {
      this.updateLessorOptions(lessors);
    }
    if(!isEmpty(noticePeriods)) {
      this.updateNoticePeriodOptions(noticePeriods);
    }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.attributes !== this.props.attributes) {
      this.updateOptions(this.props.attributes);
    }
    if(prevProps.currentLease !== this.props.currentLease) {
      this.updateSummary(this.props.currentLease);
    }
    if(prevProps.lessors !== this.props.lessors) {
      this.updateLessorOptions(this.props.lessors);
    }
    if(prevProps.noticePeriods !== this.props.noticePeriods) {
      this.updateNoticePeriodOptions(this.props.noticePeriods);
    }
  }

  updateOptions = (attributes: Attributes) => {
    this.setState({
      classificationOptions: getAttributeFieldOptions(attributes, 'classification'),
      constructabilityStateOptions: getAttributeFieldOptions(attributes, 'lease_areas.child.children.preconstruction_state'),
      financingOptions: getAttributeFieldOptions(attributes, 'financing'),
      hitasOptions: getAttributeFieldOptions(attributes, 'hitas'),
      intendedUseOptions: getAttributeFieldOptions(attributes, 'intended_use'),
      managementOptions: getAttributeFieldOptions(attributes, 'management'),
      preparerOptions: getAttributeFieldOptions(attributes, 'preparer'),
      regulationOptions: getAttributeFieldOptions(attributes, 'regulation'),
      statisticalUseOptions: getAttributeFieldOptions(attributes, 'statistical_use'),
      supportiveHousingOptions: getAttributeFieldOptions(attributes, 'supportive_housing'),
    });
  }

  updateLessorOptions = (lessors: Array<Object>) => {
    this.setState({
      lessorOptions: getLessorOptions(lessors),
    });
  }

  updateNoticePeriodOptions = (noticePeriods: NoticePeriodList) => {
    this.setState({
      noticePeriodOptions: getNoticePeriodOptions(noticePeriods),
    });
  }

  updateSummary = (currentLease: Lease) => {
    this.setState({
      summary: getContentSummary(currentLease),
    });
  }

  render() {
    const {history} = this.props;
    const {
      classificationOptions,
      constructabilityStateOptions,
      financingOptions,
      hitasOptions,
      intendedUseOptions,
      lessorOptions,
      managementOptions,
      noticePeriodOptions,
      preparerOptions,
      regulationOptions,
      statisticalUseOptions,
      summary,
      supportiveHousingOptions,
    } = this.state;
    const tenants = get(summary, 'tenants', []);
    const leaseAreas = get(summary, 'lease_areas', []);
    const constructabilityAreas = get(summary, 'constructability_areas', []);

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
                  <FormFieldLabel>Vuokranantaja</FormFieldLabel>
                  <p>{getLabelOfOption(lessorOptions, summary.lessor) || '-'}</p>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormFieldLabel>Valmistelija</FormFieldLabel>
                  <p>{getLabelOfOption(preparerOptions, summary.preparer) || '-'}</p>
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
                <Column small={12} medium={6} large={4}>
                  <FormFieldLabel>Vuokrausperuste</FormFieldLabel>
                  <p>-</p>
                </Column>
                <Column small={12} medium={6} large={4}>
                  <FormFieldLabel>Täydennysrakentaminen</FormFieldLabel>
                  <p>-</p>
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
                    ? <a target='_blank' href={getReferenceNumberLink(summary.reference_number)}>{summary.reference_number}</a>
                    : <p>-</p>
                  }
                </Column>
                <Column small={12} medium={6} large={8}>
                  <FormFieldLabel>Huomautus</FormFieldLabel>
                  <ShowMore text={summary.note || '-'} />
                </Column>
              </Row>
              <p className='sub-title'>Vuokralaiset</p>
              {!tenants.length && <p>Ei vuokralaisia</p>}
              {!!tenants.length &&
                <div>
                  <Row>
                    <Column small={6} large={4}>
                      <FormFieldLabel>Vuokralainen</FormFieldLabel>
                    </Column>
                    <Column small={6} large={4}>
                      <FormFieldLabel>Osuus</FormFieldLabel>
                    </Column>
                  </Row>
                  <ListItems>
                    {tenants.map((contact, index) => {
                      return (
                        <Row key={index}>
                          <Column small={6} large={4}>
                            <p className='no-margin'>
                              <a href={`${getRouteById('contacts')}/${get(contact, 'tenant.contact.id')}`} className='no-margin' target='_blank'>
                                {getContactFullName(get(contact, 'tenant.contact')) || '-'}
                              </a>
                            </p>
                          </Column>
                          <Column small={6} large={4}><p className='no-margin'>{contact.share_numerator} / {contact.share_denominator}</p></Column>
                        </Row>
                      );
                    })}
                  </ListItems>
                </div>
              }
              <p className='sub-title'>Vuokrakohteet</p>
              {!leaseAreas.length && <p>Ei vuokrakohteita</p>}
              {!!leaseAreas.length &&
                <div>
                  <Row>
                    <Column small={6} large={4}>
                      <FormFieldLabel>Kohteen tunnus</FormFieldLabel>
                    </Column>
                    <Column small={6} large={4}>
                      <FormFieldLabel>Kohteen osoite</FormFieldLabel>
                    </Column>
                  </Row>
                  <ListItems>
                    {leaseAreas.map((area, index) => {
                      return (
                        <Row key={index}>
                          <Column small={6} large={4}>
                            <p className='no-margin'>{area.identifier || '-'}</p>
                          </Column>
                          <Column small={6} large={4}>
                            {!area.addresses || !area.addresses.length && <p className='no-margin'>-</p>}

                            {!!area.addresses && !!area.addresses.length &&
                              area.addresses.map((address, index) => {
                                return <p key={index} className='no-margin'>{getFullAddress(address)}</p>;
                              })
                            }
                          </Column>
                        </Row>
                      );
                    })}
                  </ListItems>
                </div>
              }
              <p className='sub-title'>Rakentamiskelpoisuus</p>
              {!constructabilityAreas.length && <p>Ei vuokrakohteita</p>}
              {!!constructabilityAreas.length &&
                constructabilityAreas.map((area, index) => {
                  return (
                    <ListItems key={index}>
                      <Row>
                        <Column><p className='no-margin'><strong>{area.identifier || '-'}</strong></p></Column>
                      </Row>
                      <Row>
                        <Column small={6} large={4}>
                          <p className='no-margin'>Esirakentaminen, johtosiirrot, kunnallistekniikka</p>
                        </Column>
                        <Column small={6} large={4}>
                          <StatusIndicator
                            researchState={area.preconstruction_state}
                            stateOptions={constructabilityStateOptions}
                          />
                        </Column>
                      </Row>
                      <Row>
                        <Column small={6} large={4}>
                          <p className='no-margin'>Purku</p>
                        </Column>
                        <Column small={6} large={4}>
                          <StatusIndicator
                            researchState={area.demolition_state}
                            stateOptions={constructabilityStateOptions}
                          />
                        </Column>
                      </Row>
                      <Row>
                        <Column small={6} large={4}>
                          <p className='no-margin'>Pima</p>
                        </Column>
                        <Column small={6} large={4}>
                          <StatusIndicator
                            researchState={area.polluted_land_state}
                            stateOptions={constructabilityStateOptions}
                          />
                        </Column>
                      </Row>
                      <Row>
                        <Column small={6} large={4}>
                          <p className='no-margin'>Rakennettavuusselvitys</p>
                        </Column>
                        <Column small={6} large={4}>
                          <StatusIndicator
                            researchState={area.constructability_report_state}
                            stateOptions={constructabilityStateOptions}
                          />
                        </Column>
                      </Row>
                      <Row>
                        <Column small={6} large={4}>
                          <p className='no-margin'>Muut</p>
                        </Column>
                        <Column small={6} large={4}>
                          <StatusIndicator
                            researchState={area.other_state}
                            stateOptions={constructabilityStateOptions}
                          />
                        </Column>
                      </Row>
                    </ListItems>
                  );
                })
              }
            </Collapse>

            <Collapse
              defaultOpen={true}
              headerTitle={
                <h3 className='collapse__header-title'>Tilastotiedot</h3>
              }
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
      noticePeriods: getNoticePeriods(state),
    };
  },
  {
    fetchLessors,
  }
)(Summary);
