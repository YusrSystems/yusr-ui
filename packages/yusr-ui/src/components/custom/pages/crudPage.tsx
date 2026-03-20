import type { ActionCreatorWithPayload, AsyncThunk, UnknownAction } from "@reduxjs/toolkit";
import type { PropsWithChildren } from "react";
import { useEffect } from "react";
import type { ResourcePermissions } from "../../../../../yusr-core/src/auth/permissionSelector";
import type { BaseEntity, FilterCondition } from "../../../../../yusr-core/src/entities";
import type { BaseApiService } from "../../../../../yusr-core/src/networking";
import type { ColumnName, FilterResult } from "../../../../../yusr-core/src/types";
import { useYusrDispatch } from "../../../state/hooks";
import type { IDialogState } from "../../../state/interfaces/iDialogState";
import type IEntityState from "../../../state/interfaces/iEntityState";
import { Dialog, DialogContent } from "../../pure/dialog";
import { TableBody } from "../../pure/table";
import DeleteDialog from "../dialogs/deleteDialog";
import SearchInput from "../input/searchInput";
import EntityTable from "../table/entityTable";
import TableBodyRow, { type TableBodyRowInfo } from "../table/tableBodyRow";
import TableCard, { type CardProps } from "../table/tableCard";
import TableHeader from "../table/tableHeader";
import TableHeaderRows, { type TableHeadRow } from "../table/tableHeaderRows";
import TablePagination from "../table/tablePagination";
import TableRowActionsMenu from "../table/tableRowActionsMenu";

export interface CrudActions<T extends BaseEntity>
{
  filter: AsyncThunk<FilterResult<T> | undefined, FilterCondition | undefined, object>;
  openChangeDialog: (entity: T) => UnknownAction;
  openDeleteDialog: (entity: T) => UnknownAction;
  setIsChangeDialogOpen: (open: boolean) => UnknownAction;
  setIsDeleteDialogOpen: (open: boolean) => UnknownAction;
  refresh: ActionCreatorWithPayload<{ newData?: T; deletedId?: number; }>;
  setCurrentPage: (page: number) => UnknownAction;
}

export type CrudPageProps<T extends BaseEntity> = PropsWithChildren & {
  entityState: IEntityState<T>;
  useSlice: () => IDialogState<T>;
  actions: CrudActions<T>;
  permissions: ResourcePermissions;
  entityName: string;
  title: string;
  addNewItemTitle: string;
  cards: CardProps[];
  columnsToFilter: ColumnName[];
  service: BaseApiService<T>;
  tableHeadRows: TableHeadRow[];
  tableRowMapper: (entity: T) => TableBodyRowInfo[];

  ChangeDialog: React.ReactNode;
};

export default function CrudPage<T extends BaseEntity>(
  {
    permissions,
    useSlice,
    entityName,
    title,
    addNewItemTitle,
    cards,
    columnsToFilter,
    actions,
    service,
    entityState,
    tableHeadRows,
    tableRowMapper,
    ChangeDialog,
    children
  }: CrudPageProps<T>
)
{
  const dispatch = useYusrDispatch();
  const { selectedRow, isChangeDialogOpen, isDeleteDialogOpen } = useSlice();
  useEffect(() =>
  {
    dispatch(actions.filter(undefined));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, actions.filter]);

  return (
    <div className="px-5 py-3">
      <TableHeader
        title={ title }
        buttonTitle={ addNewItemTitle }
        isButtonVisible={ permissions.addPermission }
        createComp={ ChangeDialog }
      />

      <TableCard cards={ cards } />

      <SearchInput columnsNames={ columnsToFilter } onSearch={ (condition) => dispatch(actions.filter(condition)) } />

      <div className="rounded-b-xl border shadow-sm overflow-hidden">
        <EntityTable state={ entityState }>
          <TableHeaderRows tableHeadRows={ tableHeadRows } />

          <TableBody>
            { entityState.entities?.data?.map((entity: T, i: number) => (
              <TableBodyRow
                key={ i }
                tableRows={ tableRowMapper(entity) }
                dropdownMenu={ 
                  <TableRowActionsMenu
                    permissions={ permissions }
                    type="dropdown"
                    onEditClicked={ () => dispatch(actions.openChangeDialog(entity)) }
                    onDeleteClicked={ () => dispatch(actions.openDeleteDialog(entity)) }
                  />
                 }
                contextMenuContent={ 
                  <TableRowActionsMenu
                    permissions={ permissions }
                    type="context"
                    onEditClicked={ () => dispatch(actions.openChangeDialog(entity)) }
                    onDeleteClicked={ () => dispatch(actions.openDeleteDialog(entity)) }
                  />
                 }
              />
            )) }
          </TableBody>
        </EntityTable>

        <TablePagination
          pageSize={ entityState.rowsPerPage }
          totalNumber={ entityState.entities?.count ?? 0 }
          currentPage={ entityState.currentPage || 1 }
          onPageChanged={ (newPage) => dispatch(actions.setCurrentPage(newPage)) }
        />

        { isChangeDialogOpen && permissions.updatePermission && (
          <Dialog
            open={ isChangeDialogOpen }
            onOpenChange={ (open) => dispatch(actions.setIsChangeDialogOpen(open)) }
          >
            { ChangeDialog }
          </Dialog>
        ) }

        { isDeleteDialogOpen && permissions.deletePermission && (
          <Dialog
            open={ isDeleteDialogOpen }
            onOpenChange={ (open) => dispatch(actions.setIsDeleteDialogOpen(open)) }
          >
            <DialogContent dir="rtl" className="sm:max-w-sm">
              <DeleteDialog
                entityName={ entityName }
                id={ selectedRow?.id ?? 0 }
                service={ service }
                onSuccess={ () =>
                {
                  dispatch(actions.refresh({ deletedId: selectedRow?.id }));
                  dispatch(actions.setIsDeleteDialogOpen(false));
                } }
              />
            </DialogContent>
          </Dialog>
        ) }

        { children }
      </div>
    </div>
  );
}
