// @flow
import React, {PureComponent} from 'react';
import classNames from 'classnames';

import AccordionIcon from '$components/icons/AccordionIcon';
import ListItem from '$components/content/ListItem';

type Props = {
  items: Array<any>,
  itemRenderer: Function,
}

type State = {
  open: boolean,
}

class MultiItemCollapse extends PureComponent<Props, State> {
  state = {
    open: false,
  }

  handleHeaderClick = () => {
    this.setState({
      open: !this.state.open,
    });
  }

  handleHeaderKeyDown = (e: any) => {
    if(e.keyCode === 13) {
      e.preventDefault();
      this.handleHeaderClick();
    }
  };

  render() {
    const {items, itemRenderer} = this.props;
    const {open} = this.state;

    if(!items || !items.length) {
      return '-';
    }

    if(items.length === 1) {
      return itemRenderer(items[0]);
    }

    return(
      <div className={classNames('sortable-table__multi-item-collapse', {'is-open': open})}>
        <div
          className='sortable-table__multi-item-collapse_header'
          onClick={this.handleHeaderClick}
          onKeyDown={this.handleHeaderKeyDown}
          tabIndex={0}
        >
          <span className='sortable-table__multi-item-collapse_header_title'>{itemRenderer(items[0])}</span>
          <div className='sortable-table__multi-item-collapse_header_arrow-wrapper'>
            <span>({items.length})</span>
            <AccordionIcon className="arrow-icon"/>
          </div>
        </div>
        <div className='sortable-table__multi-item-collapse_items'>
          {items.map((item, index) => {
            if(!index) return null;

            return <ListItem key={index}>
              {itemRenderer(item)}
            </ListItem>;
          })}
        </div>
      </div>
    );
  }
}

export default MultiItemCollapse;
