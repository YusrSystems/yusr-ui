import type { AsyncThunk, UnknownAction, ActionCreatorWithPayload } from "@reduxjs/toolkit";
import type { BaseEntity, FilterCondition } from "../../../yusr-core/src/entities";
import type { BaseApiService } from "../../../yusr-core/src/networking";
import type { FilterResult, ColumnName } from "../../../yusr-core/src/types";
import type { IDialogState } from "../state/interfaces/iDialogState";
import type IEntityState from "../state/interfaces/iEntityState";
import type { TableBodyRowInfo } from "../components/custom/table/tableBodyRow";
import type { TableHeadRow } from "../components/custom/table/tableHeaderRows";
import type { CardProps } from "../components/custom/table/tableCard";

export interface IBaseEntityPageActions<T extends BaseEntity>
{
  filter: AsyncThunk<FilterResult<T> | undefined, FilterCondition | undefined, object>;
  openChangeDialog: (entity: T) => UnknownAction;
  openDeleteDialog: (entity: T) => UnknownAction;
  setIsChangeDialogOpen: (open: boolean) => UnknownAction;
  setIsDeleteDialogOpen: (open: boolean) => UnknownAction;
  refresh: ActionCreatorWithPayload<{ newData?: T; deletedId?: number; }>;
  setCurrentPage: (page: number) => UnknownAction;
}

/**
 * @interface IBaseEntityPage Generic interface must be inherit by entites that needs CRUDS page
 * @template T The type and it must be BaseEntity
 */
export default interface IBaseEntityPage<T extends BaseEntity>{
  entityState: IEntityState<T>;
  useSlice: () => IDialogState<T>;
  actions: IBaseEntityPageActions<T>;
  permissionResource: string;
  entityName: string;
  title: string;
  addNewItemTitle: string;
  columnsToFilter: ColumnName[];
  service: BaseApiService<T>;
  cards: CardProps[];
  tableHeadRows: TableHeadRow[];
  tableRowMapper: (entity: T) => TableBodyRowInfo[];
  ChangeDialog: React.ReactNode;
};