import SubtractionLevel from "./MathLevel";

export interface SubtractionLevelDefinition {
  num1: number; // primeiro número mostrado
  num2: number; // segundo número mostrado
  answer: number; // resposta correta (num1 - num2 ou qualquer valor que queira forçar)
  options?: number[]; // opções de múltipla escolha (incluímos answer automaticamente se faltar)
}

/**
 * Cria uma lista de níveis de subtração a partir de definições simples.
 * Cada definição exige apenas os números e a resposta; as imagens dos bloquinhos
 * serão determinadas automaticamente pelo NumberDisplay através dos valores (1..5).
 * Se options for fornecido o nível vira múltipla escolha, caso contrário vira nível de input.
 */
export function createSubtractionLevels(
  defs: SubtractionLevelDefinition[],
): SubtractionLevel[] {
  return defs.map((def) => SubtractionLevel.fromDefinition(def));
}

/**
 * Exemplo pronto: gera um conjunto padrão de 15 níveis.
 * Você pode substituir ou gerar dinamicamente conforme necessidade.
 */
export function createDefaultSubtractionLevels(): SubtractionLevel[] {
  const definitions: SubtractionLevelDefinition[] = [];

  // 5 múltipla escolha (garantindo valores 1..5 para exibir blocos)
  for (let i = 0; i < 5; i++) {
    const a = randomInt(2, 5); // num1
    const b = randomInt(1, a - 1); // num2 menor que num1
    const answer = a - b;
    const opts = generateOptions(answer, -5, 10); // inclui positivos e alguns negativos
    definitions.push({ num1: a, num2: b, answer, options: opts });
  }

  // 5 input simples
  for (let i = 0; i < 5; i++) {
    const a = randomInt(3, 9);
    const b = randomInt(1, Math.min(5, a - 1));
    const answer = a - b;
    definitions.push({ num1: a, num2: b, answer });
  }

  // 5 múltipla escolha permitindo resultado negativo (subtração estendida)
  for (let i = 0; i < 5; i++) {
    const a = randomInt(3, 9);
    const b = randomInt(1, 9); // pode ser maior que a -> resultado negativo
    const answer = a - b;
    const opts = generateOptions(answer, -10, 10);
    definitions.push({ num1: a, num2: b, answer, options: opts });
  }

  return createSubtractionLevels(definitions);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOptions(correct: number, min: number, max: number): number[] {
  const set = new Set<number>();
  set.add(correct);
  while (set.size < 3) {
    set.add(randomInt(min, max));
  }
  return Array.from(set).sort(() => Math.random() - 0.5);
}
