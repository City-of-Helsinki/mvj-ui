import React, { useState } from "react";
import {
  Button,
  ButtonVariant,
  SearchInput,
  Checkbox,
  SelectionGroup,
  Breadcrumb,
  Link,
  Table,
  IconPlus,
} from "hds-react";
import { mockLandUseList } from "../mocks/landUseMockData";

type LandUseAgreement = (typeof mockLandUseList)[number];


const LandUseListPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterVireilla, setFilterVireilla] = useState(false);
  const [filterNeuvotteilla, setFilterNeuvotteilla] = useState(false);
  const [filterPaatos, setFilterPaatos] = useState(false);

  const clearSearch = () => {
    setSearchQuery("");
  };

  const filteredData = mockLandUseList.filter((item: LandUseAgreement) =>
    Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(searchQuery.toLowerCase()),
    ),
  );

  return (
    <div className="landuse-list">
      <Breadcrumb
        aria-label="Breadcrumb"
        list={[
          { title: "Maanvuokrausjärjestelmä", path: "/" },
          { title: "Maankäyttösopimukset", path: "/maankayttosopimukset" },
          { title: "Lista", path: "" },
        ]}
      />

      <div className="landuse-list__header">
        <Button
          iconStart={<IconPlus />}
          onClick={() => console.log("Navigate to create new")}
        >
          Luo uusi maankäyttösopimustunnus
        </Button>

        <div className="landuse-list__search-group">
          <SearchInput
            id="search"
            label=""
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={(value) => console.log("Search submitted:", value)}
            placeholder="Etsi sopimuksella, osapuolella tai asemakaavalla"
          />
          {searchQuery && (
            <Button
              variant={ButtonVariant.Supplementary}
              iconStart={<span>×</span>}
              onClick={clearSearch}
            >
              Tyhjennä haku
            </Button>
          )}
        </div>
      </div>

      <div className="landuse-list__filters">
        <div className="landuse-list__filters-content">
          <SelectionGroup label="Suodatus" direction="horizontal">
            <Checkbox
              id="filter-vireilla"
              label="Vireillä"
              checked={filterVireilla}
              onChange={(e) => setFilterVireilla(e.target.checked)}
            />
            <Checkbox
              id="filter-neuvotteilla"
              label="Neuvotteilla"
              checked={filterNeuvotteilla}
              onChange={(e) => setFilterNeuvotteilla(e.target.checked)}
            />
            <Checkbox
              id="filter-paatos"
              label="Päätös"
              checked={filterPaatos}
              onChange={(e) => setFilterPaatos(e.target.checked)}
            />
          </SelectionGroup>
        </div>
        <span className="landuse-list__result-count">
          Löytyi {filteredData.length} kpl
        </span>
      </div>

      {/* Search Results Table */}
      {filteredData.length > 0 ? (
        <div className="landuse-list__table-wrapper">
          <Table
            cols={[
              {
                key: "identifier",
                headerName: "MA-tunnus",
                transform: (row) => (
                  <Link href={`/maankayttosopimukset/${row.identifier}`}>
                    {row.identifier}
                  </Link>
                ),
              },
              { key: "party", headerName: "Osapuoli" },
              { key: "zoningPlanNumber", headerName: "Asemakaavan numero" },
              { key: "target", headerName: "Kohde" },
              { key: "projectArea", headerName: "Hankealue" },
              { key: "negotiationPhase", headerName: "Neuvotteluvaihe" },
            ]}
            indexKey="identifier"
            rows={filteredData}
            renderIndexCol={false}
            variant="light"
          />
        </div>
      ) : (
        <div className="landuse-list__empty-state">
          <p>
            Hakutuloksia ei löytynyt. Tarkista hakuehdot ja yritä uudelleen.
          </p>
        </div>
      )}
    </div>
  );
};

export default LandUseListPage;
