import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";

const columnDisplayNames: Record<string, string> = {
  id: "ID",
  titulo: "Título",
  nome: "Nome",
  nome_completo: "Nome Completo",
  email: "Email",
  tipo: "Tipo",
  descricao: "Descrição",
  content: "Conteúdo",
  ordem: "Ordem",
  "activity.titulo": "Atividade",
  "competencia.nome": "Competência",
  "nivelDificuldade.nome": "Nível",
  "areaId.nome": "Área",
  "area.nome": "Área",
  created_At: "Criado em",
  createdAt: "Criado em",
  data_nascimento: "Data de Nascimento",
  perfil: "Perfil",
  escolaId: "Escola",
  codigo_usuario: "Código",
  localizacao: "Localização",
  telefone: "Telefone",
};

export const getColumnDisplayName = (columnId: string) => {
  return (
    columnDisplayNames[columnId] ||
    columnId.charAt(0).toUpperCase() + columnId.slice(1).replace(/[._]/g, " ")
  );
};

export type FilterState = {
  column: string;
  value: string;
};

interface DataTableFilterProps {
  filterableColumns: string[];
  filter?: FilterState | null;
  onFilterChange: (filter: FilterState | null) => void;
  className?: string;
}

export function DataTableFilter({
  filterableColumns,
  filter,
  onFilterChange,
  className,
}: DataTableFilterProps) {
  const [filterInputValue, setFilterInputValue] = useState(filter?.value ?? "");
  const [selectedColumn, setSelectedColumn] = useState<string>(
    filter?.column ?? filterableColumns[0] ?? "",
  );

  useEffect(() => {
    setFilterInputValue(filter?.value ?? "");
    if (filter?.column) {
      setSelectedColumn(filter.column);
    }
  }, [filter]);

  const effectiveSelectedColumn = selectedColumn || filterableColumns[0] || "";

  const handleApplyFilter = () => {
    if (filterInputValue.trim()) {
      const newFilter = {
        column: effectiveSelectedColumn,
        value: filterInputValue.trim(),
      };
      onFilterChange(newFilter);
    }
  };

  const handleClearFilter = () => {
    setFilterInputValue("");
    onFilterChange(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApplyFilter();
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <Input
        placeholder={`Filtrar por ${getColumnDisplayName(effectiveSelectedColumn)}`}
        value={filterInputValue}
        onChange={(event) => setFilterInputValue(event.target.value)}
        onKeyDown={handleKeyDown}
        className="max-h-10 max-w-64"
      />
      <Select
        onValueChange={(value) => setSelectedColumn(value)}
        value={effectiveSelectedColumn}
      >
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Selecione uma coluna" />
        </SelectTrigger>
        <SelectContent>
          {filterableColumns.map((columnId) => (
            <SelectItem key={columnId} value={columnId}>
              {getColumnDisplayName(columnId)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        variant="default"
        size="lg"
        onClick={handleApplyFilter}
        disabled={!filterInputValue.trim()}
      >
        <Search className="h-4 w-4" />
        Filtrar
      </Button>
      {(filter || filterInputValue) && (
        <Button variant="outline" size="lg" onClick={handleClearFilter}>
          <X className="h-4 w-4" />
          Limpar
        </Button>
      )}
    </div>
  );
}
