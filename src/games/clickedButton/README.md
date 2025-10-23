# Documentação: Jogo de Clicar em Botões

Este documento explica o funcionamento do jogo de clicar em botões com Phaser. O objetivo é que qualquer jogo que contenha a estrutura de um "jogo de clique em um botão", funcione com o mesmo código fonte. Ou seja, esse código é para jogos que não envolvam física ou arrastar elementos. A única ação possível no jogo deve ser a de clicar em um único botão por vez. Além disso estes são os elementos necessários para que o jogo aconteça:

- **Conteúdo**: O estímulo necessário para que o usuário pense na questão, podendo ser um array de números com um faltante. Ex: 1, 2, \_, 4, 5
- **Opções**: As alternativas que o usuário deverá escolher. Ex "4, 3, 6, 1"
- **Questão**: Uma pergunta ou comando. Ex: "Complete a sequência"
- **Resposta**: Uma única resposta correta. Ex: "3"
- **Entidade**?: Uma imagem auxiliar. É totalmente opcional.

## Visão Geral

A classe `ClickButtonStart` gerencia o menu inicial, contendo botões para iniciar o jogo ou sair, além de uma imagem de fundo e de título.

A classe `ClickButtonGame` é responsável por gerenciar a cena principal do jogo, realizando o carregamento dos dados, imagens, sons e entidades necessárias. Ela inicializa os gerenciadores de níveis e botões, cria o fundo do jogo e coordena a exibição dos elementos visuais e interativos (questão, entidade, conteúdo e opções) através da lógica implementada em `ClickButtonLogic`.

A classe `ClickButtonLogic` gerencia toda a lógica de apresentação e interação do jogo, incluindo perguntas, entidades visuais, conteúdo, opções de resposta, efeitos e sons. Em geral, essa será a classe realmente importante. Caso precise realizar alguma modificação, muito provavelmente será aqui. Portanto, irei me ater nela no decorrer do documento.

## Como criar seu próprio jogo

Defina um JSON para o início e outro para o jogo principal a partir dos modelos de `startData` e `mainData`, localizados em public/assets/clickButtonGame/. A partir daí, você deve criar um novo componente react que comporte seu jogo e passar o caminho do JSON como parâmetro no momento de instanciar a cena. Isso por si só já deve fazer o jogo funcionar.

```typescript
const clickButtonStartScene = new ClickButtonStartScene(
  "/assets/clickButtonGame/gameData/startData.JSON",
);
const clickButtonGameScene = new ClickButtonGameScene(
  "/assets/clickButtonGame/gameData/mainData.JSON",
);
```

## Dependências de `ClickButtonLogic`

- **Phaser.Scene**: Cena principal do Phaser.
- **LevelManager**: Gerencia os níveis do jogo.
- **ButtonManager**: Cria e gerencia botões interativos.
- **EffectManager**: Aplica efeitos visuais aos botões.
- **SoundManager**: Gerencia sons de feedback.
- **Button**: Tipo dos botões utilizados.

## Principais Métodos de `ClickButtonLogic`

- `showQuestion()`: Exibe a pergunta/comando do nível atual.
- `showEntity()`: Exibe a entidade visual (imagem) do nível.
- `showContent()`: Exibe o conteúdo/estímulo relacionado ao nível.
- `showOptions()`: Exibe as opções de resposta e configura os eventos de clique.
- `handleOptionClick(selectedOption)`: Lógica de resposta ao clique em uma opção.
- `updateContentToComplete()`: Atualiza o conteúdo após resposta correta.
- `clearLevelElements()`: Limpa elementos visuais do nível anterior.
- `nextLevel()`: Avança para o próximo nível ou finaliza o jogo.
- `setOptionsEnabled(enabled)`: Habilita/desabilita interatividade das opções.

## Fluxo de Funcionamento do Jogo

1. Em `ClickButtonStart` o usuário inicia o jogo.
2. `ClickButtonGame` inicia o carregamento dos assets e instancia a lógica.
3. `ClickButtonLogic` recebe a cena, gerenciadores de nível e botões.
4. `ClickButtonLogic` exibe pergunta, entidade, conteúdo e opções.
5. Usuário interage com opções; efeitos e sons são disparados conforme resposta.
6. Avança para próximo nível ou reinicia cena.

## Exemplos de Uso

```typescript
const logic = new ClickButtonLogic(scene, levelManager, buttonManager);
logic.showQuestion();
logic.showEntity();
logic.showContent();
logic.showOptions();
```

## Observações

- A classe `ClickButtonLogic` depende fortemente da estrutura dos níveis definida em `LevelManager`.
- Os efeitos visuais e sons são customizáveis via `EffectManager` e `SoundManager`.
- O fluxo pode ser estendido para incluir novas interações ou tipos de feedback.

---

## Dicas e Melhores Práticas

- **Formato esperado dos arquivos JSON:**
  - O arquivo de dados do jogo (`mainData.JSON`) deve conter as chaves `config`, `textures`, `audios`, `buttonConfig` e `levels`.
  - O arquivo de dados de início (`startData.JSON`) deve conter as configurações de tela inicial e botões.

- **Exemplo de estrutura de um nível no JSON:**

  ```json
  {
    "answer": "A",
    "question": "COMPLETE AS VOGAIS",
    "content": ["_", "E", "I", "O", "U"],
    "completeContent": ["A", "E", "I", "O", "U"],
    "options": ["A", "U"]
  }
  ```

- **Dicas para debugging:**
  - Verifique se os caminhos das imagens e sons estão corretos e acessíveis.
  - Certifique-se de que todos os níveis possuem as chaves obrigatórias (`answer`, `question`, `content`, `options`).
  - Use o console do navegador para identificar erros de carregamento ou execução.
  - Se o jogo não iniciar, confira se o JSON está bem formatado e se os assets estão presentes na pasta correta.

- **Referência para assets:**
  - Imagens e sons devem estar em `public/assets/` e os caminhos devem ser relativos a essa pasta.
  - Para criar novos assets, siga o padrão dos arquivos existentes ou utilize ferramentas de edição gráfica e áudio.

---
