import type { User, UserFormData } from "./user";

export type Teacher = User;

export type TeacherFormData = {
  escolaId: number;
} & UserFormData;
