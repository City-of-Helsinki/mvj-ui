import React from 'react';
import classNames from 'classnames';

type Props = {
  items: Array,
  onItemClick: Function,
  active: String,
  open: Boolean,
};

const defaultOnItemClick = (item) => {
  console.log('LanguageChooserMenu - onItemClick', item);
};

const LanguageChooserMenu = ({items, open = false, active, onItemClick = defaultOnItemClick}: Props) =>
  <div className={classNames('mvj-language-switcher-menu', {
    'mvj-language-switcher-menu--open': open,
  })}>
    <ul>
      {items.map((item, i) => <li key={i}>
        <a className={classNames('mvj-language-switcher-menu__link', {
          'mvj-language-switcher-menu__link--active': active === item.key,
        })} onClick={() => {
          onItemClick(item);
        }}>{item.text}</a>
      </li>)}
    </ul>
  </div>;

export default LanguageChooserMenu;
