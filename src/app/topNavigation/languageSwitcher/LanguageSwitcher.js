import React, {Component} from 'react';
import {withRouter} from 'react-router';
import i18n from '../../../root/i18n';
import ReactDOM from 'react-dom';
import forEach from 'lodash/forEach';

import LanguageSwitcherMenu from './LanguageSwitcherMenu';
import {Languages} from '../../../constants';

type Props = {
  location: Object,
  router: Object
};

class LanguageSwitcher extends Component {
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

  getLocationForNewLanguage = (prevPath, langKey) => {
    const {pathname, search, hash} = prevPath;
    const pathArr = pathname.split('/');
    pathArr.splice(1, 1, langKey);
    return `${pathArr.join('/')}${search}${hash}`;
  };

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
    const {router, location} = this.props;
    if (item.key !== i18n.language) {
      const newLocation = this.getLocationForNewLanguage(location, item.key);
      i18n.changeLanguage(item.key);
      router.push(newLocation);
    }

    this.setState({
      menuOpen: false,
    });
  };

  getActiveItem = () => {
    const {language} = i18n;
    let active = null;

    forEach(Languages, (item) => {
      if (item.key === language) {
        active = item;
        return false;
      }
    });

    return active;
  };

  render() {
    const active = this.getActiveItem();
    return (
      <div className="mvj-language-switcher">
        <a className="mvj-language-switcher__link" onClick={this.onLinkClick}>
          <i className="fa fa-globe"/>
          <span className="title">{active.text}</span>
          <i className="fa fa-caret-down" aria-hidden="true"/>
        </a>
        <LanguageSwitcherMenu
          open={this.state.menuOpen}
          active={active.key}
          items={Languages}
          onItemClick={this.onMenuItemClick}
        />
      </div>
    );
  }
}

export default withRouter(LanguageSwitcher);
