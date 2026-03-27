import React from "react";
import { groupBy } from "lodash/collection";
import SortableTable from "@/components/table/SortableTable";
import FormFieldLegacy from "@/components/form/FormFieldLegacy";
import { FieldTypes } from "@/enums";
import type { Column } from "@/components/table/SortableTable";
type Props = {
  items: Array<Record<string, any>>;
  onItemChange: (arg0: Record<string, any>, arg1: boolean) => void;
  columns: Array<Column>;
  firstCheckboxOnly: boolean;
};
type CheckboxProps = {
  item: Record<string, any>;
  onItemChange: (arg0: Record<string, any>, arg1: boolean) => void;
};

const PlotSearchExportModalTargetTableCheckbox = ({
  item,
  onItemChange,
}: CheckboxProps): JSX.Element => {
  return (
    <FormFieldLegacy
      name={`items.${item.application_identifier}`}
      fieldAttributes={{
        type: FieldTypes.CHECKBOX,
        label: "Valitse hakemus " + item.application_identifier,
        read_only: false,
      }}
      autoBlur
      disableDirty
      invisibleLabel
      overrideValues={{
        options: [
          {
            value: true,
            label: "",
          },
        ],
      }}
      onBlur={onItemChange}
    />
  );
};

const PlotSearchExportModalTargetTable = ({
  items,
  onItemChange,
  columns,
  firstCheckboxOnly,
}: Props): JSX.Element => {
  const groupedItems = groupBy(items, "answer_id");
  return (
    <SortableTable
      listTable
      className="PlotSearchExportModalTargetTable"
      data={Object.keys(groupedItems).map((name) => {
        const group = groupedItems[name];
        return {
          id: name,
          checkbox: (
            <>
              {(firstCheckboxOnly ? group.slice(0, 1) : group).map((item) => (
                <PlotSearchExportModalTargetTableCheckbox
                  item={item}
                  onItemChange={(event, value) => onItemChange(item, value)}
                  key={item.application_identifier}
                />
              ))}
            </>
          ),
          application_identifier: (
            <ul>
              {group.map((item, i) => (
                <li key={i}>{item.application_identifier}</li>
              ))}
            </ul>
          ),
          target_identifier: (
            <ul>
              {group.map((item, i) => (
                <li key={i}>{item.target_identifier}</li>
              ))}
            </ul>
          ),
          applicants: (
            <ul>
              {group[0].applicants.map((applicant, i) => (
                <li key={i}>{applicant}</li>
              ))}
            </ul>
          ),
        };
      })}
      columns={columns}
    />
  );
};

export default PlotSearchExportModalTargetTable;
