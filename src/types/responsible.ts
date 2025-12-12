import type { User, UserFormData } from "./user";

export type Responsible = User & {
  parentesco: string;
};

export type ResponsibleFormData = {
  escolaId: number;
} & UserFormData;
