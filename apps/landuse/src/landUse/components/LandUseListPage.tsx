import React, { useMemo, useState } from "react";
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
import {
  DISTRICT_OPTIONS,
  MUNICIPALITY_OPTIONS,
  LAND_USE_NEGOTIATION_PHASES,
  type LandUseNegotiationPhase,
} from "../options";

type LandUseFilters = {
  search: string;
  phases: LandUseNegotiationPhase[];
};

const NEGOTIATION_PHASE_VALUES = new Set<LandUseNegotiationPhase>(
  Object.values(LAND_USE_NEGOTIATION_PHASES),
);

const getFiltersFromUrl = (searchString: string): LandUseFilters => {
  const params = parseUrlParams(searchString);
  const phaseParams = params.negotiation_phases;
  const search = params.search;
  const phaseArray = phaseParams
    ? Array.isArray(phaseParams)
      ? phaseParams
      : [phaseParams]
    : [];
  const phases = phaseArray.filter((phase): phase is LandUseNegotiationPhase =>
    NEGOTIATION_PHASE_VALUES.has(phase as LandUseNegotiationPhase),
  );

  return {
    search: Array.isArray(search) ? search[0] : search || "",
    phases,
  };
};

const LandUseListPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: "always",
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

  const updateUrlWithFilters = (filters: LandUseFilters) => {
    const params = parseUrlParams(location.search);

    if (filters.search) {
      params.search = filters.search;
    } else {
      delete params.search;
    }

    if (filters.phases.length > 0) {
      params.negotiation_phases = filters.phases;
    } else {
      delete params.negotiation_phases;
    }

    navigate({
      search: buildQueryString(params),
    });
  };

  // Handle phase filter changes
  const currentFilters = useMemo(
    () => getFiltersFromUrl(location.search),
    [location.search],
  );

  const handlePhaseFilterChange = (
    phase: LandUseNegotiationPhase,
    checked: boolean,
  ) => {
    let newPhases = [...currentFilters.phases];

    if (checked) {
      if (!newPhases.includes(phase)) {
        newPhases.push(phase);
      }
    } else {
      newPhases = newPhases.filter((p) => p !== phase);
    }

    updateUrlWithFilters({
      search: currentFilters.search,
      phases: newPhases,
    });
  };

  // Handle search input changes
  const handleSearchChange = (value: string) => {
    updateUrlWithFilters({
      search: value,
      phases: currentFilters.phases,
    });
  };

  const clearSearch = () => {
    updateUrlWithFilters({
      search: "",
      phases: currentFilters.phases,
    });
  };

  const searchQuery = currentFilters.search;
  const selectedPhases = currentFilters.phases;
  const normalizedSearch = searchQuery.trim().toLowerCase();
  const normalizedSelectedPhases = selectedPhases.map((phase) =>
    phase.trim().toLowerCase(),
  );
  const landUseData = useMemo(() => {
    let filteredData = [...(landUseListQuery.data ?? [])];

    if (normalizedSearch) {
      filteredData = filteredData.filter((item) =>
        Object.values(item).some(
          (value) =>
            typeof value === "string" &&
            value.toLowerCase().includes(normalizedSearch),
        ),
      );
    }

    if (selectedPhases.length > 0) {
      filteredData = filteredData.filter((agreement) => {
        const agreementPhase = agreement.negotiationPhase.trim().toLowerCase();
        return normalizedSelectedPhases.includes(agreementPhase);
      });
    }

    return filteredData;
  }, [
    landUseListQuery.data,
    normalizedSearch,
    selectedPhases,
    normalizedSelectedPhases,
  ]);
  const isLoading = landUseListQuery.isLoading || landUseListQuery.isFetching;

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
    callback(selectedOptions[0]?.value);
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
              checked={selectedPhases.includes(
                LAND_USE_NEGOTIATION_PHASES.VIREILLA,
              )}
              onChange={(e) =>
                handlePhaseFilterChange(
                  LAND_USE_NEGOTIATION_PHASES.VIREILLA,
                  e.target.checked,
                )
              }
            />
            <Checkbox
              id="filter-neuvotteilla"
              label="Neuvotteilla"
              checked={selectedPhases.includes(
                LAND_USE_NEGOTIATION_PHASES.NEUVOTTEILLA,
              )}
              onChange={(e) =>
                handlePhaseFilterChange(
                  LAND_USE_NEGOTIATION_PHASES.NEUVOTTEILLA,
                  e.target.checked,
                )
              }
            />
            <Checkbox
              id="filter-paatos"
              label="Päätös"
              checked={selectedPhases.includes(
                LAND_USE_NEGOTIATION_PHASES.PAATOS,
              )}
              onChange={(e) =>
                handlePhaseFilterChange(
                  LAND_USE_NEGOTIATION_PHASES.PAATOS,
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
