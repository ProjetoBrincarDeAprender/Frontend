# Sistema de Geração Dinâmica de Sílabas

Este documento explica como funciona o novo sistema de geração dinâmica de sílabas no jogo.

## Visão Geral

O sistema foi refatorado para permitir que o usuário escolha uma consoante específica e o jogo gere dinamicamente os níveis correspondentes, em vez de ter todos os níveis pré-definidos em um JSON estático.

## Arquitetura

### 1. ConsonantSelectionScene

- **Localização**: `src/games/common/content/ConsonantSelectionScene.ts`
- **Função**: Apresenta uma tela com botões de consoantes para o usuário escolher
- **Funcionalidades**:
  - Exibe todas as consoantes disponíveis em uma grade
  - Permite ao usuário clicar em uma consoante
  - Gera os dados do jogo dinamicamente
  - Passa os dados para a próxima cena via registry

### 2. SyllableGameDataGenerator

- **Localização**: `src/games/common/utils/SyllableGameDataGenerator.ts`
- **Função**: Classe utilitária responsável por gerar os dados do jogo
- **Funcionalidades**:
  - Gera níveis para uma consoante específica
  - Cria configurações de áudio
  - Gera opções de resposta aleatórias
  - Mantém a estrutura de dados compatível com o sistema existente

### 3. ClickButtonGameScene (Modificado)

- **Localização**: `src/games/clickedButton/scenes/ClickButtonGame.ts`
- **Modificações**:
  - Constructor agora aceita parâmetro opcional `mainDataPath`
  - Método `create()` verifica se há dados gerados no registry
  - Se há dados gerados, usa eles; senão, carrega do JSON tradicional
  - Método `preload()` só carrega JSON se o caminho foi fornecido

## Fluxo do Jogo

1. **StartScene**: Tela inicial do jogo
2. **ConsonantSelectionScene**: Usuário escolhe uma consoante
3. **ClickButtonGameScene**: Jogo principal com níveis gerados dinamicamente
4. **EndScene**: Tela final do jogo

## Como Usar

### Para o Jogo de Sílabas Simples

```typescript
// Em SimpleSyllableGame.tsx
const startScene = new StartScene({
  nextSceneName: "ConsonantSelectionScene", // Vai para seleção de consoantes
  // ... outras configurações
});

const consonantSelectionScene = new ConsonantSelectionScene({
  backgroundPath: "/assets/simpleSyllableGame/images/backgroundMain.png",
  backgroundKey: "consonantSelectionBg",
  nextSceneName: "clickButtonGameScene", // Vai para o jogo principal
  title: "ESCOLHA UMA CONSOANTE",
});

const gameScene = new ClickButtonGameScene(); // Sem JSON, usará dados gerados

const config: Phaser.Types.Core.GameConfig = {
  scene: [startScene, consonantSelectionScene, gameScene, endScene],
  // ... outras configurações
};
```

### Para Jogos com JSON Estático (Modo Tradicional)

```typescript
// Outros jogos continuam funcionando normalmente
const gameScene = new ClickButtonGameScene("/caminho/para/arquivo.json");
```

## Benefícios

1. **Flexibilidade**: Usuário escolhe o que quer praticar
2. **Escalabilidade**: Fácil adicionar novas consoantes sem modificar JSONs
3. **Manutenibilidade**: Código centralizado para geração de dados
4. **Retrocompatibilidade**: Sistema antigo continua funcionando
5. **Experiência do Usuário**: Menos cansativo, mais personalizado

## Extensões Futuras

O sistema pode ser facilmente estendido para:

- Seleção de dificuldade
- Seleção de vogais específicas
- Sílabas complexas (com dígrafos)
- Diferentes tipos de exercícios

## Estrutura de Dados Gerada

O `SyllableGameDataGenerator` gera dados no mesmo formato que o JSON original, garantindo compatibilidade total com o sistema existente:

```typescript
{
  config: { background: {...} },
  textures: { buttons: {...}, effects: {...} },
  audios: [{ key: "CA", path: "/assets/.../CA.mp3" }, ...],
  buttonConfig: { fontSize: 50, scale: 1.5 },
  info: { activityId: 2 },
  levels: [
    {
      question: "COMPLETE AS SÍLABAS",
      audioKey: "CA",
      content: ["C", " "],
      completeContent: ["C", "A"],
      answer: "A",
      options: ["A", "O"]
    },
    // ... mais níveis para todas as vogais
  ]
}
```
