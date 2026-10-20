import { useQuery } from "@tanstack/react-query";
import { getUiMetadata, type LandUseUiMetadata } from "@/landUse/api/landUseApi";

export const metadataOptions = (metadata: LandUseUiMetadata | undefined, key: string, useLabels = false) =>
  (metadata?.[key] ?? []).map((option) => ({ ...option, value: useLabels ? option.label : option.value }));

export const useUiMetadata = () => useQuery({
  queryKey: ["land-use", "ui-metadata"],
  queryFn: getUiMetadata,
  staleTime: 0,
  refetchOnMount: "always",
});