/**
 * Exemplo de como usar o sistema de est// 5. Nível combinado (imagem + áudio + texto)
const levelCombined = {
  answer: "TRÊS",
  question: "Conte quantos objetos você vê e ouve:",
  entityKey: "countingImage", // Imagem com objetos
  audioKey: "countingSound", // Som que ajuda na contagem
  options: ["UM", "DOIS", "TRÊS", "QUATRO"],
  content: ["?", "?", "?"], // Espaços para mostrar a contagem
  completeContent: ["1", "2", "3"] // Números após resposta correta
};

export const exampleLevels = [
  levelWithImage,
  levelWithTextOnly,
  levelWithAudioOnly,
  levelWithAudioAndText,
  levelCombined
];rização
 * com diferentes tipos de conteúdo: imagem + texto, apenas texto, e áudio.
 */

// Exemplo de dados JSON para diferentes tipos de níveis

// 1. Nível com imagem e conteúdo textual
const levelWithImage = {
  answer: "D",
  question: "Complete a sequência:",
  entityKey: "sequenceHelper", // Imagem auxiliar
  options: ["A", "B", "C", "D"],
  content: ["A", "B", "C", "?"], // Array de letras
  completeContent: ["A", "B", "C", "D"], // Sequência completa
};

// 2. Nível apenas com conteúdo textual (sem imagem)
const levelWithTextOnly = {
  answer: "CASA",
  question: "Complete a palavra:",
  options: ["CARRO", "CASA", "CAMA", "CARTA"],
  content: ["C", "A", "S", "?"], // Array de letras
  completeContent: ["C", "A", "S", "A"], // Palavra completa
};

// 3. Nível com áudio (apenas som)
const levelWithAudioOnly = {
  answer: "GATO",
  question: "Que animal você está ouvindo?",
  audioKey: "catSound", // Chave do áudio a ser reproduzido
  options: ["GATO", "CACHORRO", "PÁSSARO", "PEIXE"],
  // Note: sem 'content' - apenas o botão de áudio será exibido
};

// 4. Nível com áudio + conteúdo textual
const levelWithAudioAndText = {
  answer: "CASA",
  question: "Ouça o som e complete a palavra:",
  audioKey: "houseSound", // Som que ajuda a identificar
  content: ["C", "A", "S", "?"], // Array de letras abaixo do botão de áudio
  completeContent: ["C", "A", "S", "A"], // Palavra completa após resposta
  options: ["CARRO", "CASA", "CAMA", "CARTA"],
};

// 4. Nível combinado (imagem + áudio + texto)
const levelCombined = {
  answer: "TRÊS",
  question: "Conte quantos objetos você vê e ouve:",
  entityKey: "countingImage", // Imagem com objetos
  audioKey: "countingSound", // Som que ajuda na contagem
  options: ["UM", "DOIS", "TRÊS", "QUATRO"],
  content: ["?", "?", "?"], // Espaços para mostrar a contagem
  completeContent: ["1", "2", "3"], // Números após resposta correta
};

export const exampleLevels = [
  levelWithImage,
  levelWithTextOnly,
  levelWithAudioOnly,
  levelWithAudioAndText,
  levelCombined,
];

/**
 * Como o sistema funciona:
 *
 * 1. ContentRendererFactory.getRenderer(level) analisa o nível e determina qual estratégia usar:
 *    - Se tem audioKey -> AudioContentRenderer
 *    - Se tem entityKey + content -> ImageContentRenderer
 *    - Se tem apenas content -> TextContentRenderer
 *
 * 2. A estratégia escolhida implementa:
 *    - canRender(): verifica se pode renderizar o tipo de conteúdo
 *    - render(): renderiza o conteúdo inicial
 *    - updateToComplete(): atualiza para o estado "completo"
 *    - clear(): limpa os elementos renderizados
 *
 * 3. Vantagens da inversão de dependência:
 *    - Fácil adição de novos tipos de conteúdo
 *    - Cada estratégia é responsável apenas por seu tipo
 *    - Reduz a complexidade do ClickButtonLogic
 *    - Permite testes unitários isolados de cada estratégia
 */
