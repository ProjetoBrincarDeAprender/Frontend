// Exemplos de uso da StartScene personalizada para diferentes jogos

import { StartScene } from './StartScene';

// ============================================================================
// EXEMPLOS DE USO DA STARTSCENE PERSONALIZADA
// ============================================================================

// Exemplo 1: Uso básico - usa todos os padrões
const basicStartScene = StartScene.create();

// Exemplo 2: Jogo Espacial
const spaceStartScene = StartScene.create(
    "SpaceGameScene",                           // Cena de destino
    "/assets/spaceGame/background.png",         // Background
    "spaceBackground",                          // Chave do background
    "AVENTURA ESPACIAL",                        // Título do jogo
    "/assets/spaceGame/rocket-trophy.png",      // Imagem do troféu
    "rocketTrophy"                              // Chave do troféu
);

// Exemplo 3: Jogo de Memória
const memoryStartScene = StartScene.create(
    "MemoryGameScene",
    "/assets/memoryGame/background.jpg",
    "memoryBackground", 
    "DESAFIO DE MEMÓRIA",
    "/assets/memoryGame/brain-trophy.png",
    "brainTrophy"
);

// Exemplo 4: Click Button Game
const clickButtonStartScene = StartScene.create(
    "clickButtonGameScene",
    "/assets/clickedButton/gameData/background.png",
    "clickButtonBackground",
    "CLIQUE NO BOTÃO CERTO",
    "/assets/clickedButton/button-trophy.png",
    "buttonTrophy"
);

// Exemplo 5: Jogo de Vogais
const vowelsStartScene = StartScene.create(
    "VowelsGameScene",
    "/assets/vowelsGame/images/background.png",
    "vowelsBackground",
    "APRENDA AS VOGAIS",
    "/assets/vowelsGame/letter-trophy.png", 
    "letterTrophy"
);

// Exemplo 6: Jogo que vai para URL externa
const catalogStartScene = StartScene.create(
    "/games",                                   // URL - volta para catálogo
    "/assets/common/catalog-background.png",
    "catalogBackground",
    "ESCOLHA SEU JOGO"
);

// Exemplo 7: Usando construtor direto
const customStartScene = new StartScene({
    nextSceneName: "MyCustomGameScene",
    backgroundPath: "/assets/myGame/start-bg.png",
    backgroundKey: "myStartBg",
    gameTitle: "MEU JOGO INCRÍVEL",
    trophyImagePath: "/assets/myGame/custom-trophy.png",
    trophyImageKey: "myTrophy"
});

// ============================================================================
// CONFIGURAÇÃO EM UM JOGO COMPLETO
// ============================================================================

// Exemplo de configuração do Phaser para Click Button Game
export const ClickButtonGameConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#ffffff',
    scene: [
        // StartScene personalizada para o Click Button Game
        StartScene.create(
            "clickButtonGameScene",
            "/assets/clickedButton/gameData/background.png",
            "clickButtonStartBg",
            "CLIQUE NO BOTÃO CORRETO",
            "/assets/clickedButton/button-trophy.png",
            "buttonTrophy"
        ),
        
        // Outras cenas do jogo...
        // new ClickButtonGameScene('/assets/clickedButton/gameData/main.json'),
        // EndScene, etc...
    ]
};

// ============================================================================
// TIPOS DE REDIRECIONAMENTO
// ============================================================================

// 1. Para outra cena do Phaser (string sem '/')
StartScene.create("GameScene");           // → this.scene.start("GameScene")
StartScene.create("MenuScene");           // → this.scene.start("MenuScene")

// 2. Para URL/página (string com '/')
StartScene.create("/games");              // → window.location.href = "/games"
StartScene.create("/dashboard");          // → window.location.href = "/dashboard"
StartScene.create("/");                   // → window.location.href = "/"

// ============================================================================
// RESUMO DOS PARÂMETROS
// ============================================================================

/*
StartScene.create(nextSceneName?, backgroundPath?, backgroundKey?, gameTitle?, trophyImagePath?, trophyImageKey?)

Parâmetros:
1. nextSceneName (opcional): Nome da cena Phaser ou URL para ir quando clicar em "INICIAR"
2. backgroundPath (opcional): Caminho para a imagem de fundo
3. backgroundKey (opcional): Chave única para identificar a imagem de fundo  
4. gameTitle (opcional): Título que aparece na tela inicial
5. trophyImagePath (opcional): Caminho para a imagem dos troféus
6. trophyImageKey (opcional): Chave única para identificar a imagem dos troféus

Valores padrão:
- nextSceneName: "GameScene"
- backgroundPath: "/assets/spaceGame/background.png"
- backgroundKey: "backgroundStart"  
- gameTitle: "VAMOS JOGAR"
- trophyImagePath: "/assets/common/trophy.png"
- trophyImageKey: "trophy"

Exemplos de uso:
✅ StartScene.create() // Usa todos os padrões
✅ StartScene.create("MyGameScene") // Só muda destino
✅ StartScene.create("MyGameScene", "/assets/myGame/bg.png") // Muda destino e background
✅ StartScene.create("MyGameScene", "/assets/myGame/bg.png", "myBg", "MEU JOGO") // Com título
✅ StartScene.create("MyGameScene", "/assets/myGame/bg.png", "myBg", "MEU JOGO", "/assets/myGame/trophy.png", "myTrophy") // Completo
*/

// ============================================================================
// EXEMPLOS ESPECÍFICOS POR TIPO DE JOGO
// ============================================================================

// Para jogos educacionais
export const EducationalGameStart = {
    startScene: StartScene.create(
        "EducationGameScene",
        "/assets/education/classroom-bg.png",
        "classroomBg",
        "VAMOS APRENDER JUNTOS!",
        "/assets/education/graduation-trophy.png",
        "graduationTrophy"
    )
};

// Para jogos de ação/aventura
export const ActionGameStart = {
    startScene: StartScene.create(
        "ActionGameScene",
        "/assets/action/battle-bg.png", 
        "battleBg",
        "AVENTURA ÉPICA",
        "/assets/action/sword-trophy.png",
        "swordTrophy"
    )
};

// Para jogos de quebra-cabeça
export const PuzzleGameStart = {
    startScene: StartScene.create(
        "PuzzleGameScene",
        "/assets/puzzle/mystery-bg.png",
        "mysteryBg", 
        "DESAFIO MENTAL",
        "/assets/puzzle/gear-trophy.png",
        "gearTrophy"
    )
};

// Para minijogos que voltam ao catálogo
export const MinigameStart = {
    startScene: StartScene.create(
        "/games",
        "/assets/minigame/simple-bg.png",
        "simpleBg",
        "MINIJOGO RÁPIDO",
        "/assets/minigame/star-trophy.png",
        "starTrophy"
    )
};

// ============================================================================
// INTEGRAÇÃO COM TEMPLATE DE JOGO
// ============================================================================

export class MyGameTemplate {
    
    static createStartScene(gameConfig: {
        sceneName: string;
        backgroundAsset: string;
        title: string;
        trophyAsset?: string;
    }): StartScene {
        return StartScene.create(
            gameConfig.sceneName,
            gameConfig.backgroundAsset,
            `${gameConfig.sceneName}Background`,
            gameConfig.title,
            gameConfig.trophyAsset || "/assets/common/trophy.png",
            `${gameConfig.sceneName}Trophy`
        );
    }
    
    // Exemplo de uso do template
    static getClickButtonStartScene(): StartScene {
        return this.createStartScene({
            sceneName: "clickButtonGameScene",
            backgroundAsset: "/assets/clickedButton/gameData/background.png",
            title: "CLIQUE NO BOTÃO CORRETO",
            trophyAsset: "/assets/clickedButton/button-trophy.png"
        });
    }
    
    static getVowelsStartScene(): StartScene {
        return this.createStartScene({
            sceneName: "vowelsGameScene", 
            backgroundAsset: "/assets/vowelsGame/images/background.png",
            title: "APRENDA AS VOGAIS",
            trophyAsset: "/assets/vowelsGame/abc-trophy.png"
        });
    }
}

// ============================================================================
// CONFIGURAÇÃO RESPONSIVA PARA DIFERENTES TAMANHOS
// ============================================================================

export class ResponsiveStartScene {
    
    static createForMobile(gameTitle: string, nextScene: string): StartScene {
        return StartScene.create(
            nextScene,
            "/assets/common/mobile-bg.png",
            "mobileBg", 
            gameTitle,
            "/assets/common/mobile-trophy.png",
            "mobileTrophy"
        );
    }
    
    static createForDesktop(gameTitle: string, nextScene: string): StartScene {
        return StartScene.create(
            nextScene,
            "/assets/common/desktop-bg.png", 
            "desktopBg",
            gameTitle,
            "/assets/common/desktop-trophy.png",
            "desktopTrophy"
        );
    }
}

// ============================================================================
// RESUMO DA FUNCIONALIDADE
// ============================================================================

/**
 * ✅ O que foi parametrizado:
 * 1. nextSceneName - Cena ou URL de destino ao clicar "INICIAR"
 * 2. backgroundPath/backgroundKey - Background personalizado
 * 3. gameTitle - Título do jogo na tela inicial
 * 4. trophyImagePath/trophyImageKey - Imagens dos troféus laterais
 * 
 * ✅ Benefícios:
 * - Uma StartScene reutilizável para todos os jogos
 * - Cada jogo mantém sua identidade visual
 * - Suporte para redirecionamento para URLs ou cenas Phaser
 * - Fácil configuração através do método estático create()
 * 
 * ✅ Como usar:
 * - StartScene.create() para usar padrões
 * - StartScene.create(nextScene, background, ...) para personalizar
 * - Funciona com qualquer jogo Phaser ou redirecionamento web
 */