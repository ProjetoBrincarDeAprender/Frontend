import type { User, UserFormData } from "./user";

export type Responsible = User & {};

export type ResponsibleFormData = {
  escolaId: number;
} & UserFormData;
