/**
 * Exemplo de como usar o sistema de estratégias de renderização
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

// 3. Nível com áudio
const levelWithAudio = {
  answer: "GATO",
  question: "Que animal você está ouvindo?",
  audioKey: "catSound", // Chave do áudio a ser reproduzido
  options: ["GATO", "CACHORRO", "PÁSSARO", "PEIXE"],
  // Note: não há 'content' ou 'completeContent' para níveis de áudio
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
  levelWithAudio,
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
