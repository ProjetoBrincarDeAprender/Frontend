import { useEffect, useState, useCallback } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import api from "@/utils/api";
import { useUser } from "@/hooks/User/useUser";
import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";

interface KnowledgeArea {
  id: number;
  name: string;
  description: string;
  code: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  teacherId: number;
}

export default function KnowledgeAreas() {
  const { user } = useUser();
  const [knowledgeAreas, setKnowledgeAreas] = useState<KnowledgeArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const loadKnowledgeAreas = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/knowledge-areas/teacher/${user?.codigo_usuario}`);
      
      if (response.status === 200) {
        setKnowledgeAreas(response.data);
      }
    } catch (error) {
      console.error("Erro ao carregar áreas de conhecimento:", error);
      toast.error("Erro ao carregar áreas de conhecimento");
    } finally {
      setLoading(false);
    }
  }, [user?.codigo_usuario]);

  useEffect(() => {
    if (user?.codigo_usuario) {
      loadKnowledgeAreas();
    }
  }, [loadKnowledgeAreas, user?.codigo_usuario]);

  const handleDelete = async (area: KnowledgeArea) => {
    if (window.confirm(`Tem certeza que deseja excluir a área "${area.name}"?`)) {
      try {
        await api.delete(`/knowledge-areas/${area.id}`);
        setKnowledgeAreas(prev => prev.filter(a => a.id !== area.id));
        toast.success("Área de conhecimento excluída com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir área de conhecimento:", error);
        toast.error("Erro ao excluir área de conhecimento");
      }
    }
  };

  const filteredAreas = knowledgeAreas.filter(area =>
    area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-fit flex-col bg-neutral-200 pt-28 text-gray-800">
      <Header />
      
      <main className="min-h-96 flex-1 px-78 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-800">Áreas de Conhecimento</h1>
              <p className="text-gray-600">
                Gerencie as áreas de conhecimento do seu currículo
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = "/dashboard/teacher/curriculum/knowledge-areas/create"}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Área
            </Button>
          </div>

          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar áreas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-white border-gray-300"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-md border border-gray-300 bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Criado em</TableHead>
                  <TableHead className="w-[100px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="h-4 w-32 animate-pulse rounded bg-gray-200" /></TableCell>
                      <TableCell><div className="h-4 w-16 animate-pulse rounded bg-gray-200" /></TableCell>
                      <TableCell><div className="h-4 w-48 animate-pulse rounded bg-gray-200" /></TableCell>
                      <TableCell><div className="h-4 w-16 animate-pulse rounded bg-gray-200" /></TableCell>
                      <TableCell><div className="h-4 w-24 animate-pulse rounded bg-gray-200" /></TableCell>
                      <TableCell><div className="h-4 w-16 animate-pulse rounded bg-gray-200" /></TableCell>
                    </TableRow>
                  ))
                ) : filteredAreas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                      Nenhuma área de conhecimento encontrada.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredAreas.map((area) => (
                    <TableRow key={area.id}>
                      <TableCell className="font-medium">{area.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-gray-300 text-gray-700">{area.code}</Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {area.description}
                      </TableCell>
                      <TableCell>
                        <Badge variant={area.isActive ? "default" : "secondary"}>
                          {area.isActive ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(area.createdAt).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.location.href = `/dashboard/teacher/curriculum/knowledge-areas/edit/${area.id}`}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(area)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}