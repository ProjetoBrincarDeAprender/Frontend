import Phaser from 'phaser';
import { AnimationManager } from '@/games/sum/components/animations/AnimationManager';
import EffectManager from '@/games/common/managers/EffectManager';
import { LevelCompletedScene } from '@/games/common/scenes/LevelCompletedScene';
import { EndScene } from '@/games/common/scenes/EndScene';
import { StartScene } from '@/games/common/scenes/StartScene';
import { ProfessionsGameService } from './services/ProfessionsGameService';
import { ProfessionsGameData } from './data/ProfessionsGameData';
import type { ProfessionIntroLevel, ProfessionDragLevel } from './data/ProfessionsGameData';

export class GameScene extends Phaser.Scene {
    private animationsManager!: AnimationManager;
    private effectManager!: EffectManager;
    private professionsGameService!: ProfessionsGameService;
    private currentLevel: number = 0;
    private score: number = 0;
    
    private questionText!: Phaser.GameObjects.Text;
    private professionNameText!: Phaser.GameObjects.Text;
    private optionContainers: Phaser.GameObjects.Container[] = [];
    
    // Para sistema de drag and drop
    private draggedProfession: Phaser.GameObjects.Image | null = null;
    private workplaceZones: Phaser.GameObjects.Zone[] = [];

    constructor() {
        super({ key: 'GameScene' });
    }

    init(data?: { currentLevel?: number; score?: number }) {
        // Recuperar dados do registry ou usar dados passados ou padrões
        this.currentLevel = data?.currentLevel || this.registry.get('professionsCurrentLevel') || 0;
        this.score = data?.score || this.registry.get('professionsScore') || 0;
    }

    preload() {
        // Backgrounds e UI
        this.load.image('professionsBackground', '/assets/professions/bg.svg');
        this.load.image('background', '/assets/professions/bg.svg');
        this.load.image('duda-thinking', '/assets/professions/duda-pensando.png');
        this.load.image('professionsDuda', '/assets/professions/duda-pensando.png');
        this.load.image('professionsTrophy', '/assets/professions/trophy-professions.png');

        // Imagens das profissões
        this.load.image('medico', '/assets/professions/medica.svg');
        this.load.image('professor', '/assets/professions/professor.svg');
        this.load.image('bombeiro', '/assets/professions/bombeiro.svg');
        this.load.image('cozinheira', '/assets/professions/cozinheira.svg');
        this.load.image('policial', '/assets/professions/policial.svg');

        // Imagens dos locais de trabalho
        this.load.image('hospital', '/assets/professions/workplaces/hospital.svg');
        this.load.image('escola', '/assets/professions/workplaces/escola.svg');
        this.load.image('quartel', '/assets/professions/workplaces/quartel.svg');
        this.load.image('delegacia', '/assets/professions/workplaces/delegacia.svg');

        // Sons
        this.load.audio('correct-sound', '/assets/common/sounds/correct.mp3');
        this.load.audio('wrong-sound', '/assets/common/sounds/incorrect.mp3');
        this.load.audio('intro-sound', '/assets/professions/sounds/intro.mp3');
        this.load.audio('fim-sound', '/assets/professions/sounds/fim.mp3');

        // Sons das profissões (Duda explicando)
        this.load.audio('medico-sound', '/assets/professions/sounds/medica.mp3');
        this.load.audio('professor-sound', '/assets/professions/sounds/professor.mp3');
        this.load.audio('bombeiro-sound', '/assets/professions/sounds/bombeiro.mp3');
        this.load.audio('cozinheira-sound', '/assets/professions/sounds/cozinheira.mp3');
        this.load.audio('policial-sound', '/assets/professions/sounds/policial.mp3');
    }

    create() {
        this.animationsManager = new AnimationManager(this);
        this.effectManager = new EffectManager(this);
        this.professionsGameService = new ProfessionsGameService();
        
        this.registerStandardScenes();
        this.setupBackground();
        this.setupUI();
        this.startLevel();
    }

    private registerStandardScenes(): void {
        // StartScene para profissões
        if (!this.scene.manager.getScene("StartScene")) {
            const professionsStartScene = new StartScene({
                backgroundPath: "/assets/professionsGame/bg.svg",
                backgroundKey: "professionsBackground",
                trophyImagePath: "/assets/professions/trophy-professions.png",
                trophyImageKey: "professionsTrophy",
                gameTitle: "JOGO DAS PROFISSÕES",
                nextSceneName: "GameScene"
            });
            this.scene.add("StartScene", professionsStartScene);
        }

        // LevelCompletedScene para profissões
        if (!this.scene.manager.getScene("LevelCompleteScene")) {
            const professionsLevelComplete = new LevelCompletedScene({
                nextLevelScene: "GameScene",
                menuScene: "StartScene",
                backgroundPath: "/assets/professions/bg.svg",
                backgroundKey: "professionsBackground",
            });
            this.scene.add("LevelCompleteScene", professionsLevelComplete);
        }

        // EndScene para profissões
        if (!this.scene.manager.getScene("EndScene")) {
            const professionsEndScene = new EndScene({
                restartScene: "StartScene",
                backgroundPath: "/assets/professions/bg.svg",
                backgroundKey: "professionsBackground",
                subtitleMessage: "VOCÊ APRENDEU SOBRE \nAS PROFISSÕES!"
            });
            this.scene.add("EndScene", professionsEndScene);
        }
    }

    private setupBackground() {
        this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            this.scale.width,
            this.scale.height,
            0xAAC2FF
            );
            }

    private setupUI() {
        // Texto da pergunta (visível apenas nos níveis de pergunta e drag)
        this.questionText = this.add.text(this.scale.width / 2, 80, '', {
            fontSize: '32px',
            color: '#2D5AA0',
            fontFamily: 'Arial Black',
            align: 'center'
        }).setOrigin(0.5).setVisible(false);

        // Nome da profissão (visível nos níveis de pergunta e drag)
        this.professionNameText = this.add.text(this.scale.width / 2, 120, '', {
            fontSize: '36px',
            color: '#FF6B35',
            fontFamily: 'Arial Black',
            align: 'center'
        }).setOrigin(0.5).setVisible(false);
    }

    private startLevel() {
        // Limpar elementos da tela
        this.clearScreen();
        
        const totalIntroLevels = ProfessionsGameData.introLevels.length;
        const totalQuestionLevels = ProfessionsGameData.questionLevels.length;
        
        if (this.currentLevel < totalIntroLevels) {
            // Níveis introdutórios (0-6)
            this.startIntroLevel(this.currentLevel);
        } else if (this.currentLevel < totalIntroLevels + totalQuestionLevels) {
            // Níveis de pergunta (7-11)
            this.startQuestionLevel();
        } else {
            // Níveis de drag and drop (12-16)
            this.startDragLevel();
        }
    }

    private startIntroLevel(levelIndex: number) {
        const introLevel = ProfessionsGameData.getIntroLevel(levelIndex);
        if (!introLevel) return;

        // Criar balão de fala
        this.createSpeechBubble(introLevel);
        
        // Mostrar imagem apropriada
        if (introLevel.professionType === 'duda') {
            // Mostrar Duda nos níveis de introdução e conclusão
            const dudaImage = this.add.image(500, 380, 'professionsDuda').setScale(0.7);
            this.optionContainers.push(this.add.container(0, 0, [dudaImage]));
        } else {
            // Mostrar imagem da profissão nos níveis específicos
            const professionImage = this.add.image(500, 380, introLevel.professionType).setScale(0.7);
            this.optionContainers.push(this.add.container(0, 0, [professionImage]));
        }

        // Tocar som da explicação
        if (introLevel.soundFile) {
            let soundKey: string;
            if (introLevel.professionType === 'duda' && introLevel.professionName === 'Introdução') {
                soundKey = 'intro-sound';
            } else if (introLevel.professionType === 'fim' && introLevel.professionName === 'Parabéns!') {
                soundKey = 'fim-sound';
            } else {
                soundKey = introLevel.professionType + '-sound';
            }
            this.sound.play(soundKey, { volume: 0.7 });
        }

        // Criar botão "Próximo"
        this.createNextButton();
    }

    private createSpeechBubble(introLevel: ProfessionIntroLevel) {
        const bubbleWidth = 450;
        const bubbleHeight = 150;
        
        const speechBubbleContainer = this.add.container(300, 220);
        
        // Fundo do balão
        const speechBubble = this.add.graphics();
        speechBubble.fillStyle(0xFFFFFF, 1);
        speechBubble.lineStyle(4, 0x2D5AA0);
        speechBubble.fillRoundedRect(-bubbleWidth/2, -bubbleHeight/2, bubbleWidth, bubbleHeight, 20);
        speechBubble.strokeRoundedRect(-bubbleWidth/2, -bubbleHeight/2, bubbleWidth, bubbleHeight, 20);
        
        // Rabo do balão (triângulo)
        const tailPoints = [
            -bubbleWidth/2 + 40, bubbleHeight/2,
            -bubbleWidth/2 + 20, bubbleHeight/2 + 30,
            -bubbleWidth/2 + 60, bubbleHeight/2
        ];
        
        speechBubble.fillTriangle(tailPoints[0], tailPoints[1], tailPoints[2], tailPoints[3], tailPoints[4], tailPoints[5]);
        speechBubble.strokeTriangle(tailPoints[0], tailPoints[1], tailPoints[2], tailPoints[3], tailPoints[4], tailPoints[5]);
        
        speechBubbleContainer.add(speechBubble);
        
        // Texto do balão
        const bubbleText = this.add.text(0, -10, introLevel.description, {
            fontSize: '30px',
            color: '#2D5AA0',
            fontFamily: 'Arial Black',
            align: 'center',
            wordWrap: { width: bubbleWidth - 60 }
        }).setOrigin(0.5);
        
        speechBubbleContainer.add(bubbleText);
        this.optionContainers.push(speechBubbleContainer);
        
        // Animação de entrada
        speechBubbleContainer.setAlpha(0).setScale(0.5);
        this.tweens.add({
            targets: speechBubbleContainer,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 600,
            ease: 'Back.easeOut',
            delay: 500
        });
    }

    private startQuestionLevel() {
        // Iniciar cronômetro para medir tempo de resposta
        this.professionsGameService.startQuestion();
        
        const questionIndex = this.currentLevel - ProfessionsGameData.introLevels.length;
        const question = ProfessionsGameData.getQuestionLevel(questionIndex);
        if (!question) return;
        
        // Mostrar UI de pergunta
        this.questionText.setText('Clique na profissão:').setVisible(true);
        this.professionNameText.setText(question.professionName).setVisible(true);
        
        const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
        
        this.createOptionContainers();
        
        shuffledOptions.forEach((profession, index) => {
            const container = this.optionContainers[index];
            
            const professionImage = this.add.image(0, 0, profession);
            professionImage.setDisplaySize(280, 210);
            container.add(professionImage);
            
            // Configurar interatividade
            container.setInteractive(
                new Phaser.Geom.Rectangle(-140, -105, 280, 210),
                Phaser.Geom.Rectangle.Contains
            );
            
            container.on('pointerover', () => {
                this.tweens.add({
                    targets: container,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 150,
                    ease: 'Power2.easeOut'
                });
            });
            
            container.on('pointerout', () => {
                this.tweens.add({
                    targets: container,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 150,
                    ease: 'Power2.easeOut'
                });
            });
            
            container.on('pointerdown', () => {
                this.selectProfession(profession, question.correctProfession, container);
            });
        });
        
        this.animateContainersEntry();
    }

    private startDragLevel() {
        // Iniciar cronômetro para medir tempo de resposta
        this.professionsGameService.startQuestion();
        
        const dragIndex = this.currentLevel - ProfessionsGameData.introLevels.length - ProfessionsGameData.questionLevels.length;
        const dragLevel = ProfessionsGameData.getDragLevel(dragIndex);
        if (!dragLevel) return;
        
        // Mostrar UI de drag
        this.questionText.setText('Arraste a profissão para o local de trabalho:').setVisible(true);
        this.professionNameText.setText(dragLevel.professionName).setVisible(true);
        
        // Criar imagem da profissão (arrastável)
        const professionImage = this.add.image(150, 300, dragLevel.profession);
        professionImage.setDisplaySize(200, 150);
        professionImage.setInteractive({ draggable: true });
        
        // Configurar drag and drop
        this.setupDragAndDrop(professionImage, dragLevel);
        
        // Criar zonas de trabalho
        this.createWorkplaceZones(dragLevel);
    }

    private setupDragAndDrop(professionImage: Phaser.GameObjects.Image, _dragLevel: ProfessionDragLevel) {
        professionImage.on('dragstart', () => {
            this.draggedProfession = professionImage;
            professionImage.setTint(0x888888);
        });
        
        professionImage.on('drag', (_pointer: Phaser.Input.Pointer, dragX: number, dragY: number) => {
            professionImage.x = dragX;
            professionImage.y = dragY;
        });
        
        professionImage.on('dragend', () => {
            professionImage.clearTint();
            this.draggedProfession = null;
        });
    }

    private createWorkplaceZones(dragLevel: ProfessionDragLevel) {
        const shuffledWorkplaces = [...dragLevel.workplaceOptions].sort(() => Math.random() - 0.5);
        
        shuffledWorkplaces.forEach((workplace, index) => {
            const x = 450 + (index * 120);
            const y = 350;
            
            // Imagem do local de trabalho
            const workplaceImage = this.add.image(x, y, workplace);
            workplaceImage.setDisplaySize(100, 100);
            
            // Zona de drop
            const dropZone = this.add.zone(x, y, 120, 120);
            dropZone.setRectangleDropZone(120, 120);
            dropZone.setData('workplace', workplace);
            
            // Visual da zona de drop
            const dropZoneGraphics = this.add.graphics();
            dropZoneGraphics.lineStyle(3, 0x00ff00, 0.5);
            dropZoneGraphics.strokeRect(x - 60, y - 60, 120, 120);
            dropZoneGraphics.setVisible(false);
            
            // Eventos da zona de drop
            dropZone.on('dragenter', () => {
                dropZoneGraphics.setVisible(true);
            });
            
            dropZone.on('dragleave', () => {
                dropZoneGraphics.setVisible(false);
            });
            
            dropZone.on('drop', () => {
                dropZoneGraphics.setVisible(false);
                if (this.draggedProfession) {
                    this.handleDrop(workplace, dragLevel.workplace);
                }
            });
            
            this.workplaceZones.push(dropZone);
        });
    }

    private async handleDrop(selectedWorkplace: string, correctWorkplace: string) {
        const isCorrect = selectedWorkplace === correctWorkplace;
        
        // Incrementar tentativas
        this.professionsGameService.incrementAttempts();
        
        // Registrar interação para níveis de drag
        try {
            const studentId = this.professionsGameService.getStudentId();
            const dragIndex = this.currentLevel - ProfessionsGameData.introLevels.length - ProfessionsGameData.questionLevels.length;
            const questionId = dragIndex + 6; // IDs 6-10 para níveis de drag
            
            console.log(`🎮 Registrando drag - Pergunta ${questionId}: ${selectedWorkplace} (${isCorrect ? 'CORRETA' : 'INCORRETA'})`);
            
            if (isCorrect) {
                await this.professionsGameService.registerCorrectAnswer(studentId, questionId, selectedWorkplace);
            } else {
                await this.professionsGameService.registerIncorrectAnswer(studentId, questionId, selectedWorkplace);
            }
        } catch (error) {
            console.error('Erro ao registrar interação:', error);
        }
        
        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer();
        }
    }

    private async selectProfession(selectedProfession: string, correctProfession: string, selectedContainer: Phaser.GameObjects.Container) {
        const isCorrect = selectedProfession === correctProfession;
        
        // Incrementar tentativas
        this.professionsGameService.incrementAttempts();
        
        // Registrar interação para níveis de pergunta
        try {
            const studentId = this.professionsGameService.getStudentId();
            const questionIndex = this.currentLevel - ProfessionsGameData.introLevels.length;
            const questionId = questionIndex + 1; // IDs 1-5 para níveis de pergunta
            
            console.log(`🎮 Registrando resposta - Pergunta ${questionId}: ${selectedProfession} (${isCorrect ? 'CORRETA' : 'INCORRETA'})`);
            
            if (isCorrect) {
                await this.professionsGameService.registerCorrectAnswer(studentId, questionId, selectedProfession);
            } else {
                await this.professionsGameService.registerIncorrectAnswer(studentId, questionId, selectedProfession);
            }
        } catch (error) {
            console.error('Erro ao registrar interação:', error);
        }
        
        this.optionContainers.forEach(container => {
            container.disableInteractive();
        });
        
        if (isCorrect) {
            this.handleCorrectAnswer(selectedContainer);
        } else {
            this.handleWrongAnswer(selectedContainer);
        }
    }

    private handleCorrectAnswer(container?: Phaser.GameObjects.Container) {
        this.score += 100;
        
        if (container) {
            this.effectManager.growup(container, "Cubic.out", 1.2, 500);
        }
        
        this.sound.play('correct-sound');
        
        this.time.delayedCall(2000, () => {
            this.goToNextLevel();
        });
    }

    private handleWrongAnswer(container?: Phaser.GameObjects.Container) {
        if (container) {
            this.animationsManager.incorrectAnswerEffect(container);
        }
        
        this.sound.play('wrong-sound');
        
        this.time.delayedCall(1000, () => {
            // Reativar opções para nova tentativa
            this.optionContainers.forEach(c => {
                if (c && c.scene) {
                    c.setInteractive();
                }
            });
        });
    }

    private goToNextLevel() {
        const totalIntroLevels = ProfessionsGameData.introLevels.length;
        const totalQuestionLevels = ProfessionsGameData.questionLevels.length;
        const totalLevels = ProfessionsGameData.getTotalLevels();
        const isLastLevel = this.currentLevel + 1 >= totalLevels;
        
        // Verificar se é o fim de uma seção específica
        const isEndOfIntroLevels = this.currentLevel + 1 === totalIntroLevels;
        const isEndOfQuestionLevels = this.currentLevel + 1 === totalIntroLevels + totalQuestionLevels;
        
        if (isLastLevel) {
            // Limpar registry e ir para EndScene
            this.registry.remove('professionsCurrentLevel');
            this.registry.remove('professionsScore');
            this.scene.start('EndScene');
        } else if (isEndOfIntroLevels || isEndOfQuestionLevels) {
            // Mostrar LevelCompleteScene no fim dos níveis introdutórios e de pergunta
            this.registry.set('professionsCurrentLevel', this.currentLevel + 1);
            this.registry.set('professionsScore', this.score);
            
            let completionMessage = '';
            if (isEndOfIntroLevels) {
                completionMessage = 'Você aprendeu sobre\ntodas as profissões!';
            } else if (isEndOfQuestionLevels) {
                completionMessage = 'Ótimo! Agora vamos\npraticar mais!';
            }
            
            this.scene.start('LevelCompleteScene', {
                currentLevel: this.currentLevel + 1,
                score: this.score,
                completionMessage: completionMessage
            });
        } else {
            // Salvar progresso e ir para próximo nível
            this.registry.set('professionsCurrentLevel', this.currentLevel + 1);
            this.registry.set('professionsScore', this.score);
            
            this.currentLevel++;
            this.startLevel();
        }
    }

    private createNextButton() {
        const nextContainer = this.add.container(this.scale.width / 2, 520);
        
        // Sombra do botão
        const shadow = this.add.graphics();
        shadow.fillStyle(0x000000, 0.3);
        shadow.fillRoundedRect(-122, -38, 244, 84, 20);
        
        // Botão principal
        const buttonGraphics = this.add.graphics();
        buttonGraphics.fillStyle(0x16a34a);
        buttonGraphics.fillRoundedRect(-120, -40, 240, 80, 20);
        
        // Texto do botão
        const nextText = this.add.text(0, 0, "PRÓXIMO", {
            fontFamily: "Arial Black",
            fontSize: "20px",
            color: "#FFFFFF",
            fontStyle: "bold",
        }).setOrigin(0.5);
        
        nextContainer.add([shadow, buttonGraphics, nextText]);
        
        // Configurar interatividade
        nextContainer.setInteractive(
            new Phaser.Geom.Rectangle(-120, -40, 240, 80),
            Phaser.Geom.Rectangle.Contains
        );
        
        // Eventos
        nextContainer.on("pointerover", () => {
            buttonGraphics.clear();
            buttonGraphics.fillStyle(0x22c55e);
            buttonGraphics.fillRoundedRect(-120, -40, 240, 80, 20);
            
            this.tweens.add({
                targets: nextContainer,
                scale: 1.05,
                duration: 150,
                ease: "Power2.easeOut"
            });
        });
        
        nextContainer.on("pointerout", () => {
            buttonGraphics.clear();
            buttonGraphics.fillStyle(0x16a34a);
            buttonGraphics.fillRoundedRect(-120, -40, 240, 80, 20);
            
            this.tweens.add({
                targets: nextContainer,
                scale: 1,
                duration: 150,
                ease: "Power2.easeOut"
            });
        });
        
        nextContainer.on("pointerdown", () => {
            this.tweens.add({
                targets: nextContainer,
                scale: 0.95,
                duration: 100,
                yoyo: true,
                ease: "Power2.easeInOut",
                onComplete: () => {
                    this.goToNextLevel();
                }
            });
        });
        
        this.optionContainers.push(nextContainer);
    }

    private createOptionContainers() {
        const positions = [
            { x: 200, y: 350 },
            { x: 400, y: 350 },
            { x: 600, y: 350 }
        ];
        
        positions.forEach((pos) => {
            const container = this.add.container(pos.x, pos.y);
            this.optionContainers.push(container);
        });
    }

    private animateContainersEntry() {
        this.optionContainers.forEach((container, index) => {
            container.setAlpha(0);
            container.setScale(0.5);
            
            this.tweens.add({
                targets: container,
                alpha: 1,
                scaleX: 1,
                scaleY: 1,
                duration: 500,
                ease: 'Back.easeOut',
                delay: index * 200
            });
        });
    }

    private clearScreen() {
        // Limpar containers de opções
        this.optionContainers.forEach(container => {
            if (container && container.scene) {
                container.destroy();
            }
        });
        this.optionContainers = [];
        
        // Limpar zonas de workplace
        this.workplaceZones.forEach(zone => {
            if (zone && zone.scene) {
                zone.destroy();
            }
        });
        this.workplaceZones = [];
        
        // Esconder textos de UI
        this.questionText.setVisible(false);
        this.professionNameText.setVisible(false);
        
        // Resetar draggedProfession
        this.draggedProfession = null;
    }
}
