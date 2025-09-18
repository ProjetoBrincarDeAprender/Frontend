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

O jogo coleta e envia os seguintes dados para o endpoint `/user-interaction`:

### Estrutura da interação
```typescript
{
  studentId: number,        // ID do estudante (vem do código do usuário)
  activityId: number,       // ID da atividade (configurável, padrão = 1)
  questionId: number,       // Número do nível/pergunta (1, 2, 3, ...)
  answer: string,           // Resposta dada pelo estudante
  isCorrect: boolean,       // Se a resposta estava correta
  timeSpent: number,        // Tempo gasto na resposta em milissegundos
  attempts: number,         // Número da tentativa (1ª, 2ª, 3ª...)
  neededHint: boolean,      // Sempre false (jogo não tem sistema de hints)
  responseDate: Date        // Data/hora da resposta
}
```

### Exemplo de dados enviados
Se um estudante joga um nível com soma "2 + 3" e:
1. Primeira tentativa: responde "4" (errado)
2. Segunda tentativa: responde "5" (correto)

Serão enviadas 2 interações:
```json
[
  {
    "studentId": 12345,
    "activityId": 1,
    "questionId": 1,
    "answer": "4",
    "isCorrect": false,
    "timeSpent": 0,
    "attempts": 1,
    "neededHint": false,
    "responseDate": "2025-09-18T14:30:00.000Z"
  },
  {
    "studentId": 12345,
    "activityId": 1,
    "questionId": 1,
    "answer": "5",
    "isCorrect": true,
    "timeSpent": 3500,
    "attempts": 2,
    "neededHint": false,
    "responseDate": "2025-09-18T14:30:03.500Z"
  }
]
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