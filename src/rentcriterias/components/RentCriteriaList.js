// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Row, Column} from 'react-foundation';
import flowRight from 'lodash/flowRight';

import {fetchRentCriterias} from '../actions';
import {getIsFetching, getRentCriteriasList} from '../selectors';
import {formatDateObj, getLabelOfOption} from '../../util/helpers';
import {purposeOptions} from '../constants';
import EditableMap from '../../components/map/EditableMap';
import Loader from '../../components/loader/Loader';
import Table from '../../components/table/Table';
import TableControllers from '../../components/table/TableControllers';

import mapGreenIcon from '../../../assets/icons/map-green.svg';
import mapIcon from '../../../assets/icons/map.svg';
import tableGreenIcon from '../../../assets/icons/table-green.svg';
import tableIcon from '../../../assets/icons/table.svg';

type Props = {
  fetchRentCriterias: Function,
  isFetching: boolean,
  rentcriterias: Array<Object>,
}

type State = {
  visualizationType: string,
}

class RentCriteriaList extends Component {
  props: Props

  state: State = {
    visualizationType: 'table',
  }

  componentWillMount() {
    const {fetchRentCriterias} = this.props;
    fetchRentCriterias();
  }

  render() {
    const {isFetching, rentcriterias} = this.props;
    const {visualizationType} = this.state;

    return (
      <div className='rent-criteria-list'>
        <Row>
          <Column>
            <TableControllers
              iconSelectorOptions={[
                {value: 'table', label: 'Taulukko', icon: tableIcon, iconSelected: tableGreenIcon},
                {value: 'map', label: 'Kartta', icon: mapIcon, iconSelected: mapGreenIcon}]
              }
              iconSelectorValue={visualizationType}
              onIconSelectorChange={
                (value) => this.setState({visualizationType: value})
              }
              title={`Viimeksi muokattuja`}
            />
          </Column>
        </Row>
        {isFetching && <Row><Column><div className='loader__wrapper'><Loader isLoading={isFetching} /></div></Column></Row>}
        {!isFetching &&
          <div>
            {visualizationType === 'table' && (
              <Row>
                <Column>
                  <Table
                    amount={rentcriterias.length}
                    data={rentcriterias}
                    dataKeys={[
                      {key: 'real_estate_ID', label: 'Kiinteistötunnus'},
                      {key: 'purpose', label: 'Pääkäyttötarkoitus', renderer: (val) => val ? getLabelOfOption(purposeOptions, val) : '-'},
                      {key: 'end_date', label: 'Loppupvm', renderer: (val) => formatDateObj(val, 'DD.MM.YYYY')},
                      {key: 'start_date', label: 'Alkupvm', renderer: (val) => formatDateObj(val, 'DD.MM.YYYY')},
                    ]}
                    onRowClick={(item) => console.log(item)}
                  />
                </Column>
              </Row>
            )}
            {visualizationType === 'map' && (
              <Row>
                <Column>
                  <EditableMap />
                </Column>
              </Row>
            )}
          </div>
        }
      </div>
    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        isFetching: getIsFetching(state),
        rentcriterias: getRentCriteriasList(state),
      };
    },
    {
      fetchRentCriterias,
    },
  ),
)(RentCriteriaList);
