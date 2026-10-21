import { useEffect, useMemo, useState } from "react";

type ListQueryState = {
  page: number;
  limit: number;
  searchTerm: string;
  dateSearch: string;
  rideStatus: string;
};

type UseListQueryStateOptions = {
  statusParamKey?: "rideStatus" | "status";
  /** When provided (e.g. from server meta), out-of-range page numbers are
   * clamped back automatically instead of every page hand-rolling the effect. */
  clampTo?: number;
};

const DEFAULT_STATE: ListQueryState = {
  page: 1,
  limit: 10,
  searchTerm: "",
  dateSearch: "",
  rideStatus: "",
};

export const useListQueryState = (
  initial?: Partial<ListQueryState>,
  options: UseListQueryStateOptions = {}
) => {
  const { statusParamKey = "rideStatus", clampTo } = options;
  const [state, setState] = useState<ListQueryState>({
    ...DEFAULT_STATE,
    ...initial,
  });

  const query = useMemo(() => {
    const params: Record<string, string> = {
      page: String(state.page),
      limit: String(state.limit),
    };

    const searchTerm = state.searchTerm.trim();
    const dateSearch = state.dateSearch.trim();
    const rideStatus = state.rideStatus.trim();

    if (searchTerm) params.searchTerm = searchTerm;
    if (dateSearch) params.dateSearch = dateSearch;
    if (rideStatus) params[statusParamKey] = rideStatus;

    return params;
  }, [state, statusParamKey]);

  useEffect(() => {
    if (!clampTo) return;
    if (state.page > clampTo) {
      setState((previous) => ({ ...previous, page: clampTo }));
    }
  }, [clampTo, state.page]);

  const resetFilters = () => {
    setState((prev) => ({
      ...prev,
      page: 1,
      searchTerm: "",
      dateSearch: "",
      rideStatus: "",
    }));
  };

  return {
    state,
    setState,
    query,
    resetFilters,
  };
};
