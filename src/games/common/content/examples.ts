/**
 * Exemplo de uso e testes para o sistema de geração dinâmica de sílabas
 */

import { SyllableGameDataGenerator } from "../utils/SyllableGameDataGenerator";

// Exemplo 1: Gerar dados para a consoante "P"
console.log("=== Dados gerados para consoante P ===");
const pData = SyllableGameDataGenerator.generateGameData("P");
console.log("Níveis gerados:", pData.levels.length);
console.log("Primeiro nível:", pData.levels[0]);
console.log(
  "Áudios gerados:",
  pData.audios.filter((a: any) => a.key.includes("P")),
);

// Exemplo 2: Verificar todas as consoantes disponíveis
console.log("\n=== Consoantes disponíveis ===");
const consonants = SyllableGameDataGenerator.getAvailableConsonants();
console.log("Total de consoantes:", consonants.length);
console.log("Consoantes:", consonants.join(", "));

// Exemplo 3: Verificar vogais disponíveis
console.log("\n=== Vogais disponíveis ===");
const vowels = SyllableGameDataGenerator.getAvailableVowels();
console.log("Vogais:", vowels.join(", "));

// Exemplo 4: Testar geração para múltiplas consoantes
console.log("\n=== Teste de múltiplas consoantes ===");
const testConsonants = ["B", "C", "M", "T"];
testConsonants.forEach((consonant) => {
  const data = SyllableGameDataGenerator.generateGameData(consonant);
  console.log(`${consonant}: ${data.levels.length} níveis gerados`);

  // Verificar se todas as vogais estão presentes
  const generatedVowels = data.levels.map((level: any) => level.answer);
  const allVowelsPresent = vowels.every((vowel) =>
    generatedVowels.includes(vowel),
  );
  console.log(`  Todas as vogais presentes: ${allVowelsPresent}`);
});

// Exemplo 5: Verificar estrutura dos dados gerados
console.log("\n=== Verificação da estrutura dos dados ===");
const sampleData = SyllableGameDataGenerator.generateGameData("S");
console.log("Propriedades do objeto principal:", Object.keys(sampleData));
console.log("Propriedades de config:", Object.keys(sampleData.config));
console.log("Tipos de texturas:", Object.keys(sampleData.textures));
console.log("Total de áudios:", sampleData.audios.length);
console.log("Propriedades de info:", Object.keys(sampleData.info));

// Exemplo 6: Testar a aleatoriedade das opções
console.log("\n=== Teste de aleatoriedade das opções ===");
const randomTests = [];
for (let i = 0; i < 10; i++) {
  const data = SyllableGameDataGenerator.generateGameData("R");
  const firstLevelOptions = data.levels[0].options;
  randomTests.push(firstLevelOptions[0]); // Primeira opção
}
console.log("Primeiras opções em 10 gerações:", randomTests);
console.log("Há variação:", new Set(randomTests).size > 1);

export {}; // Para tornar este arquivo um módulo
