import { TableContext } from "@/contexts/Table/context";
import { useContext } from "react";

export const useTable = () => {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error("useTable must be used within a TableProvider");
  }

  return context;
};
