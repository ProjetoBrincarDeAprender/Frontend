// Exemplo de integração do Jogo das Profissões
// Este arquivo mostra como integrar o jogo no sistema principal

import { GameScene as ProfessionsGameScene } from '@/games/professions/GameScene';

// Exemplo 1: Registrar o jogo em uma cena principal
export class MainGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainGameScene' });
    }

    create() {
        // Registrar o jogo das profissões
        const professionsGame = new ProfessionsGameScene();
        this.scene.add('ProfessionsGame', professionsGame);

        // Criar botão para iniciar o jogo das profissões
        this.createProfessionsButton();
    }

    private createProfessionsButton() {
        this.add.rectangle(400, 300, 200, 80, 0x2D5EFF)
            .setInteractive()
            .on('pointerdown', () => {
                // Iniciar o jogo das profissões
                this.scene.start('ProfessionsGame');
            });

        this.add.text(400, 300, 'JOGO DAS\nPROFISSÕES', {
            fontSize: '20px',
            color: '#FFFFFF',
            align: 'center'
        }).setOrigin(0.5);
    }
}

// Exemplo 2: Configuração no main.ts ou app principal
export function setupProfessionsGame(game: Phaser.Game) {
    // Adicionar as cenas do jogo das profissões
    const professionsGame = new ProfessionsGameScene();
    game.scene.add('ProfessionsGame', professionsGame);
    
    console.log('🎮 Jogo das Profissões registrado com sucesso!');
}

// Exemplo 3: Iniciar diretamente
export function startProfessionsGame(scene: Phaser.Scene) {
    // Limpar registry anterior se necessário
    scene.registry.remove('professionsCurrentLevel');
    scene.registry.remove('professionsScore');
    
    // Iniciar o jogo
    scene.scene.start('ProfessionsGame');
}

// Exemplo 4: Verificar progresso
export function getProfessionsProgress(scene: Phaser.Scene) {
    const currentLevel = scene.registry.get('professionsCurrentLevel') || 0;
    const score = scene.registry.get('professionsScore') || 0;
    
    return {
        level: currentLevel,
        score: score,
        isCompleted: currentLevel >= 15 // 15 níveis totais
    };
}