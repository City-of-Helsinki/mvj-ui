import { useQuery } from "@tanstack/react-query";
import { getLandUseUiMetadata } from "@/landUse/api/landUseApi";

export const LAND_USE_METADATA_QUERY_KEY = ["land-use", "metadata"] as const;

export const useLandUseMetadata = () =>
  useQuery({
    queryKey: LAND_USE_METADATA_QUERY_KEY,
    queryFn: getLandUseUiMetadata,
    staleTime: 60 * 60 * 1000, // Static data defined in code should not change often
    refetchOnWindowFocus: false,
  });
