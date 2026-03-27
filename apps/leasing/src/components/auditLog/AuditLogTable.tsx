import React from "react";
import AuditLogTableItem from "./AuditLogTableItem";
type Props = {
  items: Array<Record<string, any>>;
};

const AuditLogTable = ({ items }: Props) => {
  return (
    <div className="sortable-table__container">
      <table className="sortable-table">
        <thead>
          <tr>
            <td></td>
            <th
              style={{
                width: "16.7%",
              }}
            >
              <div>Pvm</div>
            </th>
            <th
              style={{
                width: "16.7%",
              }}
            >
              <div>Nimi</div>
            </th>
            <th
              style={{
                width: "16.7%",
              }}
            >
              <div>Muutoksen tyyppi</div>
            </th>
            <th
              style={{
                width: "16.7%",
              }}
            >
              <div>Muutoksen kohde</div>
            </th>
            <th
              style={{
                width: "16.7%",
              }}
            >
              <div>Vanha arvo</div>
            </th>
            <th
              style={{
                width: "16.7%",
              }}
            >
              <div>Uusi arvo</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {!items.length && (
            <tr className="no-data-row">
              <td colSpan={7}>Ei muutoksia</td>
            </tr>
          )}

          {items.map((item, index) => (
            <AuditLogTableItem key={`${index}_${item.object_id}`} item={item} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuditLogTable;
