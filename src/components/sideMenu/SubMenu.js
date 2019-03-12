// @flow
import React, {PureComponent} from 'react';
import ReactDOM from 'react-dom';
import {Link} from 'react-router-dom';
import classNames from 'classnames';

import BackIcon from '$components/icons/BackIcon';
import Authorization from '$components/authorization/Authorization';
import {KeyCodes} from '$src/enums';

type Props = {
  header: string,
  isOpen: boolean,
  items: Array<Object>,
  menuKey: string,
  onHeaderClick: Function,
};

class SubMenu extends PureComponent<Props> {
  componentDidMount() {
    document.addEventListener('click', this.onDocumentClick);
    document.addEventListener('keydown', this.onDocumentKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick);
    document.removeEventListener('keydown', this.onDocumentKeyDown);
  }

  onDocumentClick = (event: any) => {
    const {isOpen, onHeaderClick} = this.props;
    const target = event.target,
      el = ReactDOM.findDOMNode(this);

    if (isOpen && el && target !== el && !el.contains(target)) {
      onHeaderClick('');
    }
  };

  onDocumentKeyDown = (event: any) => {
    const {isOpen, onHeaderClick} = this.props;

    if(isOpen && event.keyCode === KeyCodes.ESC){
      onHeaderClick('');
    }
  }

  handleHeaderClick = () => {
    const {isOpen, menuKey, onHeaderClick} = this.props;

    onHeaderClick(isOpen ? '' : menuKey);
  };

  handleHeaderKeyDown = (e: any) => {
    if(e.keyCode === KeyCodes.ENTER){
      e.preventDefault();
      this.handleHeaderClick();
    }
  };

  render() {
    const {
      header,
      isOpen,
      items,
    } = this.props;

    return(
      <li className={classNames('side-menu__submenu', {'side-menu__submenu--is-open': isOpen})}>
        <a
          className='side-menu__submenu_header'
          onKeyDown={this.handleHeaderKeyDown}
          onClick={this.handleHeaderClick}
          tabIndex={0}
        >
          <span>{header}</span>
          <BackIcon className='icon-small'/>
        </a>
        <ul className='side-menu__submenu_items'>
          {items.map((item, index) => {
            return(
              <Authorization allow={item.allow} key={index}>
                <li><Link onClick={item.onClick} to={item.to}>{item.text}</Link></li>
              </Authorization>
            );
          })}
        </ul>
      </li>
    );
  }
}

export default SubMenu;
