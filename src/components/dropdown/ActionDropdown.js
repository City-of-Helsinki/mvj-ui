// @flow
import React, {Component} from 'react';
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

class ActionDropdown extends Component<Props, State> {
  state = {
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

  render () {
    const {options, title} = this.props;
    const {isOpen} = this.state;
    const {toggle} = this;

    return (
      <div className='action-dropdown'>
        <div className='action-dropdown_title-wrapper'>
          <a onClick={this.toggle} className={classNames('title', {'isOpen': isOpen})}>{title}</a>
        </div>
        <div className={'action-dropdown_option-wrapper'}>
          <ul className={classNames({'is-open': isOpen})}>
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
        </div>
      </div>
    );
  }
}

export default ActionDropdown;
