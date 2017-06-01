// @flow
import React, {Component} from 'react';
import get from 'lodash/get';
import flowRight from 'lodash/flowRight';
import {translate} from 'react-i18next';
import {Column, Row} from 'react-foundation';
import {connect} from 'react-redux';
import {getFormInitialValues, reduxForm} from 'redux-form';
import {revealContext} from '../../../foundation/reveal';

import {Sizes} from '../../../foundation/enums';

import EditModal from '../../../components/editModal/editModal';
import ConditionsEdit from './ConditionsEdit';

type Props = Object;

type State = {
  isEditing: boolean,
  activeCondition: Object | null,
  activeIndex: number | null,
  conditions: Object | null,
}

class Conditions extends Component {
  props: Props;
  state: State;

  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      activeCondition: null,
      activeIndex: null,
      conditions: null,
    };
  }

  componentWillMount() {
    const {conditions} = this.props;
    this.setState({conditions});
  }

  componentWillReceiveProps(nextProps) {
    const {conditions} = nextProps;
    this.setState({conditions});
  }

  displayEditModal = (activeCondition = null, activeIndex = null) => {
    this.setState({
      isEditing: true,
      activeCondition,
      activeIndex,
    });
  };

  handleEditSave = (values) => {
    const {array} = this.props;
    const {activeIndex} = this.state;

    array.splice('conditions', activeIndex, 1, values);

    this.setState({
      isEditing: false,
      activeCondition: null,
      activeIndex: null,
    }, () => this.props.closeReveal('editModal'));
  };

  handleCreateNew = (values) => {
    const {array} = this.props;
    array.push('conditions', values);

    this.setState({
      isEditing: false,
      activeCondition: null,
      activeIndex: null,
    }, () => this.props.closeReveal('editModal'));
  };

  handleDelete = () => {
    const {array} = this.props;
    const {activeIndex} = this.state;
    array.remove('conditions', activeIndex);
    this.setState({
      isEditing: false,
      activeCondition: null,
      activeIndex: null,
    }, () => this.props.closeReveal('editModal'));
  };

  handleDismissEditModal = () => {
    const {initialValues: {conditions}} = this.props;
    this.setState({
      isEditing: false,
      activeCondition: null,
      activeIndex: null,
      conditions,
    }, () => this.props.closeReveal('editModal'));
  };

  render() {
    const {attributes, className, conditions, t} = this.props;

    return (
      <Row className={className}>
        <Column medium={12}>
          <h1 className="tab__content--title">{t('conditions.title')}</h1>
        </Column>

        {conditions && conditions.map((condition, i) =>
          <section key={i} className="data-box">
            <div className="data-box__header">
              <h2>{t(`leases:conditions.types.${get(condition, 'type')}`)} <span
                className="identifier">{get(condition, 'description')}</span></h2>
            </div>
            <div className="data-box__controls">
              <span onClick={() => this.displayEditModal(condition, i)}
                    className="edit">{t('conditions.editCondition')}</span>
            </div>
          </section>
        )}
        <Row className="section__controls">
          <Column medium={12}>
            <button className="add-new-button"
                    onClick={() => this.displayEditModal()}>{t('conditions.addCondition')}</button>
          </Column>
        </Row>

        {this.state.isEditing &&
        <EditModal size={Sizes.LARGE}
                   isOpen={this.state.isEditing}
                   component={ConditionsEdit}
                   handleEdit={this.handleEditSave}
                   handleCreate={this.handleCreateNew}
                   handleDelete={this.handleDelete}
                   handleDismiss={this.handleDismissEditModal}
                   attributes={attributes}
                   activeCondition={this.state.activeCondition}
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
  translate(['common', 'leases']),
  revealContext(),
)(Conditions);
