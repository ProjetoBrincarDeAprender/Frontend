import { createContext } from "react";

export type TableContextType = {
  updating: boolean;
  setUpdating: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TableContext = createContext<TableContextType | null>(null);
