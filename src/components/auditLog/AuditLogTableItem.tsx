import React, { Fragment, PureComponent } from "react";
import classNames from "classnames";
import AccordionIcon from "@/components/icons/AccordionIcon";
import AuditLogTableItemChange from "./AuditLogTableItemChange";
import { formatDate } from "@/util/helpers";
import { getAuditLogActionTypeInFinnish } from "@/auditLog/helpers";
import { getUserFullName } from "@/users/helpers";
type Props = {
  item: Record<string, any>;
};
type State = {
  collapse: boolean;
};

class AuditLogTableItem extends PureComponent<Props, State> {
  state = {
    collapse: false,
  };
  handleCollapseArrowIconClick = () => {
    this.setState({
      collapse: !this.state.collapse,
    });
  };
  handleCollapseArrowIconKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      this.handleCollapseArrowIconClick();
    }
  };

  render() {
    const { item } = this.props;
    const { collapse } = this.state;
    const changes = Object.keys(item.changes).map((key) => {
      return {
        key: key,
        newValue: item.changes[key][1] !== "None" ? item.changes[key][1] : null,
        oldValue: item.changes[key][0] !== "None" ? item.changes[key][0] : null,
      };
    });
    const showCollapseIcon = !!changes.length;
    return (
      <Fragment>
        <tr
          className={classNames({
            collapsed: collapse,
          })}
        >
          <td className="collapse-arrow-column">
            {showCollapseIcon && (
              <a
                className="sortable-table-row-collapse-link"
                onClick={this.handleCollapseArrowIconClick}
                onKeyDown={this.handleCollapseArrowIconKeyDown}
                tabIndex={0}
              >
                <AccordionIcon className="sortable-table-row-collapse-icon" />
              </a>
            )}
          </td>
          <td>{formatDate(item.timestamp) || "-"}</td>
          <td>{getUserFullName(item.actor) || "-"}</td>
          <td>{getAuditLogActionTypeInFinnish(item.action) || "-"}</td>
          <td>
            {item.content_type_name} ({item.object_id})
          </td>
          <td></td>
          <td></td>
        </tr>
        {collapse &&
          !!changes &&
          changes.map((change, index) => {
            return (
              <AuditLogTableItemChange
                key={index}
                change={change}
                contentType={item.content_type}
              />
            );
          })}
      </Fragment>
    );
  }
}

export default AuditLogTableItem;
