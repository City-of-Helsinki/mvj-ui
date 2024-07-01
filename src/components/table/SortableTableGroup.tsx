import { $Shape } from "utility-types";
import React, { PureComponent, KeyboardEventHandler } from "react";
import classNames from "classnames";
import get from "lodash/get";
import isArray from "lodash/isArray";
import AccordionIcon from "components/icons/AccordionIcon";
import MultiItemCollapse from "./MultiItemCollapse";
import SortableTableRow from "./SortableTableRow";
import type { Column } from "./SortableTable";

const TableGroup = (props: Record<string, any>) => props.children.length ? props.children : null;

type Props = {
  columns: Array<Column>;
  id: string;
  grouping: Record<string, any> | null | undefined;
  onRowClick?: (...args: Array<any>) => any;
  row: Record<string, any>;
  selectedRow?: Record<string, any> | null;
  showCollapseArrowColumn?: boolean;
};
type State = {
  collapse: boolean;
};

class SortableTableGroup extends PureComponent<Props, State> {
  state: any = {
    collapse: false
  };
  handleCollapseArrowIconClick: () => void = () => {
    this.setState({
      collapse: !this.state.collapse
    });
  };
  handleCollapseArrowIconKeyDown: KeyboardEventHandler<HTMLAnchorElement> = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.handleCollapseArrowIconClick();
    }
  };
  shouldShowCollapseArrowIcon: () => boolean = () => {
    const {
      columns,
      row
    } = this.props;
    let showIcon = false;
    columns.forEach(column => {
      if (isArray(row[column.key]) && row[column.key].length > 1) {
        showIcon = true;
        return true;
      }
    });
    return showIcon;
  };
  forceUpdateHandler: () => void = () => {
    this.forceUpdate();
  };

  render(): React.ReactNode {
    const {
      columns,
      id,
      grouping,
      onRowClick,
      row,
      selectedRow,
      showCollapseArrowColumn
    } = this.props;
    const {
      collapse
    } = this.state;
    const showCollapseArrowIcon = this.shouldShowCollapseArrowIcon();
    return <TableGroup>
        <tr className='group-row' id={id}>
          {showCollapseArrowColumn && <td className={classNames('collapse-arrow-column', {
          'no-icon': !showCollapseArrowIcon
        })}>
              {
              showCollapseArrowIcon && <a className='sortable-table-row-collapse-link' onClick={this.handleCollapseArrowIconClick} onKeyDown={this.handleCollapseArrowIconKeyDown} tabIndex={0}>
                  <AccordionIcon className='sortable-table-row-collapse-icon' />
                </a>}
            </td>}
          {columns.map(({
          arrayRenderer,
          dataClassName,
          key,
          renderer
        }) => {
          const show = grouping ? grouping.columnKeys.indexOf(key) !== -1 : false;
          return show ? <td key={key} className={dataClassName}>
                {renderer ? isArray(get(row, key)) ? <MultiItemCollapse items={get(row, key)} itemRenderer={value => renderer(value, row, this) || '-'} open={collapse} /> : renderer(get(row, key), row, this) || '-' : isArray(get(row, key)) ? arrayRenderer ? arrayRenderer(get(row, key), this) : <MultiItemCollapse items={get(row, key)} itemRenderer={value => value || '-'} open={collapse} /> : get(row, key) || '-'}
              </td> : <td key={key}></td>;
        })}
        </tr>
        {row.tableRows.map((row, rowIndex) => {
        const isSelected = Boolean(selectedRow && selectedRow.id === row.id);
        return <SortableTableRow key={rowIndex} className='group-item-row' columns={columns} id={`row_${row.id}`} grouping={grouping} groupRow={true} isSelected={isSelected} onRowClick={onRowClick} row={row} showCollapseArrowColumn={showCollapseArrowColumn} />;
      })}
      </TableGroup>;
  }

}

export default SortableTableGroup;