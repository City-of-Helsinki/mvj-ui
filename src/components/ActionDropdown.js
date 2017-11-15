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
}

class ActionDropdown extends Component {
  props: Props

  state: State = {
    isOpen: false,
  }

  componentWillMount() {
    document.addEventListener('click', this.onDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick);
  }

  onDocumentClick = (event: any) => {
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
    const {title, options} = this.props;
    const {isOpen} = this.state;
    return (
      <div className='action-dropdown'>
        <div className='action-dropdown_title-wrapper'>
          <a onClick={this.toggle} className={classNames('title', {'isOpen': isOpen})}>{title}</a>
        </div>
        {isOpen && (
          <div className={'action-dropdown_option-wrapper'}>
            <ul>
              {options.map((option, index) => {
                return (
                  <li className='option' key={index}><a>{get(option, 'label')}</a></li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    );
  }
}

export default ActionDropdown;
