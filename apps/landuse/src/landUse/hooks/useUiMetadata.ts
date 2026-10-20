import { useQuery } from "@tanstack/react-query";
import { getUiMetadata } from "@/landUse/api/landUseApi";

export const useUiMetadata = () => useQuery({
  queryKey: ["land-use", "ui-metadata"],
  queryFn: getUiMetadata,
  staleTime: 0,
  refetchOnMount: "always",
});