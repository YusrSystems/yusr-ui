import type { BaseEntity } from "@yusr_systems/core/src/entities";
import type { BaseApiService } from "@yusr_systems/core/src/networking";
import type { DialogMode } from "./dialogType";

export type CommonChangeDialogProps<T extends BaseEntity> = {
  entity?: T;
  mode: DialogMode;
  service: BaseApiService<T>;
  onSuccess?: (newData: T, mode: DialogMode) => void;
};
