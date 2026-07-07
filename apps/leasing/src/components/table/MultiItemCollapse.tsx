import React, { memo } from "react";
import classNames from "classnames";
import ListItem from "@/components/content/ListItem";
import { Tag, TagSize } from "hds-react";
type Props = {
  items: Array<any>;
  itemRenderer: (...args: Array<any>) => any;
  open: boolean;
  useTagForCount?: boolean;
};

const MultiItemCollapse: React.FC<Props> = ({
  items,
  itemRenderer,
  open,
  useTagForCount: useHdsTagForCount,
}) => {
  if (!items || !items.length) {
    return "-";
  }

  if (items.length === 1) {
    return itemRenderer(items[0]);
  }

  return (
    <div
      className={classNames("sortable-table__multi-item-collapse", {
        "is-open": open,
      })}
    >
      <div className="sortable-table__multi-item-collapse_header">
        <span className="sortable-table__multi-item-collapse_header_title">
          {itemRenderer(items[0])}
        </span>
        <div className="sortable-table__multi-item-collapse_header_arrow-wrapper">
          {useHdsTagForCount ? (
            <Tag size={TagSize.Small}>{String(items.length)}</Tag>
          ) : (
            <span>({items.length})</span>
          )}
        </div>
      </div>
      <div className="sortable-table__multi-item-collapse_items">
        {items.map((item, index) => {
          if (!index) return null;
          return <ListItem key={index}>{itemRenderer(item)}</ListItem>;
        })}
      </div>
    </div>
  );
};

export default memo(MultiItemCollapse);
