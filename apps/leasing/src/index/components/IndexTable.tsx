import React from "react";
import { Table } from "hds-react";

type Props = {
  yearlyIndexes: Array<Record<string, any>>;
};

const IndexTable: React.FC<Props> = ({ yearlyIndexes }) => {
  const createTooltipColumn = (key: string, headerName: string) => ({
    key,
    headerName,
    transform: (row: any) => (
      <span title={`${row.year} ${headerName}: ${row[key]}`}>{row[key]}</span>
    ),
  });

  const columns = [
    {
      key: "year",
      headerName: "Vuosi",
      transform: ({ year }) => <strong>{year}</strong>,
    },
    createTooltipColumn("tammi", "Tammi"),
    createTooltipColumn("helmi", "Helmi"),
    createTooltipColumn("maalis", "Maalis"),
    createTooltipColumn("huhti", "Huhti"),
    createTooltipColumn("touko", "Touko"),
    createTooltipColumn("kesä", "Kesä"),
    createTooltipColumn("heinä", "Heinä"),
    createTooltipColumn("elo", "Elo"),
    createTooltipColumn("syys", "Syys"),
    createTooltipColumn("loka", "Loka"),
    createTooltipColumn("marras", "Marras"),
    createTooltipColumn("joulu", "Joulu"),
    createTooltipColumn("vuosika", "Vuosika."),
  ];

  const rows = yearlyIndexes.map((item) => ({
    id: item.id,
    year: item.year,
    tammi: item.indexList?.[1],
    helmi: item.indexList?.[2],
    maalis: item.indexList?.[3],
    huhti: item.indexList?.[4],
    touko: item.indexList?.[5],
    kesä: item.indexList?.[6],
    heinä: item.indexList?.[7],
    elo: item.indexList?.[8],
    syys: item.indexList?.[9],
    loka: item.indexList?.[10],
    marras: item.indexList?.[11],
    joulu: item.indexList?.[12],
    vuosika: item.indexList?.year,
  }));

  return (
    <Table
      indexKey="id"
      renderIndexCol={false}
      cols={columns}
      rows={rows}
      verticalLines
      dense
    />
  );
};

export default IndexTable;
