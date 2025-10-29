# Sistema de Estratégias de Renderização de Conteúdo

Este sistema implementa o padrão **Strategy** com **inversão de dependência** para gerenciar diferentes tipos de conteúdo no jogo ClickButton. Permite adicionar facilmente novos tipos de conteúdo sem modificar o código existente.

## 🏗️ Estrutura do Sistema

### Interface Principal

- **`IContentRenderer`**: Define o contrato que todas as estratégias devem implementar

### Estratégias Implementadas

- **`ImageContentRenderer`**: Renderiza conteúdo com imagem + texto
- **`TextContentRenderer`**: Renderiza apenas conteúdo textual
- **`AudioContentRenderer`**: Reproduz áudio com controles

### Factory

- **`ContentRendererFactory`**: Determina qual estratégia usar baseado no tipo de conteúdo

## 📋 Como Funciona

### 1. Detecção Automática

O sistema analisa o nível e escolhe automaticamente a estratégia apropriada:

```typescript
const renderer = ContentRendererFactory.getRenderer(level);
if (renderer) {
  renderer.render(level, scene, buttonManager);
}
```

### 2. Prioridade das Estratégias

1. **AudioContentRenderer** - Se tem `audioKey` (pode ter ou não `content`)
2. **ImageContentRenderer** - Se tem `entityKey` + `content`
3. **TextContentRenderer** - Se tem apenas `content`

### 3. Tipos de Nível Suportados

#### Nível com Imagem + Texto

```json
{
  "answer": "D",
  "question": "Complete a sequência:",
  "entityKey": "sequenceHelper",
  "content": ["A", "B", "C", "?"],
  "completeContent": ["A", "B", "C", "D"],
  "options": ["A", "B", "C", "D"]
}
```

#### Nível com Apenas Texto

```json
{
  "answer": "CASA",
  "question": "Complete a palavra:",
  "content": ["C", "A", "S", "?"],
  "completeContent": ["C", "A", "S", "A"],
  "options": ["CARRO", "CASA", "CAMA", "CARTA"]
}
```

#### Nível com Apenas Áudio

```json
{
  "answer": "GATO",
  "question": "Que animal você está ouvindo?",
  "audioKey": "catSound",
  "options": ["GATO", "CACHORRO", "PÁSSARO", "PEIXE"]
}
```

#### Nível com Áudio + Conteúdo Textual

```json
{
  "answer": "CASA",
  "question": "Ouça o som e complete a palavra:",
  "audioKey": "houseSound",
  "content": ["C", "A", "S", "?"],
  "completeContent": ["C", "A", "S", "A"],
  "options": ["CARRO", "CASA", "CAMA", "CARTA"]
}
```

## 🔧 Modificações Realizadas

### ClickButtonLevel.ts

- Adicionado suporte à propriedade `audioKey`
- Adicionado método `getAudioKey()`

### ClickButtonLogic.ts

- Removida lógica condicional dos métodos `showEntity()` e `showContent()`
- Integração com `ContentRendererFactory`
- Uso de estratégias para renderização e limpeza

### Novas Classes

- Criadas todas as estratégias e factory no diretório `/strategies/`

## 🚀 Vantagens do Sistema

### 1. **Extensibilidade**

Fácil adição de novos tipos de conteúdo:

```typescript
class VideoContentRenderer implements IContentRenderer {
  // Implementação específica para vídeos
}

ContentRendererFactory.addStrategy(new VideoContentRenderer());
```

### 2. **Responsabilidade Única**

Cada estratégia é responsável apenas por seu tipo de conteúdo.

### 3. **Inversão de Dependência**

`ClickButtonLogic` depende da abstração (`IContentRenderer`), não das implementações concretas.

### 4. **Testabilidade**

Cada estratégia pode ser testada isoladamente.

### 5. **Manutenibilidade**

Reduz a complexidade do código principal.

## 📝 Como Adicionar Nova Estratégia

### 1. Implemente a Interface

```typescript
export class MinhaNovaStrategy implements IContentRenderer {
  canRender(level: ClickedButtonLevel): boolean {
    // Lógica para determinar se pode renderizar
    return !!level.getMinhaPropriedade?.();
  }

  render(level, scene, buttonManager): Button[] | null {
    // Lógica de renderização
    return null;
  }

  updateToComplete(level, scene, buttonManager): Button[] | null {
    // Lógica para estado completo
    return null;
  }

  clear(): void {
    // Lógica de limpeza
  }
}
```

### 2. Registre a Estratégia

```typescript
ContentRendererFactory.addStrategy(new MinhaNovaStrategy());
```

### 3. (Opcional) Estenda ClickButtonLevel

Se necessário, adicione novos métodos ao `ClickButtonLevel`:

```typescript
public getMinhaPropriedade(): string {
  return this.minhaPropriedade || "";
}
```

## 📁 Estrutura de Arquivos

```
strategies/
├── IContentRenderer.ts           # Interface principal
├── ImageContentRenderer.ts       # Estratégia para imagem + texto
├── TextContentRenderer.ts        # Estratégia para apenas texto
├── AudioContentRenderer.ts       # Estratégia para áudio
├── ContentRendererFactory.ts     # Factory das estratégias
├── ExampleUsage.ts              # Exemplos de uso
├── ExtensionExamples.ts         # Exemplos de extensão
└── README.md                    # Esta documentação
```

## 🧪 Testes Sugeridos

Para garantir a qualidade do sistema, considere criar testes para:

1. **Factory**: Verifica se retorna a estratégia correta para cada tipo
2. **Estratégias**: Testa renderização, atualização e limpeza
3. **Integração**: Testa o fluxo completo no `ClickButtonLogic`

## 🔮 Próximos Passos

1. **Implementar vídeo**: Adicionar suporte a reprodução de vídeos
2. **Animações**: Adicionar estratégia para conteúdo animado
3. **Interativo**: Estratégia para elementos que respondem a hover/click
4. **3D**: Suporte a elementos tridimensionais
5. **Realidade Aumentada**: Integração com AR para conteúdo imersivo

Este sistema fornece uma base sólida e extensível para diferentes tipos de conteúdo educativo!
