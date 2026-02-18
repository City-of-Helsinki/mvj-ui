import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Button,
  ButtonVariant,
  Dialog,
  SearchInput,
  Checkbox,
  SelectionGroup,
  Breadcrumb,
  Link,
  Table,
  IconPlus,
  Select,
} from "hds-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { parseUrlParams, buildQueryString } from "../urlParams";
import {
  createLandUseIdentifier,
  getNextLandUseSequence,
} from "../utils/landUseIdentifier";
import {
  createLandUseAgreement,
  getAgreementIdentifiers,
  getLandUseList,
} from "../api/landUseApi";
import type { LandUseListItem } from "../api/landUseListTypes";
import { DISTRICT_OPTIONS, MUNICIPALITY_OPTIONS } from "../utils/landUseLookup";

// Negotiation phase constants matching mockData values
const NEGOTIATION_PHASES = {
  VIREILLA: "Vireillä",
  NEUVOTTEILLA: "Neuvotteilla",
  PAATOS: "Päätös",
} as const;

type NegotiationPhase =
  (typeof NEGOTIATION_PHASES)[keyof typeof NEGOTIATION_PHASES];

const LandUseListPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [landUseData, setLandUseData] = useState<LandUseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedMunicipality, setSelectedMunicipality] = useState<
    string | undefined
  >(undefined);
  const [selectedDistrict, setSelectedDistrict] = useState<string | undefined>(
    undefined,
  );

  const resetCreateDialog = () => {
    setSelectedMunicipality(undefined);
    setSelectedDistrict(undefined);
    setIsCreateDialogOpen(false);
  };

  const agreementIdentifiersQuery = useQuery({
    queryKey: ["land-use", "identifiers"],
    queryFn: getAgreementIdentifiers,
    refetchOnWindowFocus: false,
  });

  const landUseListQuery = useQuery({
    queryKey: ["land-use", "list"],
    queryFn: getLandUseList,
    refetchOnWindowFocus: false,
  });

  const createAgreementMutation = useMutation({
    mutationFn: ({
      municipalityId,
      districtId,
    }: {
      municipalityId: string;
      districtId: string;
    }) => createLandUseAgreement(municipalityId, districtId),
    onSuccess: (identifier) => {
      queryClient.invalidateQueries({ queryKey: ["land-use", "identifiers"] });
      queryClient.invalidateQueries({ queryKey: ["land-use", "list"] });
      resetCreateDialog();
      navigate(identifier);
    },
  });

  // Parse filters from URL
  const getFiltersFromUrl = useCallback(() => {
    const params = parseUrlParams(location.search);
    const phases = params.negotiation_phases;
    const search = params.search;

    return {
      search: Array.isArray(search) ? search[0] : search || "",
      negotiationPhases: phases
        ? Array.isArray(phases)
          ? phases
          : [phases]
        : [],
    };
  }, [location.search]);

  // Update URL with new filters
  const updateUrlWithFilters = useCallback(
    (filters: { search?: string; negotiationPhases: string[] }) => {
      const params = parseUrlParams(location.search);

      if (filters.search) {
        params.search = filters.search;
      } else {
        delete params.search;
      }

      if (filters.negotiationPhases.length > 0) {
        params.negotiation_phases = filters.negotiationPhases;
      } else {
        delete params.negotiation_phases;
      }

      navigate({
        search: buildQueryString(params),
      });
    },
    [location.search, navigate],
  );

  // Fetch land use data based on filters
  const fetchLandUseData = useCallback(
    async (filters: { search: string; negotiationPhases: string[] }) => {
      setIsLoading(true);

      try {
        let filteredData = [...(landUseListQuery.data ?? [])];

        // Apply search filter
        if (filters.search) {
          filteredData = filteredData.filter((item: LandUseListItem) =>
            Object.values(item).some(
              (value) =>
                typeof value === "string" &&
                value.toLowerCase().includes(filters.search.toLowerCase()),
            ),
          );
        }

        // Apply negotiation phase filter
        if (filters.negotiationPhases.length > 0) {
          filteredData = filteredData.filter((item: LandUseListItem) =>
            filters.negotiationPhases.includes(
              item.negotiationPhase as NegotiationPhase,
            ),
          );
        }

        setLandUseData(filteredData);
      } catch (error) {
        console.error("Error fetching land use data:", error);
        setLandUseData([]);
      } finally {
        setIsLoading(false);
      }
    },
    [landUseListQuery.data],
  );

  // Fetch data when URL changes
  useEffect(() => {
    const filters = getFiltersFromUrl();
    fetchLandUseData(filters);
  }, [location.search, getFiltersFromUrl, fetchLandUseData]);

  // Handle phase filter changes
  const handlePhaseFilterChange = useCallback(
    (phase: NegotiationPhase, checked: boolean) => {
      const currentFilters = getFiltersFromUrl();
      let newPhases = [...currentFilters.negotiationPhases];

      if (checked) {
        if (!newPhases.includes(phase)) {
          newPhases.push(phase);
        }
      } else {
        newPhases = newPhases.filter((p) => p !== phase);
      }

      updateUrlWithFilters({
        search: currentFilters.search,
        negotiationPhases: newPhases,
      });
    },
    [getFiltersFromUrl, updateUrlWithFilters],
  );

  // Handle search input changes
  const handleSearchChange = useCallback(
    (value: string) => {
      const currentFilters = getFiltersFromUrl();
      updateUrlWithFilters({
        search: value,
        negotiationPhases: currentFilters.negotiationPhases,
      });
    },
    [getFiltersFromUrl, updateUrlWithFilters],
  );

  const clearSearch = useCallback(() => {
    const currentFilters = getFiltersFromUrl();
    updateUrlWithFilters({
      search: "",
      negotiationPhases: currentFilters.negotiationPhases,
    });
  }, [getFiltersFromUrl, updateUrlWithFilters]);

  const currentFilters = getFiltersFromUrl();
  const searchQuery = currentFilters.search;
  const selectedPhases = currentFilters.negotiationPhases;
  const existingIdentifiers = agreementIdentifiersQuery.data ?? [];
  const sequenceNumber =
    selectedMunicipality && selectedDistrict
      ? getNextLandUseSequence(
          existingIdentifiers,
          selectedMunicipality,
          selectedDistrict,
        )
      : undefined;
  const newIdentifier =
    selectedMunicipality && selectedDistrict && sequenceNumber
      ? createLandUseIdentifier(
          selectedMunicipality,
          selectedDistrict,
          sequenceNumber,
        )
      : "";

  const handleCreate = () => {
    if (!selectedMunicipality || !selectedDistrict) {
      return;
    }
    createAgreementMutation.mutate({
      municipalityId: selectedMunicipality,
      districtId: selectedDistrict,
    });
  };

  const handleSelectChange = (
    selectedOptions: { label: string; value: string }[],
    callback: (value: string | undefined) => void,
  ) => {
    if (selectedOptions.length > 0) {
      callback(selectedOptions[0].value);
    } else {
      callback(undefined);
    }
  };

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
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Luo uusi maankäyttösopimustunnus
        </Button>

        <div className="landuse-list__search-group">
          <SearchInput
            id="search"
            label=""
            value={searchQuery}
            onChange={handleSearchChange}
            onSubmit={handleSearchChange}
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
              checked={selectedPhases.includes(NEGOTIATION_PHASES.VIREILLA)}
              onChange={(e) =>
                handlePhaseFilterChange(
                  NEGOTIATION_PHASES.VIREILLA,
                  e.target.checked,
                )
              }
            />
            <Checkbox
              id="filter-neuvotteilla"
              label="Neuvotteilla"
              checked={selectedPhases.includes(NEGOTIATION_PHASES.NEUVOTTEILLA)}
              onChange={(e) =>
                handlePhaseFilterChange(
                  NEGOTIATION_PHASES.NEUVOTTEILLA,
                  e.target.checked,
                )
              }
            />
            <Checkbox
              id="filter-paatos"
              label="Päätös"
              checked={selectedPhases.includes(NEGOTIATION_PHASES.PAATOS)}
              onChange={(e) =>
                handlePhaseFilterChange(
                  NEGOTIATION_PHASES.PAATOS,
                  e.target.checked,
                )
              }
            />
          </SelectionGroup>
        </div>
        <span className="landuse-list__result-count">
          {isLoading ? "Ladataan..." : `Löytyi ${landUseData.length} kpl`}
        </span>
      </div>

      {/* Search Results Table */}
      {landUseData.length > 0 ? (
        <div className="landuse-list__table-wrapper">
          <Table
            cols={[
              { key: "identifier", headerName: "MA-tunnus" },
              { key: "party", headerName: "Osapuoli" },
              { key: "zoningPlanNumber", headerName: "Asemakaavan numero" },
              { key: "site", headerName: "Kohde" },
              { key: "projectArea", headerName: "Hankealue" },
              { key: "negotiationPhase", headerName: "Neuvotteluvaihe" },
            ]}
            indexKey="id"
            rows={landUseData.map((item) => ({
              ...item,
              identifier: (
                <Link href={`/maankayttosopimukset/${item.identifier}`}>
                  {item.identifier}
                </Link>
              ),
            }))}
            variant="dark"
            theme={{
              "--header-background-color": "var(--color-tram)",
            }}
          />
        </div>
      ) : (
        <div className="landuse-list__empty-state">
          <p>
            Hakutuloksia ei löytynyt. Tarkista hakuehdot ja yritä uudelleen.
          </p>
        </div>
      )}

      <Dialog
        id="landuse-create-identifier"
        isOpen={isCreateDialogOpen}
        aria-labelledby="landuse-create-identifier-title"
        closeButtonLabelText="Sulje"
        close={() => resetCreateDialog()}
      >
        <Dialog.Header
          id="landuse-create-identifier-title"
          title="Luo uusi maankäyttösopimustunnus"
        />
        <Dialog.Content>
          <div className="landuse-list__dialog-content">
            <Select
              id="landuse-municipality"
              options={MUNICIPALITY_OPTIONS}
              value={selectedMunicipality}
              onChange={(selected) =>
                handleSelectChange(selected, setSelectedMunicipality)
              }
              texts={{
                label: "Kaupunki",
                placeholder: "Valitse",
              }}
              required
            />
            <Select
              id="landuse-district"
              options={DISTRICT_OPTIONS}
              value={selectedDistrict}
              onChange={(selected) =>
                handleSelectChange(selected, setSelectedDistrict)
              }
              texts={{
                label: "Kaupunginosa",
                placeholder: "Valitse",
              }}
              required
            />
          </div>
        </Dialog.Content>
        <Dialog.ActionButtons>
          <Button variant={ButtonVariant.Secondary} onClick={resetCreateDialog}>
            Peruuta
          </Button>
          <Button
            variant={ButtonVariant.Primary}
            onClick={handleCreate}
            disabled={!newIdentifier || createAgreementMutation.isPending}
          >
            Luo tunnus
          </Button>
        </Dialog.ActionButtons>
      </Dialog>
    </div>
  );
};

export default LandUseListPage;
