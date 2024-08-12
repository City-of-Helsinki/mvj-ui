import React, { PureComponent } from "react";
import classNames from "classnames";
import ListItem from "@/components/content/ListItem";
type Props = {
  items: Array<any>;
  itemRenderer: (...args: Array<any>) => any;
  open: boolean;
};

class MultiItemCollapse extends PureComponent<Props> {
  render() {
    const {
      items,
      itemRenderer,
      open
    } = this.props;

    if (!items || !items.length) {
      return '-';
    }

    if (items.length === 1) {
      return itemRenderer(items[0]);
    }

    return <div className={classNames('sortable-table__multi-item-collapse', {
      'is-open': open
    })}>
        <div className='sortable-table__multi-item-collapse_header'>
          <span className='sortable-table__multi-item-collapse_header_title'>{itemRenderer(items[0])}</span>
          <div className='sortable-table__multi-item-collapse_header_arrow-wrapper'>
            <span>({items.length})</span>
          </div>
        </div>
        <div className='sortable-table__multi-item-collapse_items'>
          {items.map((item, index) => {
          if (!index) return null;
          return <ListItem key={index}>
              {itemRenderer(item)}
            </ListItem>;
        })}
        </div>
      </div>;
  }

}

export default MultiItemCollapse;