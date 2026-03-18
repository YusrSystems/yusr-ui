import type { AsyncThunk, UnknownAction, ActionCreatorWithPayload } from "@reduxjs/toolkit";
import type { BaseEntity, FilterCondition } from "../../../yusr-core/src/entities";
import type { BaseApiService } from "../../../yusr-core/src/networking";
import type { FilterResult, ColumnName } from "../../../yusr-core/src/types";
import type { IDialogState } from "../state/interfaces/iDialogState";
import type IEntityState from "../state/interfaces/iEntityState";

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

export default interface IBaseEntityPage<T extends BaseEntity>{
  entityState: IEntityState<T>;
  useSlice: () => IDialogState<T>;
  actions: IBaseEntityPageActions<T>;
  permissionResource: string;
  entityName: string;
  title: string;
  addNewItemTitle: string;
//   cards: CardProps[];
  columnsToFilter: ColumnName[];
  service: BaseApiService<T>;
//   tableHeadRows: TableHeadRow[];
//   tableRowMapper: (entity: T) => TableBodyRowInfo[];
    // TODO: complete after adding the required components
  ChangeDialog: React.ReactNode;
};