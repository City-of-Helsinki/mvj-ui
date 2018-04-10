// @flow
import React from 'react';

import {
  formatNumberWithThousandSeparator,
  getAttributeFieldOptions,
  getLabelOfOption,
} from '$util/helpers';
import Table from '$components/table/Table';

import type {Attributes} from '$src/leases/types';

type Props = {
  attributes: Attributes,
  basisOfRents: Array<Object>,
}

const BasisOfRents = ({attributes, basisOfRents}: Props) => {
  const intendedUseOptions = getAttributeFieldOptions(attributes,
    'basis_of_rents.child.children.intended_use');
  return (
    <div>
      <Table
        className='secondary-table'
        data={basisOfRents}
        dataKeys={[
          {key: 'intended_use', label: 'Käyttötarkoitus', renderer: (val) => getLabelOfOption(intendedUseOptions, val) || '-'},
          {key: 'floor_m2', label: 'K-m2', renderer: (val) => formatNumberWithThousandSeparator(val) || '-'},
          {key: 'index', label: 'Indeksi', renderer: (val) => formatNumberWithThousandSeparator(val) || '-'},
          {key: 'amount_per_floor_m2_index_100', label: '€/k-m2 (ind 100)', renderer: (val) => formatNumberWithThousandSeparator(val) || '-'},
          {key: 'amount_per_floor_m2_index', label: '€/k-m2 (ind)', renderer: (val) => formatNumberWithThousandSeparator(val) || '-'},
          {key: 'percent', label: 'Prosenttia', renderer: (val) => val ? `${formatNumberWithThousandSeparator(val)} %` : '-'},
          {key: 'year_rent_index_100', label: 'Perusvuosivuokra €/v (ind 100)', renderer: (val) => formatNumberWithThousandSeparator(val) || '-'},
          {key: 'year_rent_index', label: 'Alkuvuosivuokra €/v (ind)', renderer: (val) => formatNumberWithThousandSeparator(val) || '-'},
        ]}
        noDataText='Ei vuokranperusteita'
      />
    </div>
  );
};

export default BasisOfRents;
