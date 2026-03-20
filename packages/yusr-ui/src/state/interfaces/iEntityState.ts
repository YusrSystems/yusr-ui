import type { FilterResult } from "../../../../yusr-core/src/types";

export default interface IEntityState<T>
{
  entities: FilterResult<T>;
  isLoaded: boolean;
  isLoading: boolean;
  currentPage: number;
  rowsPerPage: number;
}
