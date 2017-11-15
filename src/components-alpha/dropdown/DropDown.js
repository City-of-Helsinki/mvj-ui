import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import isEmpty from 'lodash/isEmpty';

import DropDownMenu from './DropDownMenu';

type Props = {
  active: String | Number,
  activeLabel: String,
  className: String,
  displayCaret: Boolean,
  icon: Object,
  iconPlacement: String,
  items: Array,
  onItemClick: Function,
  placeholder: String,
};

class DropDown extends Component {
  props: Props;

  constructor(props) {
    super(props);
    this.state = {
      menuOpen: false,
    };
  }

  componentWillMount() {
    document.addEventListener('click', this.onDocumentClick);
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onDocumentClick);
  }

  onDocumentClick = (event) => {
    const target = event.target,
      el = ReactDOM.findDOMNode(this);

    if (this.state.menuOpen && target !== el && !el.contains(target)) {
      this.setState({
        menuOpen: false,
      });
    }
  };

  onLinkClick = () => {
    this.setState({
      menuOpen: !this.state.menuOpen,
    });
  };

  onMenuItemClick = (item) => {
    const {onItemClick} = this.props;
    this.setState({
      menuOpen: false,
    });

    return onItemClick(item);
  };


  render() {
    const {
      active,
      activeLabel = 'label',
      className,
      displayCaret = true,
      icon,
      iconPlacement = 'left',
      items,
      placeholder,
    } = this.props;

    return (
      <div className={classNames('mvj-dropdown', className)}>
        <a className="mvj-dropdown__link" onClick={this.onLinkClick}>
          {icon && iconPlacement === 'left' && icon}
          {isEmpty(active) && placeholder && <span className="title">{placeholder}</span>}
          {!isEmpty(active) && <span className="title">{active[activeLabel]}</span>}
          {displayCaret && <i className="mi mi-keyboard-arrow-down" aria-hidden="true"/>}
          {icon && iconPlacement === 'right' && icon}
        </a>
        <DropDownMenu
          open={this.state.menuOpen}
          active={active}
          items={items}
          onItemClick={this.onMenuItemClick}
        />
      </div>
    );
  }
}

export default DropDown;
