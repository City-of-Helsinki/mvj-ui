// @flow
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {translate} from 'react-i18next';
import flowRight from 'lodash/flowRight';
import get from 'lodash/get';
import {reduxForm, getFormInitialValues} from 'redux-form';
import {Row, Column} from 'react-foundation';

import {revealContext} from '../../../foundation/reveal';
import {Sizes} from '../../../foundation/enums';

import GroupTitle from '../../../components/form/GroupTitle';
import Table from '../../../components/table/Table';

import EditModal from '../../../components/editModal/editModal';
import PropertyUnitEdit from './PropertyUnitEdits';

const links = [
  'Kiinteistörekisteriote',
  'Muodostumisketju eteenpäin',
  'Lainhuutotodistus',
  'Muodostumisketju taaksepäin',
  'Kiinteistörekisterin karttaote',
  'Voimassa olevat muodostuneet',
  'Rasitustodistus',
  'Muodostajarekisteriyksiköt ajankohtana',
  'Omistajien yhteystiedot',
  'Muodostajaselvitys',
];

type Props = Object;

type State = {
  isEditing: boolean,
  activePropertyUnit: number | null,
  real_property_units: Array<any> | null,
}

class RealProperyUnits extends Component {
  props: Props;
  state: State;

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      activePropertyUnit: null,
      real_property_units: null,
    };
  }

  componentWillMount() {
    const {real_property_units} = this.props;
    this.setState({real_property_units});
  }

  componentWillReceiveProps(nextProps) {
    const {real_property_units} = nextProps;
    if (this.props.real_property_units && this.props.real_property_units.length !== real_property_units.length) {
      this.setState({real_property_units});
    }
  }

  displayEditModal = (id = null) => {
    this.setState({
      isEditing: true,
      activePropertyUnit: id,
    });
  };

  handleEditSave = ({real_property_units}) => {
    this.setState({
      isEditing: false,
      activePropertyUnit: null,
      real_property_units,
    }, () => this.props.closeReveal('editModal'));
  };


  handleCreateNew = ({real_property_units: {NEW}}) => {
    const {array} = this.props;
    array.push('real_property_units', NEW);
    this.setState({isEditing: false, activePropertyUnit: null}, () => this.props.closeReveal('editModal'));
  };

  handleDelete = () => {
    const {array} = this.props;
    const {activePropertyUnit} = this.state;
    array.remove('real_property_units', activePropertyUnit);
    this.setState({isEditing: false, activePropertyUnit: null}, () => this.props.closeReveal('editModal'));
  };

  handleDismissEditModal = () => {
    const {initialValues: {real_property_units}} = this.props;
    this.setState({
      isEditing: false,
      activePropertyUnit: null,
      real_property_units,
    }, () => this.props.closeReveal('editModal'));
  };

  render() {
    const {className} = this.props;
    const {real_property_units} = this.state;

    return (

      <Row className={className}>
        <Column medium={12}>
          <h1 className="tab__content--title">Kiinteistöt</h1>
        </Column>

        {real_property_units && real_property_units.map((property, i) => (
          <section key={i} className="data-box">
            <div className="data-box__header">
              <h2>{get(property, 'identification_number') || ' - '} <span
                className="identifier">{get(property, 'name') || ' - '}</span></h2>
              <div className="data-box__header--item">
                <span className="identifier">Rekisteröity</span>
                {get(property, 'registry_date') || ' - '}
              </div>
              <div className="data-box__header--item">
                <span className="identifier">Pinta-ala</span>
                {get(property, 'area')}m<sup>2</sup>
              </div>
            </div>

            <div className="data-box__content">
              <div className="data-box__content--section">
                <h3>Tonttijako</h3>

                <Table
                  dataKeys={[
                    {key: 'tunnus', label: 'Tunnus'},
                    {key: 'laji', label: 'Laji'},
                    {key: 'approved', label: 'Hyväksytty'},
                    {key: 'state', label: 'Vaihe'},
                  ]}
                  data={[
                    {id: 1, tunnus: '11077', laji: 'Perustava tonttijako', approved: '3.3.2017', state: 'Voimassa'},
                  ]}
                />
              </div>

              <div className="data-box__content--section">
                <h3>Asemakaava</h3>

                <Table
                  dataKeys={[
                    {key: 'tunnus', label: 'Tunnus'},
                    {key: 'laji', label: 'Laji'},
                    {key: 'approved', label: 'Hyväksytty'},
                    {key: 'state', label: 'Vaihe'},
                  ]}
                  data={[
                    {id: 1, tunnus: '11077', laji: 'Perustava tonttijako', approved: '3.3.2017', state: 'Voimassa'},
                  ]}
                />
              </div>

              <GroupTitle text="KTJ-dokumentit"/>

              <Column medium={12}>
                <ul className="bordered__list">
                  {links.map((link, i) => (
                    <li key={i}>{link}
                      <div className="links">
                        <a href="#" target="_blank">fi</a>
                        <a href="#" target="_blank">se</a>
                      </div>
                    </li>
                  ))}
                </ul>
              </Column>

              <div className="data-box__controls">
                <span onClick={() => this.displayEditModal(i)} className="edit">Muokkaa</span>
              </div>
            </div>
          </section>
        ))}

        <Row className="section__controls">
          <Column medium={12}>
            <button className="add-new-button" onClick={() => this.displayEditModal()}>Lisää kiinteistö</button>
          </Column>
        </Row>

        {this.state.isEditing &&
        <EditModal size={Sizes.LARGE}
                   isOpen={this.state.isEditing}
                   component={PropertyUnitEdit}
                   handleEdit={this.handleEditSave}
                   handleCreate={this.handleCreateNew}
                   handleDelete={this.handleDelete}
                   handleDismiss={this.handleDismissEditModal}
                   activePropertyUnit={this.state.activePropertyUnit}
        />
        }
      </Row>

    );
  }
}

export default flowRight(
  connect(
    (state) => {
      return {
        initialValues: getFormInitialValues('preparer-form')(state),
      };
    },
  ),
  reduxForm({
    form: 'preparer-form',
    destroyOnUnmount: false,
  }),
  translate(['leases']),
  revealContext(),
)(RealProperyUnits);
