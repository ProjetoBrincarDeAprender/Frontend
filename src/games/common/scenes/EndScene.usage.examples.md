// Exemplos de uso da EndScene com todas as personalizações

import { EndScene } from './EndScene';

// ============================================================================
// EXEMPLOS DE USO COM TODAS AS PERSONALIZAÇÕES
// ============================================================================

// Exemplo 1: Uso básico - só redireciona para /games
const basicEndScene = EndScene.create();

// Exemplo 2: Jogo Espacial com mensagem personalizada
const spaceEndScene = EndScene.create(
    "SpaceMenuScene",
    "/assets/spaceGame/background.png",
    "spaceBackground",
    "PARABÉNS! VOCÊ EXPLOROU TODO O ESPAÇO!",
    "/assets/spaceGame/astronaut-happy.png",
    "astronautHappy"
);

// Exemplo 3: Jogo de Memória
const memoryEndScene = EndScene.create(
    "MemoryMenuScene", 
    "/assets/memoryGame/background.jpg",
    "memoryBackground",
    "INCRÍVEL! SUA MEMÓRIA É FANTÁSTICA!",
    "/assets/memoryGame/brain-celebrating.png",
    "brainCelebrating"
);

// Exemplo 4: Jogo de Vogais com volta para catálogo
const vowelsEndScene = EndScene.create(
    "/games", // Volta para catálogo
    "/assets/vowelsGame/images/backgroundCredits.png",
    "vowelsBackground",
    "EXCELENTE! VOCÊ DOMINOU AS VOGAIS!",
    "/assets/vowelsGame/duda-vowels.png",
    "dudaVowels"
);

// Exemplo 5: Click Button Game
const clickButtonEndScene = EndScene.create(
    "clickButtonStartScene",
    "/assets/clickedButton/gameData/background.png",
    "clickButtonBackground",
    "MUITO BEM! VOCÊ ACERTOU TODOS OS BOTÕES!",
    "/assets/clickedButton/duda-pointing.png",
    "dudaPointing"
);

// Exemplo 6: Usando construtor direto com todas as opções
const customEndScene = new EndScene({
    restartScene: "/profile",
    backgroundPath: "/assets/myGame/endBackground.png",
    backgroundKey: "myGameBackground",
    subtitleMessage: "MISSÃO CUMPRIDA, HERÓI!",
    dudaImagePath: "/assets/myGame/character-victory.png",
    dudaImageKey: "characterVictory"
});

// ============================================================================
// CONFIGURAÇÃO EM UM JOGO COMPLETO
// ============================================================================

// Exemplo de configuração do Phaser para um jogo específico
export const ClickButtonGameConfig = {
    // ... outras configurações
    scene: [
        // Suas cenas do jogo
        // ClickButtonStartScene,
        // ClickButtonGameScene,
        
        // EndScene personalizada para o Click Button Game
        EndScene.create(
            "clickButtonStartScene", 
            "/assets/clickedButton/gameData/background.png",
            "clickButtonEndBg",
            "PARABÉNS! VOCÊ COMPLETOU TODOS OS DESAFIOS!",
            "/assets/clickedButton/duda-thumbs-up.png",
            "dudaThumbsUp"
        )
    ]
};

// ============================================================================
// USO DINÂMICO DURANTE O JOGO
// ============================================================================

export class GameScene extends Phaser.Scene {
    
    private onGameComplete() {
        // Opção 1: Usar EndScene já configurada
        this.scene.start("EndScene");
    }
    
    private onGameCompleteWithCustomizations() {
        // Opção 2: Criar EndScene dinamicamente com personalizações completas
        const customEndScene = EndScene.create(
            "/games", // Volta para catálogo
            "/assets/seasonal/winter-background.png",
            "winterBg",
            "FELIZ NATAL! VOCÊ COMPLETOU O DESAFIO DE INVERNO!",
            "/assets/seasonal/santa-duda.png",
            "santaDuda"
        );
        
        this.scene.add("WinterEndScene", customEndScene, true);
        this.scene.start("WinterEndScene");
    }
}

// ============================================================================
// TIPOS DE REDIRECIONAMENTO
// ============================================================================

// 1. Para outra cena do Phaser (string sem '/')
EndScene.create("MenuScene"); // → this.scene.start("MenuScene")

// 2. Para URL/página (string com '/')
EndScene.create("/games");     // → window.location.href = "/games"
EndScene.create("/profile");   // → window.location.href = "/profile"
EndScene.create("/");          // → window.location.href = "/"

// ============================================================================
// RESUMO DOS PARÂMETROS
// ============================================================================

/*
EndScene.create(restartScene?, backgroundPath?, backgroundKey?, subtitleMessage?, dudaImagePath?, dudaImageKey?)

Parâmetros:
1. restartScene (opcional): Nome da cena Phaser ou URL para redirecionar
2. backgroundPath (opcional): Caminho para a imagem de fundo
3. backgroundKey (opcional): Chave única para identificar a imagem de fundo
4. subtitleMessage (opcional): Mensagem personalizada de parabéns
5. dudaImagePath (opcional): Caminho para a imagem da Duda ou personagem
6. dudaImageKey (opcional): Chave única para identificar a imagem da Duda

Valores padrão:
- restartScene: "/games" (vai para catálogo de jogos)
- backgroundPath: "/assets/spaceGame/background.png"  
- backgroundKey: "background"
- subtitleMessage: "VOCÊ COMPLETOU O JOGO!"
- dudaImagePath: "/assets/common/duda/dudaClap.png"
- dudaImageKey: "dudaClap"

Exemplos de uso:
✅ EndScene.create() // Usa todos os padrões
✅ EndScene.create("MenuScene") // Só muda destino
✅ EndScene.create("/games", "/assets/myGame/bg.png") // Muda destino e background
✅ EndScene.create("/games", "/assets/myGame/bg.png", "myBg", "PARABÉNS!") // Com mensagem
✅ EndScene.create("/games", "/assets/myGame/bg.png", "myBg", "PARABÉNS!", "/assets/myGame/char.png", "myChar") // Completo
*/

// ============================================================================
// EXEMPLOS PARA DIFERENTES JOGOS
// ============================================================================

// Para jogos que voltam ao próprio menu
export const GameWithOwnMenu = {
    endScene: EndScene.create(
        "gameMenuScene",
        "/assets/myGame/victory-bg.png",
        "victoryBg",
        "VITÓRIA CONQUISTADA!",
        "/assets/myGame/hero-celebrating.png",
        "heroCelebrating"
    )
};

// Para jogos que voltam ao catálogo geral
export const GameToCatalog = {
    endScene: EndScene.create(
        "/games",
        "/assets/myGame/end-bg.png",
        "endBg",
        "JOGO FINALIZADO COM SUCESSO!"
    )
};

// Para jogos educacionais com feedback específico
export const EducationalGame = {
    endScene: EndScene.create(
        "/dashboard",
        "/assets/educational/classroom-bg.png",
        "classroomBg",
        "EXCELENTE APRENDIZADO! CONTINUE PRATICANDO!",
        "/assets/educational/teacher-duda.png",
        "teacherDuda"
    )
};

// ============================================================================
// INTEGRAÇÃO EM TEMPLATE DE JOGO
// ============================================================================

export class MyGameScene extends Phaser.Scene {
    
    private registerEndScene(): void {
        // Registra EndScene personalizada para o jogo atual
        const gameEndScene = EndScene.create(
            "/games", // Volta para catálogo após jogo
            this.getGameBackground(), // Background específico do jogo
            "gameEndBg",
            this.getVictoryMessage(), // Mensagem específica do jogo
            this.getCharacterImage(), // Personagem específico do jogo
            "gameCharacter"
        );
        
        this.scene.add("gameEndScene", gameEndScene);
    }
    
    private getGameBackground(): string {
        // Lógica para determinar background baseado no jogo atual
        return "/assets/currentGame/background.png";
    }
    
    private getVictoryMessage(): string {
        // Lógica para determinar mensagem baseada no progresso
        return "PARABÉNS! VOCÊ CONCLUIU ESTE DESAFIO!";
    }
    
    private getCharacterImage(): string {
        // Lógica para escolher personagem baseado no jogo
        return "/assets/currentGame/character-happy.png";
    }
}