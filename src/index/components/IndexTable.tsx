import React from "react";
type Props = {
  yearlyIndexes: Array<Record<string, any>>;
};

const IndexTable = ({ yearlyIndexes }: Props) => {
  return (
    <div className="sortable-table__container">
      <table className="list-table">
        <thead>
          <tr>
            <td></td>
            <th>
              <div>Tammi</div>
            </th>
            <th>
              <div>Helmi</div>
            </th>
            <th>
              <div>Maalis</div>
            </th>
            <th>
              <div>Huhti</div>
            </th>
            <th>
              <div>Touko</div>
            </th>
            <th>
              <div>Kesä</div>
            </th>
            <th>
              <div>Heinä</div>
            </th>
            <th>
              <div>Elo</div>
            </th>
            <th>
              <div>Syys</div>
            </th>
            <th>
              <div>Loka</div>
            </th>
            <th>
              <div>Marras</div>
            </th>
            <th>
              <div>Joulu</div>
            </th>
            <th>
              <div>Vuosika.</div>
            </th>
          </tr>
        </thead>
        <tbody>
          {!yearlyIndexes.length && (
            <tr className="no-data-row">
              <td colSpan={14}>Ei indeksejä</td>
            </tr>
          )}

          {!!yearlyIndexes.length &&
            yearlyIndexes.map((item, index) => {
              return (
                <tr key={index}>
                  <th>{item.year}</th>
                  <td>{item.indexList["1"]}</td>
                  <td>{item.indexList["2"]}</td>
                  <td>{item.indexList["3"]}</td>
                  <td>{item.indexList["4"]}</td>
                  <td>{item.indexList["5"]}</td>
                  <td>{item.indexList["6"]}</td>
                  <td>{item.indexList["7"]}</td>
                  <td>{item.indexList["8"]}</td>
                  <td>{item.indexList["9"]}</td>
                  <td>{item.indexList["10"]}</td>
                  <td>{item.indexList["11"]}</td>
                  <td>{item.indexList["12"]}</td>
                  <td>{item.indexList["year"]}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default IndexTable;
