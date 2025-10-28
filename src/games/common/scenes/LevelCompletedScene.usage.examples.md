// Exemplos de uso da LevelCompletedScene personalizada para diferentes jogos

import { LevelCompletedScene } from './LevelCompletedScene';

// ============================================================================
// EXEMPLOS DE USO DA LEVELCOMPLETEDSCENE PERSONALIZADA
// ============================================================================

// Exemplo 1: Uso básico - usa todos os padrões
const basicLevelCompleteScene = LevelCompletedScene.create();

// Exemplo 2: Click Button Game
const clickButtonLevelComplete = LevelCompletedScene.create(
    "clickButtonGameScene",                     // Próximo nível
    "clickButtonStartScene",                    // Voltar ao menu
    "/assets/clickedButton/gameData/background.png", // Background
    "clickButtonBg",                            // Chave do background
    "/assets/clickedButton/duda-thumbs-up.png", // Imagem da Duda
    "dudaThumbsUp",                             // Chave da Duda
    "BOTÃO CORRETO! PRÓXIMO NÍVEL!"            // Título personalizado
);

// Exemplo 3: Jogo de Vogais
const vowelsLevelComplete = LevelCompletedScene.create(
    "vowelsGameScene",
    "vowelsStartScene",
    "/assets/vowelsGame/images/background.png",
    "vowelsBackground",
    "/assets/vowelsGame/duda-teacher.png",
    "dudaTeacher",
    "VOGAL APRENDIDA! CONTINUE!"
);

// Exemplo 4: Jogo Espacial
const spaceLevelComplete = LevelCompletedScene.create(
    "spaceGameScene",
    "spaceStartScene", 
    "/assets/spaceGame/background.png",
    "spaceBackground",
    "/assets/spaceGame/astronaut-celebrating.png",
    "astronautCelebrating",
    "PLANETA EXPLORADO!"
);

// Exemplo 5: Jogo de Memória
const memoryLevelComplete = LevelCompletedScene.create(
    "memoryGameScene",
    "memoryStartScene",
    "/assets/memoryGame/background.jpg",
    "memoryBackground",
    "/assets/memoryGame/brain-happy.png",
    "brainHappy",
    "MEMÓRIA FANTÁSTICA!"
);

// Exemplo 6: Com redirecionamento para URLs
const catalogLevelComplete = LevelCompletedScene.create(
    "/games",                                   // Próximo vai para catálogo
    "/dashboard",                               // Menu vai para dashboard
    "/assets/common/success-bg.png",
    "successBackground",
    "/assets/common/duda/dudaVictory.png",
    "dudaVictory",
    "DESAFIO SUPERADO!"
);

// Exemplo 7: Jogo de Habitação
const housingLevelComplete = LevelCompletedScene.create(
    "housingGameScene",
    "housingStartScene",
    "/assets/housingGame/background.png", 
    "housingBackground",
    "/assets/housingGame/architect-duda.png",
    "architectDuda",
    "CASA CONSTRUÍDA COM SUCESSO!"
);

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
        // StartScene do jogo
        // StartScene.create(...),
        
        // Cena principal do jogo
        // new ClickButtonGameScene(...),
        
        // LevelCompletedScene personalizada
        LevelCompletedScene.create(
            "clickButtonGameScene",              // Próximo nível
            "clickButtonStartScene",             // Voltar ao menu
            "/assets/clickedButton/gameData/background.png",
            "clickButtonLevelBg",
            "/assets/clickedButton/duda-celebrating.png",
            "dudaCelebrating",
            "EXCELENTE! PRÓXIMO DESAFIO!"
        )
    ]
};

// ============================================================================
// FLUXO DE JOGO COM LEVELCOMPLETEDSCENE
// ============================================================================

export class GameFlowExample {
    
    // No final de cada nível, chama a LevelCompletedScene
    static onLevelComplete(gameType: string): void {
        let levelCompleteScene: LevelCompletedScene;
        
        switch(gameType) {
            case 'clickButton':
                levelCompleteScene = LevelCompletedScene.create(
                    "clickButtonGameScene",
                    "clickButtonStartScene",
                    "/assets/clickedButton/gameData/background.png",
                    "clickButtonBg",
                    "/assets/clickedButton/duda-happy.png",
                    "dudaHappy",
                    "BOTÃO CORRETO! CONTINUE!"
                );
                break;
                
            case 'vowels':
                levelCompleteScene = LevelCompletedScene.create(
                    "vowelsGameScene",
                    "vowelsStartScene",
                    "/assets/vowelsGame/images/background.png",
                    "vowelsLevelBg",
                    "/assets/vowelsGame/duda-teaching.png",
                    "dudaTeaching",
                    "VOGAL DOMINADA!"
                );
                break;
                
            case 'memory':
                levelCompleteScene = LevelCompletedScene.create(
                    "memoryGameScene", 
                    "memoryStartScene",
                    "/assets/memoryGame/background.jpg",
                    "memoryLevelBg",
                    "/assets/memoryGame/duda-thinking.png",
                    "dudaThinking",
                    "MEMÓRIA INCRÍVEL!"
                );
                break;
                
            default:
                levelCompleteScene = LevelCompletedScene.create();
        }
        
        // Registra e inicia a cena
        // scene.add("levelCompleteScene", levelCompleteScene);
        // scene.start("levelCompleteScene");
    }
}

// ============================================================================
// TIPOS DE REDIRECIONAMENTO
// ============================================================================

// 1. Para cenas do Phaser (string sem '/')
LevelCompletedScene.create("nextLevelScene", "menuScene");  // → this.scene.start(...)

// 2. Para URLs (string com '/')
LevelCompletedScene.create("/games", "/dashboard");         // → window.location.href = ...

// 3. Misto - próximo nível para cena, menu para URL
LevelCompletedScene.create("gameScene", "/games");         // → cena + URL

// ============================================================================
// RESUMO DOS PARÂMETROS
// ============================================================================

/*
LevelCompletedScene.create(nextLevelScene?, menuScene?, backgroundPath?, backgroundKey?, dudaImagePath?, dudaImageKey?, levelTitle?)

Parâmetros:
1. nextLevelScene (opcional): Cena do próximo nível ou URL
2. menuScene (opcional): Cena do menu ou URL para voltar
3. backgroundPath (opcional): Caminho para imagem de fundo
4. backgroundKey (opcional): Chave única da imagem de fundo
5. dudaImagePath (opcional): Caminho para imagem da Duda/personagem
6. dudaImageKey (opcional): Chave única da imagem da Duda
7. levelTitle (opcional): Título personalizado do nível completo

Valores padrão:
- nextLevelScene: "GameScene"
- menuScene: "StartScene"
- backgroundPath: "/assets/spaceGame/background.png"
- backgroundKey: "backgroundStart"
- dudaImagePath: "/assets/common/duda/dudaClap.png"
- dudaImageKey: "dudaClap"
- levelTitle: "NÍVEL CONCLUÍDO!"

Exemplos de uso:
✅ LevelCompletedScene.create() // Usa todos os padrões
✅ LevelCompletedScene.create("nextLevel", "menu") // Só muda destinos
✅ LevelCompletedScene.create("nextLevel", "menu", "/assets/myGame/bg.png") // Com background
✅ LevelCompletedScene.create("nextLevel", "menu", "/assets/myGame/bg.png", "myBg", "/assets/myGame/char.png", "myChar", "NÍVEL INCRÍVEL!") // Completo
*/

// ============================================================================
// INTEGRAÇÃO EM TEMPLATE DE JOGO
// ============================================================================

export class GameTemplate {
    
    static createLevelCompleteScene(config: {
        gameType: string;
        nextLevelScene: string;
        menuScene: string;
        customTitle?: string;
    }): LevelCompletedScene {
        
        const gameAssets = this.getGameAssets(config.gameType);
        
        return LevelCompletedScene.create(
            config.nextLevelScene,
            config.menuScene,
            gameAssets.background,
            `${config.gameType}LevelBg`,
            gameAssets.character,
            `${config.gameType}Character`,
            config.customTitle || `${config.gameType.toUpperCase()} - NÍVEL CONCLUÍDO!`
        );
    }
    
    private static getGameAssets(gameType: string) {
        const assetMap = {
            clickButton: {
                background: "/assets/clickedButton/gameData/background.png",
                character: "/assets/clickedButton/duda-celebrating.png"
            },
            vowels: {
                background: "/assets/vowelsGame/images/background.png",
                character: "/assets/vowelsGame/duda-teacher.png"
            },
            memory: {
                background: "/assets/memoryGame/background.jpg",
                character: "/assets/memoryGame/duda-brain.png"
            },
            space: {
                background: "/assets/spaceGame/background.png", 
                character: "/assets/spaceGame/astronaut-duda.png"
            }
        };
        
        return assetMap[gameType] || {
            background: "/assets/common/default-bg.png",
            character: "/assets/common/duda/dudaClap.png"
        };
    }
    
    // Exemplo de uso do template
    static getClickButtonLevelComplete(): LevelCompletedScene {
        return this.createLevelCompleteScene({
            gameType: "clickButton",
            nextLevelScene: "clickButtonGameScene", 
            menuScene: "clickButtonStartScene",
            customTitle: "BOTÃO CORRETO! PRÓXIMO DESAFIO!"
        });
    }
}

// ============================================================================
// FUNCIONALIDADES VISUAIS
// ============================================================================

/**
 * A LevelCompletedScene inclui:
 * 
 * 🎨 Elementos Visuais:
 * - Background personalizado com overlay escuro
 * - 7 estrelas animadas piscando e rotacionando
 * - 8 símbolos (⭐🎉) flutuantes com animações
 * - Título personalizado com destaque dourado
 * - Personagem (Duda) saltitante no centro
 * 
 * 🎵 Efeitos Sonoros:
 * - Som de celebração ao entrar na cena
 * 
 * 🎯 Interações:
 * - Botão "PRÓXIMO NÍVEL" (verde) - vai para nextLevelScene
 * - Botão "VOLTAR AO MENU" (laranja) - vai para menuScene
 * - Hover effects em ambos os botões
 * - Suporte para redirecionamento web e cenas Phaser
 */

// ============================================================================
// RESUMO DA FUNCIONALIDADE
// ============================================================================

/**
 * ✅ O que foi parametrizado:
 * 1. nextLevelScene - Destino do botão "PRÓXIMO NÍVEL" 
 * 2. menuScene - Destino do botão "VOLTAR AO MENU"
 * 3. backgroundPath/backgroundKey - Background personalizado
 * 4. dudaImagePath/dudaImageKey - Personagem personalizado
 * 5. levelTitle - Título personalizado da conquista
 * 
 * ✅ Benefícios:
 * - Cena reutilizável para qualquer jogo
 * - Cada jogo mantém sua identidade visual
 * - Navegação flexível (cenas ou URLs)
 * - Feedback positivo consistente
 * 
 * ✅ Como usar:
 * - LevelCompletedScene.create() para padrões
 * - LevelCompletedScene.create(nextLevel, menu, ...) para personalizar
 * - Integra perfeitamente com StartScene e EndScene
 */