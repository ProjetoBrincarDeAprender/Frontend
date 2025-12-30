import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getColumnDisplayName,
  type FilterState,
} from "@/components/utils/DataTable/DataTableFilter";
import useActivity from "@/hooks/Activity/useActivity";
import { Search, X } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

function FilterByActivity({
  setFilter,
  filteredValue,
}: {
  setFilter: Dispatch<SetStateAction<string>>;
  filteredValue: string | undefined;
}) {
  const { activitiesQuery } = useActivity();
  const { data: activitiesReturn, isLoading: isActivitiesLoading } =
    activitiesQuery;
  const activitiesData = activitiesReturn?.data || [];

  return (
    <>
      {isActivitiesLoading ? (
        <Skeleton className="h-10 w-[180px] rounded-md" />
      ) : (
        <Select
          key={filteredValue || "empty"}
          onValueChange={(value) => {
            setFilter(value);
          }}
          value={filteredValue}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por Atividade" />
          </SelectTrigger>
          <SelectContent>
            {activitiesData.map((activity, id) => (
              <SelectItem key={id} value={String(activity.id)}>
                {activity.titulo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </>
  );
}

interface QuestionFilterProps {
  filter?: FilterState | null;
  onFilterChange: (filter: FilterState | null) => void;
  className?: string;
}

export function QuestionFilters({
  filter,
  onFilterChange,
  className,
}: QuestionFilterProps) {
  const filterableColumns = ["id", "ordem", "atividade_id"];

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
      {selectedColumn !== "atividade_id" ? (
        <Input
          placeholder={`Filtrar por ${getColumnDisplayName(effectiveSelectedColumn)}`}
          value={filterInputValue}
          onChange={(event) => setFilterInputValue(event.target.value)}
          onKeyDown={handleKeyDown}
          className="max-h-10 max-w-64"
        />
      ) : (
        <FilterByActivity
          setFilter={setFilterInputValue}
          filteredValue={filterInputValue || undefined}
        />
      )}
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
