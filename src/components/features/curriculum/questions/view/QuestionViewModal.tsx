import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuestion } from "@/hooks/Question/useQuestion";
import { Skeleton } from "@/components/ui/skeleton";

interface QuestionViewModalProps {
  id: number;
}

export function QuestionViewModal({ id }: QuestionViewModalProps) {
  const [open, setOpen] = useState(false);
  const { questionQuery } = useQuestion({ questionId: id });
  const { data: questionData, isLoading } = questionQuery;

  const [parsedContent, setParsedContent] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    if (questionData?.conteudo) {
      try {
        const content = questionData.conteudo;
        
        // Se for objeto com campo "texto"
        if (typeof content === "object" && "texto" in content) {
          let texto = (content as { texto: string }).texto;
          
          // Se o texto é outro JSON com campo "texto", extrair novamente
          try {
            const innerContent = JSON.parse(texto);
            if (typeof innerContent === "object" && innerContent !== null && "texto" in innerContent) {
              texto = (innerContent as { texto: string }).texto;
            }
          } catch {
            // Não é JSON aninhado, continuar normalmente
          }
          
          // Limpar múltiplas camadas de escape
          let previousTexto = '';
          while (texto !== previousTexto) {
            previousTexto = texto;
            texto = texto
              .replace(/\\\\"/g, '\\"')  // Converter aspas duplamente escapadas
              .replace(/\\"/g, '"')      // Converter aspas escapadas em aspas normais
              .replace(/\\n/g, ' ')      // Remover quebras de linha
              .replace(/\s+/g, ' ')      // Normalizar espaços
              .trim();
          }
          
          // Tentar fazer parse do texto
          try {
            // Se texto já é um JSON válido
            const parsed = JSON.parse(texto);
            setParsedContent(parsed as Record<string, unknown>);
            return;
          } catch {
            // Tentar construir um JSON com chaves
            try {
              let jsonString = texto;
              
              // Se não começar com {, adicionar
              if (!jsonString.startsWith('{')) {
                jsonString = `{${jsonString}}`;
              }
              
              const parsed = JSON.parse(jsonString);
              setParsedContent(parsed as Record<string, unknown>);
              return;
            } catch {
              // Se não deu certo, é texto simples - criar objeto com campo question
              setParsedContent({ question: texto });
              return;
            }
          }
        }
        
        // Se for string JSON, fazer parse
        if (typeof content === "string") {
          const parsed = JSON.parse(content);
          setParsedContent(parsed as Record<string, unknown>);
        } else {
          setParsedContent(content as Record<string, unknown>);
        }
      } catch (error) {
        console.error("Erro ao fazer parse do conteúdo:", error);
        setParsedContent({ raw: questionData.conteudo });
      }
    }
  }, [questionData]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="rounded p-2 text-az3 transition-colors hover:bg-blue-50 hover:text-blue-700"
          title="Visualização"
          aria-label="Visualizar questão"
        >
          <Eye className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] font-1 overflow-y-auto border-0 bg-am1 text-az3 sm:max-w-[700px] sm:rounded-3xl">
        <div className="space-y-4 py-4 px-8">
          <h2 className="mb-8 text-center text-3xl font-semibold">
            Visualização da Questão
          </h2>

          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : questionData ? (
            <div className="flex flex-col gap-5">
              {/* ID */}
              <div className="space-y-2">
                <label className="font-semibold text-base leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  ID da Questão
                </label>
                <div className="border-2 border-az3 bg-background ring-offset-background flex h-10 w-full rounded-lg px-3 py-2 text-base">
                  {questionData.id}
                </div>
              </div>

              {/* Ordem */}
              <div className="space-y-2">
                <label className="font-semibold text-base leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Ordem
                </label>
                <div className="border-2 border-az3 bg-background ring-offset-background flex h-10 w-full rounded-lg px-3 py-2 text-base">
                  {questionData.ordem}
                </div>
              </div>

              {/* Atividade ID */}
              <div className="space-y-2">
                <label className="font-semibold text-base leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Atividade ID
                </label>
                <div className="border-2 border-az3 bg-background ring-offset-background flex h-10 w-full rounded-lg px-3 py-2 text-base">
                  {questionData.atividade_id}
                </div>
              </div>

              {/* Dificuldade ID */}
              {questionData.nivelDificuldadeId && (
                <div className="space-y-2">
                  <label className="font-semibold text-base leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Nível de Dificuldade ID
                  </label>
                  <div className="border-2 border-az3 bg-background ring-offset-background flex h-10 w-full rounded-lg px-3 py-2 text-base">
                    {questionData.nivelDificuldadeId}
                  </div>
                </div>
              )}

              {/* Conteúdo da Questão */}
              <div className="space-y-2">
                <label className="font-semibold text-base leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Conteúdo da Questão
                </label>
                {parsedContent ? (
                  <div className="border-2 border-az3 bg-background ring-offset-background w-full rounded-lg p-4">
                    <div className="flex flex-col gap-3">
                      {(parsedContent.comando && typeof parsedContent.comando === 'string') ? (
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-gray-600">Comando</div>
                          <div className="border-2 border-az3 bg-white w-full rounded-lg px-4 py-3 text-lg">
                            {String(parsedContent.comando)}
                          </div>
                        </div>
                      ) : null}

                      {(parsedContent.enunciado && typeof parsedContent.enunciado === 'string') ? (
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-gray-600">Enunciado</div>
                          <div className="border-2 border-az3 bg-white w-full rounded-lg px-4 py-3 text-lg">
                            {String(parsedContent.enunciado)}
                          </div>
                        </div>
                      ) : null}

                      {(parsedContent.question && typeof parsedContent.question === 'string') ? (
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-gray-600">Pergunta</div>
                          <div className="border-2 border-az3 bg-white w-full rounded-lg px-4 py-3 text-lg">
                            {String(parsedContent.question)}
                          </div>
                        </div>
                      ) : null}

                      {(parsedContent.profession && typeof parsedContent.profession === 'string') ? (
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-gray-600">Profissão</div>
                          <div className="border-2 border-az3 bg-white w-full rounded-lg px-4 py-3 text-lg font-semibold">
                            {String(parsedContent.profession)}
                          </div>
                        </div>
                      ) : null}
                    
                      {(parsedContent.opcoes && Array.isArray(parsedContent.opcoes)) ? (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-500">Opções</div>
                          <div className="w-full space-y-2">
                            {(parsedContent.opcoes as Array<{ texto: string; correta: boolean }>).map((opcao, index: number) => (
                              <div 
                                key={index} 
                                className={`rounded-md border px-3 py-2 text-sm ${
                                  opcao.correta
                                    ? "border-green-600 bg-green-50 font-semibold text-green-700" 
                                    : "border-gray-200 bg-white text-gray-900"
                                }`}
                              >
                                {opcao.texto}
                                {opcao.correta && " ✓"}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {(parsedContent.options && Array.isArray(parsedContent.options)) ? (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-500">Opções</div>
                          <div className="w-full space-y-2">
                            {(parsedContent.options as string[]).map((option: string, index: number) => (
                              <div 
                                key={index} 
                                className={`rounded-md border px-3 py-2 text-sm ${
                                  option === parsedContent.correctAnswer 
                                    ? "border-green-600 bg-green-50 font-semibold text-green-700" 
                                    : "border-gray-200 bg-white text-gray-900"
                                }`}
                              >
                                {option}
                                {option === parsedContent.correctAnswer && " ✓"}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null}

                      {(parsedContent.images && Array.isArray(parsedContent.images)) ? (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-500">Imagens</div>
                          <div className="border-input bg-white w-full rounded-md border px-3 py-2 text-sm">
                            <div className="flex flex-wrap gap-2">
                              {(parsedContent.images as string[]).map((image: string, index: number) => (
                                <span key={index} className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                  {image}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    
                      {(parsedContent.correctAnswer && (typeof parsedContent.correctAnswer === 'string' || typeof parsedContent.correctAnswer === 'number')) ? (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-500">Resposta Correta</div>
                          <div className="flex h-10 w-full items-center rounded-md border border-green-600 bg-green-50 px-3 py-2 text-sm font-semibold text-green-700">
                            {String(parsedContent.correctAnswer)}
                          </div>
                        </div>
                      ) : null}

                      {(parsedContent.type && typeof parsedContent.type === 'string') ? (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-500">Tipo</div>
                          <div className="border-input bg-white flex h-10 w-full rounded-md border px-3 py-2 text-sm">
                            {String(parsedContent.type)}
                          </div>
                        </div>
                      ) : null}

                      {(parsedContent.image && typeof parsedContent.image === 'string') ? (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-500">Imagem</div>
                          <div className="border-input bg-white flex h-10 w-full rounded-md border px-3 py-2 text-sm">
                            {String(parsedContent.image)}
                          </div>
                        </div>
                      ) : null}

                      {(typeof parsedContent.number1 === 'number' || 
                        typeof parsedContent.number2 === 'number' || 
                        typeof parsedContent.number3 === 'number') && (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-500">Números</div>
                          <div className="border-input bg-white flex h-10 w-full items-center rounded-md border px-3 py-2 text-sm">
                            {[
                              typeof parsedContent.number1 === 'number' ? parsedContent.number1 : null,
                              typeof parsedContent.number2 === 'number' ? parsedContent.number2 : null,
                              typeof parsedContent.number3 === 'number' ? parsedContent.number3 : null
                            ]
                              .filter((n): n is number => n !== null)
                              .join(" + ")}
                          </div>
                        </div>
                      )}

                      {(parsedContent.cards && Array.isArray(parsedContent.cards)) ? (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-500">Cards</div>
                          <div className="border-input bg-white w-full rounded-md border px-3 py-2 text-sm">
                            <div className="flex flex-col gap-2">
                              {(parsedContent.cards as Array<{ value: string; useFullRandom: boolean }>).map((card, index: number) => (
                                <div key={index} className="rounded border border-gray-200 bg-gray-50 px-3 py-2">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium">Card {index + 1}: {card.value}</span>
                                    {card.useFullRandom && (
                                      <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">
                                        Random
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : null}

                      {/* Se nenhum campo foi reconhecido, mostrar JSON completo */}
                      {!parsedContent.question && 
                       !parsedContent.options && 
                       !parsedContent.opcoes &&
                       !parsedContent.comando &&
                       !parsedContent.enunciado &&
                       !parsedContent.profession &&
                       !parsedContent.images && 
                       !parsedContent.correctAnswer && 
                       !parsedContent.type && 
                       !parsedContent.image && 
                       !parsedContent.cards &&
                       typeof parsedContent.number1 !== 'number' && 
                       typeof parsedContent.number2 !== 'number' && 
                       typeof parsedContent.number3 !== 'number' && (
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-500">Dados Brutos</div>
                          <div className="border-input bg-white w-full rounded-md border px-3 py-2">
                            <pre className="overflow-x-auto whitespace-pre-wrap break-words text-xs">
                              {JSON.stringify(parsedContent, null, 2)}
                            </pre>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-600">
                    ⚠️ Sem conteúdo disponível para exibir
                  </div>
                )}
              </div>

              {/* Data de Criação */}
              {questionData.created_At && (
                <div className="space-y-2">
                  <label className="font-semibold text-base leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    Data de Criação
                  </label>
                  <div className="border-2 border-az3 bg-background ring-offset-background flex h-10 w-full rounded-lg px-3 py-2 text-base">
                    {new Date(questionData.created_At).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
              ❌ Questão não encontrada
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            onClick={() => setOpen(false)}
            className="bg-az3 text-am1 mt-2.5 w-full cursor-pointer rounded-xl border-0 p-3.5 text-base font-bold transition-all duration-200 hover:bg-az3/90"
          >
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
