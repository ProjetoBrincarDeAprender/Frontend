import { useState } from "react";
import { TableContext } from "./context";

export function TableProvider({ children }: { children: React.ReactNode }) {
  const [updating, setUpdating] = useState<boolean>(false);

  return (
    <TableContext.Provider
      value={{
        updating,
        setUpdating,
      }}
    >
      {children}
    </TableContext.Provider>
  );
}
