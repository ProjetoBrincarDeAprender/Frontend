# Documentação dos Componentes de Jogos

Esta documentação descreve os principais componentes responsáveis pela criação e gerenciamento de jogos educacionais no projeto Celso Furtado.

## Índice

- [GameFactory.ts](#gamefactoryts)
- [GameWrapper.tsx](#gamewrappertsx)
- [Arquitetura Geral](#arquitetura-geral)
- [Como Adicionar um Novo Jogo](#como-adicionar-um-novo-jogo)

## GameFactory.ts

### Descrição

O `GameFactory` é uma classe utilitária que implementa o padrão Factory para criar configurações de jogos Phaser. Esta classe centraliza a criação de todos os jogos educacionais disponíveis na plataforma, fornecendo uma interface consistente para inicialização de diferentes tipos de jogos.

### Estrutura da Classe

```typescript
export class GameFactory {
  // Métodos estáticos para criação de jogos
  static createAddressGame(): Phaser.Types.Core.GameConfig;
  static createArmedSumGame(): Phaser.Types.Core.GameConfig;
  // ... outros métodos de criação
}
```

### Responsabilidades

1. **Centralização da Configuração**: Mantém todas as configurações de jogos em um local centralizado
2. **Padronização**: Garante que todos os jogos sigam um padrão de configuração consistente
3. **Gerenciamento de Cenas**: Define as sequências de cenas para cada jogo (início, gameplay, fim)
4. **Configuração de Assets**: Define backgrounds, sprites e outros recursos visuais
5. **Configuração de Engine**: Define parâmetros do Phaser como dimensões, física, etc.

### Estrutura Padrão de Configuração

Cada método de criação retorna um objeto `Phaser.Types.Core.GameConfig` com a seguinte estrutura:

```typescript
{
  type: Phaser.AUTO,           // Tipo de renderização automático
  width: 800,                  // Largura padrão
  height: 600,                 // Altura padrão
  parent: "game-container",    // ID do elemento DOM pai
  backgroundColor: "#color",   // Cor de fundo
  scene: scenes[],            // Array de cenas do jogo
  scale: {                    // Configurações de escala
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  // Configurações específicas (physics, audio, etc.)
}
```

### Padrões de Cenas

#### Jogos Simples (sem progressão de níveis)

```
StartScene → GameScene
```

#### Jogos com Níveis

```
StartScene → GameScene → LevelCompletedScene → GameScene (próximo nível) → EndScene
```

#### Jogos com História

```
StartScene → HistoryScene → GameScene → LevelCompletedScene → EndScene
```

#### Jogos com Seleção de Conteúdo

```
StartScene → ConsonantSelectionScene → GameScene → EndScene
```

### Configurações Específicas

#### Configuração de Física (para jogos que necessitam)

```typescript
physics: {
  default: "matter",
  matter: {
    gravity: { x: 0, y: 0 },
    debug: false,
  },
}
```

#### Configuração de Áudio

```typescript
audio: {
  disableWebAudio: true,  // Evita warnings de autoplay
  noAudio: false,
}
```

### EventBus

Vários jogos utilizam o `EventBus` para comunicação entre cenas:

```typescript
EventBus.once("current-scene-ready", (log: string) => {
  console.log({ log });
});
```

### Exemplos de Uso

#### Jogo Simples

```typescript
static createSumGame(): Phaser.Types.Core.GameConfig {
  const scenes = [
    StartScene.create(
      "GameScene",
      "/assets/sumGame/FUNDO.png",
      "sumBackground",
      "JOGO DA SOMA",
    ),
    SumGameScene,
  ];

  return {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    backgroundColor: "#AED3E3",
    scene: scenes,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  };
}
```

#### Jogo com Progressão

```typescript
static createMemoryGame(): Phaser.Types.Core.GameConfig {
  const scenes = [
    StartScene.create(...),
    MemoryGameScene,
    LevelCompletedScene.create(...),
    EndScene.create(...),
  ];

  return { /* configuração */ };
}
```

---

## GameWrapper.tsx

### Descrição

O `GameWrapper` é um componente React que encapsula e gerencia a instância de um jogo Phaser. Ele serve como a ponte entre a aplicação React e os jogos criados pelo `GameFactory`, fornecendo integração com o contexto do usuário e layout da aplicação.

### Interface

```typescript
interface GameWrapperProps {
  gameConfig: Phaser.Types.Core.GameConfig;
  activityId?: number;
}
```

#### Propriedades

- **`gameConfig`**: Configuração do jogo Phaser criada pelo `GameFactory`
- **`activityId`** (opcional): ID da atividade associada ao jogo para tracking

### Estrutura do Componente

```tsx
export function GameWrapper({ gameConfig, activityId }: GameWrapperProps) {
  const gameRef = useRef<Phaser.Game | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { user } = useUser();

  // Lógica de inicialização
  // Renderização
}
```

### Hooks Utilizados

#### `useRef`

- **`gameRef`**: Referência para a instância do jogo Phaser
- **`containerRef`**: Referência para o elemento DOM que conterá o jogo

#### `useUser`

- Hook customizado que fornece informações do usuário logado
- Utilizado para passar dados do usuário para o jogo

### Ciclo de Vida

#### Inicialização

```typescript
useEffect(() => {
  if (gameRef.current || !user) return; // Previne duplicação

  const config = {
    ...gameConfig,
    parent: containerRef.current, // Define o container DOM
  };

  gameRef.current = new Phaser.Game(config);

  // Registro de dados no jogo
  if (user) {
    gameRef.current.registry.set("userData", user);
    if (activityId) {
      gameRef.current.registry.set("activityId", activityId);
    }
  }
}, [user, activityId]);
```

### Registro de Dados

O componente registra informações importantes no registry do Phaser:

1. **`userData`**: Informações completas do usuário logado
2. **`activityId`**: ID da atividade para tracking de progresso

### Layout e Estrutura Visual

```tsx
return (
  <>
    <div className="mb-20 mt-28 flex justify-center py-4">
      <Header />
      <BackButton />
      <div
        ref={containerRef}
        className="relative h-fit min-h-[600px] w-fit min-w-[800px]"
      >
        {/* Jogo será renderizado aqui */}
      </div>
    </div>
    <Footer />
  </>
);
```

#### Componentes Incluídos

- **`Header`**: Cabeçalho da aplicação
- **`BackButton`**: Botão para voltar à tela anterior
- **`Footer`**: Rodapé da aplicação

#### Classes CSS

- **`mt-28 mb-20`**: Margens superior e inferior
- **`flex justify-center`**: Centralização horizontal
- **`relative h-fit min-h-[600px] w-fit min-w-[800px]`**: Container responsivo do jogo

### Responsabilidades

1. **Gerenciamento de Instância**: Cria e mantém referência à instância do jogo Phaser
2. **Integração com React**: Fornece interface entre React e Phaser
3. **Gestão de Contexto**: Passa dados do usuário para o jogo
4. **Layout**: Integra o jogo com o layout da aplicação
5. **Prevenção de Duplicação**: Evita criação múltipla de instâncias

### Exemplo de Uso

```tsx
import { GameFactory } from "./GameFactory";
import { GameWrapper } from "./GameWrapper";

function SumGamePage() {
  const gameConfig = GameFactory.createSumGame();

  return <GameWrapper gameConfig={gameConfig} activityId={123} />;
}
```

---

## Arquitetura Geral

### Fluxo de Criação de Jogos

1. **Configuração**: `GameFactory` cria configuração específica do jogo
2. **Instanciação**: `GameWrapper` recebe a configuração e cria instância Phaser
3. **Integração**: Dados do usuário são passados para o jogo via registry
4. **Renderização**: Jogo é renderizado no DOM dentro do layout da aplicação

### Diagrama de Dependências

```
GameWrapper.tsx
    ↓
GameFactory.ts
    ↓
Phaser.Game
    ↓
Game Scenes (StartScene, GameScene, etc.)
```

### Padrões de Design Utilizados

1. **Factory Pattern**: `GameFactory` centraliza criação de configurações
2. **Wrapper Pattern**: `GameWrapper` encapsula funcionalidade do Phaser
3. **Registry Pattern**: Dados compartilhados via Phaser registry
4. **Hook Pattern**: Integração com React via hooks customizados

---

## Como Adicionar um Novo Jogo

### 1. Criar as Cenas do Jogo

```typescript
// /games/newGame/scenes/GameScene.ts
export class NewGameScene extends Phaser.Scene {
  // Implementação da cena
}
```

### 2. Adicionar Método no GameFactory

```typescript
// GameFactory.ts
static createNewGame(): Phaser.Types.Core.GameConfig {
  const scenes = [
    StartScene.create(
      "GameScene",
      "/assets/newGame/background.png",
      "newGameBg",
      "NOVO JOGO",
    ),
    NewGameScene,
    // Outras cenas se necessário
  ];

  return {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    backgroundColor: "#FFFFFF",
    scene: scenes,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
  };
}
```

### 3. Criar Componente de Página

```tsx
// pages/NewGamePage.tsx
import { GameFactory } from "@/components/features/games/GameFactory";
import { GameWrapper } from "@/components/features/games/GameWrapper";

export function NewGamePage() {
  const gameConfig = GameFactory.createNewGame();

  return (
    <GameWrapper
      gameConfig={gameConfig}
      activityId={activityId} // Se aplicável
    />
  );
}
```

### 4. Configurar Assets

Adicionar assets necessários em `/public/assets/newGame/`:

- Backgrounds
- Sprites
- Sons
- Dados do jogo (JSON)

### 5. Adicionar Rota

Configurar rota no sistema de roteamento da aplicação para acessar o novo jogo.

### Considerações Importantes

- Seguir padrões de nomenclatura existentes
- Utilizar dimensões padrão (800x600) quando possível
- Implementar cenas comuns (Start, End, LevelCompleted) quando apropriado
- Registrar dados necessários via `gameRef.current.registry.set()`
- Testar integração com dados do usuário
- Verificar responsividade e escala

---

## Manutenção e Boas Práticas

### GameFactory

- Manter métodos organizados por categoria de jogo
- Seguir padrão de nomenclatura `createXxxGame()`
- Documentar configurações especiais inline
- Reutilizar componentes comuns (StartScene, EndScene, etc.)

### GameWrapper

- Não modificar a estrutura base sem considerar impacto em todos os jogos
- Manter compatibilidade com dados do usuário
- Preservar layout responsivo
- Tratar adequadamente limpeza de recursos se necessário

### Geral

- Testar novos jogos em diferentes resoluções
- Verificar compatibilidade com dados de tracking
- Manter consistência visual entre jogos
- Documentar mudanças significativas na arquitetura
