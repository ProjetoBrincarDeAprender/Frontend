import { useUser } from "@/hooks/User/useUser";
import type { Row } from "@tanstack/react-table";
import type { ReactNode } from "react";
import DeleteModal from "./DeleteModal";

export function ActionsCell<T>({
  row,
  route,
  entity,
  queryKey,
  editModal,
}: {
  row: Row<T>;
  route: string;
  entity: string;
  queryKey: string[];
  editModal?: ReactNode;
}) {
  const { user } = useUser();

  let canUserModify = false;

  const rowData = row.original as any;

  if (user?.perfil === "Admin") {
    canUserModify = true;
  } else if (user?.perfil === "Escola") {
    canUserModify =
      rowData.escolaId === user.escolaId ||
      rowData.usuarioCriadorId === Number(user.codigo_usuario);
  } else if (user?.perfil === "Professor") {
    canUserModify = rowData.usuarioCriadorId === Number(user.codigo_usuario);
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {canUserModify ? (
        <>
          {editModal}
          <DeleteModal
            route={route}
            id={(row.original as any).id}
            entity={entity}
            queryKey={queryKey}
          />
        </>
      ) : (
        <span className="text-sm text-gray-500"></span>
      )}
    </div>
  );
}
