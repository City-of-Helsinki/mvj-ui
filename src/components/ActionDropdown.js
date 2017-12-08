// @flow
import React, {Component} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import {get} from 'lodash';

type Props = {
  title: string,
  options: Array<Object>,
}

type State = {
  isOpen: boolean,
  isMounted: boolean,
}

class ActionDropdown extends Component {
  props: Props

  state: State = {
    isOpen: false,
    isMounted: true,
  }

  _isMounted: boolean

  componentWillMount() {
    this._isMounted = true;
    document.addEventListener('click', this.onDocumentClick);
  }

  componentWillUnmount() {
    this._isMounted = false;
    document.removeEventListener('click', this.onDocumentClick);
  }

  onDocumentClick = (event: any) => {
    if(!this._isMounted) {
      return;
    }

    const target = event.target,
      el = ReactDOM.findDOMNode(this);

    if (this.state.isOpen && target !== el && el && !el.contains(target)) {
      this.setState({
        isOpen: false,
      });
    }
  };

  toggle = () => {
    this.setState({isOpen: !this.state.isOpen});
  }

  getItems = () => {
    const {options} = this.props;
    const {isOpen} = this.state;
    const {toggle} = this;

    if(!isOpen) {
      return '';
    }
    return (
      <ul>
        {options.map((option, index) => {
          return (
            <li className='option' key={index} onClick={() => {
              const {action} = option;
              if(action) {
                action();
                toggle();
              } else {
                toggle();
              }
            }}>
              <a>{get(option, 'label')}</a>
            </li>
          );
        }
        )}
      </ul>
    );
  }

  render () {
    const {title} = this.props;
    const {isOpen} = this.state;
    const items = this.getItems();

    return (
      <div className='action-dropdown'>
        <div className='action-dropdown_title-wrapper'>
          <a onClick={this.toggle} className={classNames('title', {'isOpen': isOpen})}>{title}</a>
        </div>
        <div className={'action-dropdown_option-wrapper'}>
          <ReactCSSTransitionGroup
            transitionName='action-dropdown-transition'
            transitionEnterTimeout={300}
            transitionLeaveTimeout={300}
          >
            {items}
          </ReactCSSTransitionGroup>
        </div>
      </div>
    );
  }
}

export default ActionDropdown;
