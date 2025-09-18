# Jogo da Soma - Documentação

## Como usar o componente SumGame

### Uso básico (activityId padrão = 1)
```tsx
import SumGame from '@/components/features/games/SumGame';

function MinhaPagina() {
  return <SumGame />;
}
```

### Uso com activityId específico
```tsx
import SumGame from '@/components/features/games/SumGame';

function MinhaPagina() {
  return <SumGame activityId={5} />; // Use o ID da atividade correto do backend
}
```

## Dados enviados para o backend

O jogo coleta e envia os seguintes dados para o endpoint `/adaptiveSystem/interaction/register`:

### Estrutura da interação (mapeada para o banco)
```typescript
{
  aluno_id: number,         // ID do estudante (vem do código do usuário)
  atividade_id: number,     // ID da atividade (configurável, padrão = 1)
  questao_id: number,       // Número do nível/pergunta (1 para resumo do jogo)
  resposta: string,         // Dados resumidos do jogo em JSON
  esta_correta: boolean,    // Se o jogador acertou todos os níveis
  tempo_resposta: number,   // Tempo total gasto no jogo em SEGUNDOS
  numero_tentativas: number,// Sempre 1 (uma sessão de jogo)
  usou_ajuda: boolean,      // Sempre false (jogo não tem sistema de hints)
  data_resposta: Date       // Data/hora da conclusão do jogo
}
```

### Exemplo de dados enviados (formato do banco)
Quando um estudante completa o jogo da soma:

```json
{
  "aluno_id": 12345,
  "atividade_id": 1,
  "questao_id": 1,
  "resposta": "{\"levelsCompleted\":3,\"correctAnswers\":3,\"wrongAnswers\":0,\"totalTime\":45,\"accuracy\":1}",
  "esta_correta": true,
  "tempo_resposta": 45,
  "numero_tentativas": 1,
  "usou_ajuda": false,
  "data_resposta": "2025-09-18T14:30:45.000Z"
}
```

## Configuração do Activity ID

Para configurar o `activityId` correto:

1. Consulte o backend para obter o ID da atividade "Jogo da Soma"
2. Passe o ID como prop para o componente:
```tsx
<SumGame activityId={ID_DA_ATIVIDADE_NO_BACKEND} />
```

## Tratamento de Erros

- Se o envio falhar, o erro será logado no console
- Cada interação é enviada individualmente
- Se uma interação falhar, as outras ainda serão tentadas
- Em caso de erro, você pode implementar lógica de retry ou armazenamento local

## Debug

Para ver um resumo dos dados antes do envio, você pode verificar os logs do console quando o jogo termina.

## Mapeamento dos Campos

O jogo mapeia os dados para os campos corretos do banco `interacoes_aluno`:

| Campo Frontend | Campo Banco | Descrição |
|---------------|-------------|-----------|
| `aluno_id` | `aluno_id` | ID do estudante |
| `atividade_id` | `atividade_id` | ID da atividade (configurável) |
| `questao_id` | `questao_id` | 1 (resumo do jogo completo) |
| `resposta` | `resposta` | JSON com estatísticas do jogo |
| `esta_correta` | `esta_correta` | true se acertou todos os níveis |
| `tempo_resposta` | `tempo_resposta` | Tempo total em segundos |
| `numero_tentativas` | `numero_tentativas` | 1 (uma sessão de jogo) |
| `usou_ajuda` | `usou_ajuda` | false (sem sistema de hints) |
| `data_resposta` | `data_resposta` | Data/hora da conclusão |

## Tabela do Banco

Os dados são salvos na tabela `interacoes_aluno` com a seguinte estrutura do modelo Prisma.
```