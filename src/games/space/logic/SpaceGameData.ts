export const gameData = {
  levels: [
    // Level 1 - Identificar planeta pelo nome (respostas com imagem)
    {
      difficulty: "easy",
      question: "Onde está o planeta Terra?",
      options: ["terra", "lua", "sol", "saturno"],
      optionsImages: ["earth.png", "moon.png", "sun.png", "saturn.png"],
      answer: "terra",
    },
    {
      difficulty: "easy",
      question: "Qual é o Sol?",
      options: ["planeta", "estrela", "lua", "cometa"],
      optionsImages: ["mars.png", "sun.png", "moon.png", "comet.png"],
      answer: "estrela",
    },
    {
      difficulty: "easy",
      question: "Onde está a Lua?",
      options: ["sol", "marte", "lua", "jupiter"],
      optionsImages: ["sun.png", "mars.png", "moon.png", "jupiter.png"],
      answer: "lua",
    },
    {
      difficulty: "easy",
      question: "Onde está Marte?",
      options: ["marte", "terra", "netuno", "jupiter"],
      optionsImages: ["mars.png", "earth.png", "neptune.png", "jupiter.png"],
      answer: "marte",
    },
    {
      difficulty: "easy",
      question: "Onde está Saturno?",
      options: ["saturno", "jupiter", "urano", "netuno"],
      optionsImages: ["saturn.png", "jupiter.png", "uranus.png", "neptune.png"],
      answer: "saturno",
    },

    // Level 2 - Curiosidades dos planetas (respostas com imagem)
    {
      difficulty: "medium",
      question: "Qual o planeta mais próximo do Sol?",
      options: ["terra", "venus", "mercurio", "marte"],
      optionsImages: ["earth.png", "venus.png", "mercury.png", "mars.png"],
      answer: "mercurio",
    },
    {
      difficulty: "medium",
      question: "Qual é o maior planeta do nosso sistema solar?",
      options: ["saturno", "jupiter", "urano", "netuno"],
      optionsImages: ["saturn.png", "jupiter.png", "uranus.png", "neptune.png"],
      answer: "jupiter",
    },
    {
      difficulty: "medium",
      question: "Qual planeta é conhecido como o 'Planeta Vermelho'?",
      options: ["venus", "marte", "jupiter", "saturno"],
      optionsImages: ["venus.png", "mars.png", "jupiter.png", "saturn.png"],
      answer: "marte",
    },
    {
      difficulty: "medium",
      question: "Qual planeta é o mais quente do sistema solar?",
      options: ["mercurio", "venus", "terra", "marte"],
      optionsImages: ["mercury.png", "venus.png", "earth.png", "mars.png"],
      answer: "venus",
    },
    {
      difficulty: "medium",
      question: "Qual planeta está mais longe do Sol?",
      options: ["jupiter", "saturno", "urano", "netuno"],
      optionsImages: ["jupiter.png", "saturn.png", "uranus.png", "neptune.png"],
      answer: "netuno",
    },
    // Level 3 - Nomes/curiosidades sem imagem
    {
      difficulty: "hard",
      question: "Qual é o nome da galáxia em que vivemos?",
      options: ["Andromeda", "Via Lactea", "Triangulo", "Sombrero"],
      optionsImages: null,
      answer: "Via Lactea",
    },
    {
      difficulty: "hard",
      question: "Quantos planetas existem no nosso sistema solar?",
      options: ["7", "8", "9", "10"],
      optionsImages: null,
      answer: "8",
    },
    {
      difficulty: "hard",
      question: "Qual é o nome do satélite natural da Terra?",
      options: ["Europa", "Queijo", "Lua", "Terra"],
      optionsImages: null,
      answer: "Lua",
    },
    {
      difficulty: "hard",
      question:
        "Qual planeta demora mais tempo para dar uma volta ao redor do Sol?",
      options: ["Jupiter", "Saturno", "Urano", "Netuno"],
      optionsImages: null,
      answer: "Netuno",
    },
    {
      difficulty: "hard",
      question: "Como chamamos os cientistas que estudam o espaço?",
      options: ["Geologos", "Astronomos", "Biologos", "Fisicos"],
      optionsImages: null,
      answer: "Astronomos",
    },
  ],
};
