import type { BaseEntity } from "@yusr_systems/core";
import type { PropsWithChildren } from "react";
import { type SaveButtonProps } from "../buttons/saveButton";

export interface ChangeDialogProps<T extends BaseEntity>
  extends SaveButtonProps<T>,
    PropsWithChildren {
  title: string;
  description?: string;
  className?: string;
}
