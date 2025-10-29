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
    private nextButton: Phaser.GameObjects.Container | null = null;
    private dudaImage: Phaser.GameObjects.Image | null = null;
    
    private draggedProfession: Phaser.GameObjects.Image | null = null;
    private workplaceZones: Phaser.GameObjects.Zone[] = [];

    private professionWorkplaceMap: { [key: string]: string } = {
        'medico': 'hospital',
        'professor': 'escola',
        'bombeiro': 'quartel',
        'cozinheira': 'cozinha',
        'policial': 'delegacia'
    };

    constructor() {
        super({ key: 'GameScene' });
    }

    init(data?: { currentLevel?: number; score?: number }) {
        this.currentLevel = data?.currentLevel || this.registry.get('professionsCurrentLevel') || 0;
        this.score = data?.score || this.registry.get('professionsScore') || 0;
    }

    preload() {
        this.load.image('professionsBackground', '/assets/professions/bg.svg');
        this.load.image('background', '/assets/professions/bg.svg');
        this.load.image('duda-thinking', '/assets/common/duda/duda-pensando.png');
        this.load.image('professionsDuda', '/assets/common/duda/girlmainpage.svg');
        this.load.image('professionsTrophy', '/assets/common/trophy.png');

        this.load.image('medico', '/assets/professions/medica.svg');
        this.load.image('professor', '/assets/professions/professor.svg');
        this.load.image('bombeiro', '/assets/professions/bombeiro.svg');
        this.load.image('cozinheira', '/assets/professions/cozinheira.svg');
        this.load.image('policial', '/assets/professions/policial.svg');

        this.load.image('hospital', '/assets/professions/hospital.svg');
        this.load.image('escola', '/assets/professions/escola.svg');
        this.load.image('quartel', '/assets/professions/quartel.svg');
        this.load.image('delegacia', '/assets/professions/delegacia.svg');
        this.load.image('cozinha', '/assets/professions/cozinha.svg');

        this.load.audio('correct-sound', '/assets/common/sounds/correct.mp3');
        this.load.audio('wrong-sound', '/assets/common/sounds/incorrect.mp3');
        this.load.audio('intro-sound', '/assets/professions/sounds/intro.mp3');
        this.load.audio('fim-sound', '/assets/professions/sounds/fim.mp3');

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
        
        this.input.dragDistanceThreshold = 16;
        
        this.input.on('drop', (_pointer: Phaser.Input.Pointer, _gameObject: Phaser.GameObjects.GameObject, dropZone: Phaser.GameObjects.Zone) => {
            if (dropZone && dropZone.getData) {
                const workplace = dropZone.getData('workplace');
                const container = dropZone.getData('container');
                if (workplace && this.draggedProfession) {
                    const dragIndex = this.currentLevel - ProfessionsGameData.introLevels.length - ProfessionsGameData.questionLevels.length;
                    const dragLevel = ProfessionsGameData.getDragLevel(dragIndex);
                    if (dragLevel) {
                        this.handleDrop(workplace, dragLevel.workplace, container);
                    }
                }
            }
        });
        
        this.registerStandardScenes();
        this.setupBackground();
        this.setupUI();
        this.startLevel();
    }

    private registerStandardScenes(): void {
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

        if (!this.scene.manager.getScene("LevelCompleteScene")) {
            const professionsLevelComplete = new LevelCompletedScene({
                nextLevelScene: "GameScene",
                menuScene: "StartScene",
                backgroundPath: "/assets/professions/bg.svg",
                backgroundKey: "professionsBackground",
            });
            this.scene.add("LevelCompleteScene", professionsLevelComplete);
        }

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
        this.questionText = this.add.text(this.scale.width / 2, 100, '', {
            fontSize: '42px',
            color: '#2D5AA0',
            fontFamily: 'Arial Black',
            align: 'center'
        }).setOrigin(0.5).setVisible(false);

        this.professionNameText = this.add.text(this.scale.width / 2, 200, '', {
            fontSize: '48px',
            color: '#FF6B35',
            fontFamily: 'Arial Black',
            align: 'center'
        }).setOrigin(0.5).setVisible(false);
    }

    private startLevel() {
        this.clearScreen();
        
        const totalIntroLevels = ProfessionsGameData.introLevels.length;
        const totalQuestionLevels = ProfessionsGameData.questionLevels.length;
        
        if (this.currentLevel < totalIntroLevels) {
            this.startIntroLevel(this.currentLevel);
        } else if (this.currentLevel < totalIntroLevels + totalQuestionLevels) {
            this.startQuestionLevel();
        } else {
            this.startDragLevel();
        }
    }

    private startIntroLevel(levelIndex: number) {
        const introLevel = ProfessionsGameData.getIntroLevel(levelIndex);
        if (!introLevel) return;

        if (!this.dudaImage) {
            this.dudaImage = this.add.image(140, 300, 'professionsDuda').setScale(0.4);
        }
        this.dudaImage.setVisible(true);

        this.createSpeechBubble(introLevel);
        
        if (introLevel.professionType !== 'duda' && introLevel.professionType !== 'fim') {
            const professionImage = this.add.image(380, 350, introLevel.professionType).setScale(0.35);
            this.optionContainers.push(this.add.container(0, 0, [professionImage]));
            
            const workplace = this.professionWorkplaceMap[introLevel.professionType];
            if (workplace) {
                const workplaceImage = this.add.image(620, 350, workplace).setScale(0.45);
                this.optionContainers.push(this.add.container(0, 0, [workplaceImage]));
            }
        }

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

        this.createNextButton();
    }

    private createSpeechBubble(introLevel: ProfessionIntroLevel) {
        const bubbleWidth = 450;
        const bubbleHeight = 150;
        const speechBubbleContainer = this.add.container(450, 130);
        
        const speechBubble = this.add.graphics();
        speechBubble.fillStyle(0xFFFFFF, 1);
        speechBubble.lineStyle(4, 0x2D5AA0);
        speechBubble.fillRoundedRect(-bubbleWidth/2, -bubbleHeight/2, bubbleWidth, bubbleHeight, 20);
        speechBubble.strokeRoundedRect(-bubbleWidth/2, -bubbleHeight/2, bubbleWidth, bubbleHeight, 20);
        
        const tailPoints = [
            -bubbleWidth/2 + 40, bubbleHeight/2,
            -bubbleWidth/2 + 20, bubbleHeight/2 + 30,
            -bubbleWidth/2 + 60, bubbleHeight/2
        ];
        
        speechBubble.fillTriangle(tailPoints[0], tailPoints[1], tailPoints[2], tailPoints[3], tailPoints[4], tailPoints[5]);
        speechBubble.strokeTriangle(tailPoints[0], tailPoints[1], tailPoints[2], tailPoints[3], tailPoints[4], tailPoints[5]);
        speechBubbleContainer.add(speechBubble);
        
        const bubbleText = this.add.text(0, -10, introLevel.description, {
            fontSize: '30px',
            color: '#2D5AA0',
            fontFamily: 'Arial Black',
            align: 'center',
            wordWrap: { width: bubbleWidth - 60 }
        }).setOrigin(0.5);
        
        speechBubbleContainer.add(bubbleText);
        this.optionContainers.push(speechBubbleContainer);
        
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
        this.professionsGameService.startQuestion();
        
        const questionIndex = this.currentLevel - ProfessionsGameData.introLevels.length;
        const question = ProfessionsGameData.getQuestionLevel(questionIndex);
        if (!question) return;
        
        this.questionText.setText('Clique na profissão:').setVisible(true);
        this.professionNameText.setText(question.professionName).setVisible(true);
        
        const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
        this.createOptionContainers();
        
        shuffledOptions.forEach((profession, index) => {
            const container = this.optionContainers[index];
            const professionImage = this.add.image(0, 0, profession);
            professionImage.setDisplaySize(280, 220);
            container.add(professionImage);
            container.setData('profession', profession);
            
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
        this.professionsGameService.startQuestion();
        
        const dragIndex = this.currentLevel - ProfessionsGameData.introLevels.length - ProfessionsGameData.questionLevels.length;
        const dragLevel = ProfessionsGameData.getDragLevel(dragIndex);
        if (!dragLevel) return;
        
        this.questionText.setText('Arraste a profissão\n para o local de trabalho:').setVisible(true);
        this.professionNameText.setText(dragLevel.professionName).setVisible(true);
        
        this.createWorkplaceZones(dragLevel);
        
        const professionImage = this.add.image(120, 450, dragLevel.profession);
        professionImage.setDisplaySize(250, 185);
        professionImage.setInteractive({ draggable: true });
        
        this.optionContainers.push(this.add.container(0, 0, [professionImage]));
        this.setupDragAndDrop(professionImage, dragLevel);
    }

    private setupDragAndDrop(professionImage: Phaser.GameObjects.Image, _dragLevel: ProfessionDragLevel) {
        this.input.setDraggable(professionImage);
        
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
        });
    }

    private createWorkplaceZones(dragLevel: ProfessionDragLevel) {
        const shuffledWorkplaces = [...dragLevel.workplaceOptions].sort(() => Math.random() - 0.5);
        const containerColors = [0x8b00ff, 0x0066ff, 0x00cc66];
        const { width } = this.cameras.main;
        const startX = width / 2 - 120;
        const containerWidth = 150;
        const containerHeight = 150;
        const spacing = 180;
        
        const workplaceNames: { [key: string]: string } = {
            'hospital': 'HOSPITAL',
            'escola': 'ESCOLA',
            'quartel': 'QUARTEL',
            'delegacia': 'DELEGACIA',
            'cozinha': 'COZINHA'
        };
        
        shuffledWorkplaces.forEach((workplace, index) => {
            const x = startX + index * spacing;
            const y = 450;
            
            const workplaceName = workplaceNames[workplace] || workplace.toUpperCase();
            const legendText = this.add.text(x, y - 100, workplaceName, {
                fontSize: '24px',
                color: '#FF6B35',
                fontFamily: 'Arial Black',
                align: 'center'
            }).setOrigin(0.5);
            
            this.optionContainers.push(this.add.container(0, 0, [legendText]));
            
            const workplaceContainer = this.add.container(x, y);
            
            const rect = this.add.rectangle(0, 0, containerWidth, containerHeight, containerColors[index]);
            rect.setStrokeStyle(4, 0xffffff);
            workplaceContainer.add(rect);
            
            const workplaceImage = this.add.image(0, 0, workplace);
            workplaceImage.setDisplaySize(240, 240);
            workplaceContainer.add(workplaceImage);
            
            const dropZone = this.add.zone(x, y, containerWidth + 20, containerHeight + 20);
            dropZone.setRectangleDropZone(containerWidth + 20, containerHeight + 20);
            dropZone.setData('workplace', workplace);
            dropZone.setData('container', workplaceContainer);
            
            const dropZoneGraphics = this.add.graphics();
            dropZoneGraphics.lineStyle(6, 0xFFD700, 0.8);
            dropZoneGraphics.strokeRect(x - (containerWidth + 20)/2, y - (containerHeight + 20)/2, containerWidth + 20, containerHeight + 20);
            dropZoneGraphics.setVisible(false);
            
            dropZone.on('dragenter', () => {
                dropZoneGraphics.setVisible(true);
                this.tweens.add({
                    targets: workplaceContainer,
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 200,
                    ease: 'Power2.easeOut'
                });
            });
            
            dropZone.on('dragleave', () => {
                dropZoneGraphics.setVisible(false);
                this.tweens.add({
                    targets: workplaceContainer,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 200,
                    ease: 'Power2.easeOut'
                });
            });
            
            dropZone.on('drop', () => {
                dropZoneGraphics.setVisible(false);
                this.tweens.add({
                    targets: workplaceContainer,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 200,
                    ease: 'Power2.easeOut'
                });
                
                if (this.draggedProfession) {
                    this.handleDrop(workplace, dragLevel.workplace, workplaceContainer);
                }
            });
            
            this.workplaceZones.push(dropZone);
        });
    }

    private async handleDrop(selectedWorkplace: string, correctWorkplace: string, workplaceContainer?: Phaser.GameObjects.Container) {
        const isCorrect = selectedWorkplace === correctWorkplace;
        this.professionsGameService.incrementAttempts();
        
        try {
            const studentId = this.professionsGameService.getStudentId();
            const dragIndex = this.currentLevel - ProfessionsGameData.introLevels.length - ProfessionsGameData.questionLevels.length;
            const questionId = dragIndex + 6;
            
            if (isCorrect) {
                await this.professionsGameService.registerCorrectAnswer(studentId, questionId, selectedWorkplace);
            } else {
                await this.professionsGameService.registerIncorrectAnswer(studentId, questionId, selectedWorkplace);
            }
        } catch (error) {
            console.error('Erro ao registrar interação:', error);
        }
        
        if (isCorrect) {
            this.handleCorrectDrop(workplaceContainer);
        } else {
            this.handleWrongDrop(workplaceContainer);
        }
    }

    private handleCorrectDrop(workplaceContainer?: Phaser.GameObjects.Container) {
        this.score += 100;
        this.draggedProfession = null;
        
        if (workplaceContainer) {
            this.effectManager.growup(workplaceContainer, "Cubic.out", 1.3, 800);
        }
        
        this.sound.play('correct-sound');
        this.workplaceZones.forEach(zone => zone.disableInteractive());
        
        this.time.delayedCall(2000, () => {
            this.goToNextLevel();
        });
    }

    private handleWrongDrop(workplaceContainer?: Phaser.GameObjects.Container) {
        if (workplaceContainer) {
            this.animationsManager.incorrectAnswerEffect(workplaceContainer);
        }
        
        this.sound.play('wrong-sound');
        
        if (this.draggedProfession) {
            this.tweens.add({
                targets: this.draggedProfession,
                x: 120,
                y: 450,
                duration: 500,
                ease: 'Power2.easeOut',
                onComplete: () => {
                    this.draggedProfession = null;
                }
            });
        }
    }

    private async selectProfession(selectedProfession: string, correctProfession: string, selectedContainer: Phaser.GameObjects.Container) {
        const isCorrect = selectedProfession === correctProfession;
        this.professionsGameService.incrementAttempts();
        
        try {
            const studentId = this.professionsGameService.getStudentId();
            const questionIndex = this.currentLevel - ProfessionsGameData.introLevels.length;
            const questionId = questionIndex + 1;
                        
            if (isCorrect) {
                await this.professionsGameService.registerCorrectAnswer(studentId, questionId, selectedProfession);
            } else {
                await this.professionsGameService.registerIncorrectAnswer(studentId, questionId, selectedProfession);
            }
        } catch (error) {
            console.error('Erro ao registrar interação:', error);
        }
        
        this.optionContainers.forEach(container => container.disableInteractive());
        
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
        const isEndOfIntroLevels = this.currentLevel + 1 === totalIntroLevels;
        const isEndOfQuestionLevels = this.currentLevel + 1 === totalIntroLevels + totalQuestionLevels;
        
        if (isLastLevel) {
            this.registry.remove('professionsCurrentLevel');
            this.registry.remove('professionsScore');
            this.scene.start('EndScene');
        } else if (isEndOfIntroLevels || isEndOfQuestionLevels) {
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
            this.registry.set('professionsCurrentLevel', this.currentLevel + 1);
            this.registry.set('professionsScore', this.score);
            
            this.currentLevel++;
            this.startLevel();
        }
    }

    private createNextButton() {
        if (this.nextButton) {
            this.nextButton.removeAllListeners();
            this.nextButton.destroy();
            this.nextButton = null;
        }

        const { width, height } = this.cameras.main;
        const buttonX = width / 2;
        const buttonY = height - 55;

        this.nextButton = this.add.container(buttonX, buttonY);

        const buttonBg = this.add.graphics();
        buttonBg.fillStyle(0x28a745);
        buttonBg.fillRoundedRect(-80, -25, 160, 50, 25);
        buttonBg.lineStyle(3, 0xffffff);
        buttonBg.strokeRoundedRect(-80, -25, 160, 50, 25);

        const buttonText = this.add.text(0, 0, "PRÓXIMO", {
            fontSize: "24px",
            color: "#FFFFFF",
            fontFamily: "Arial Black",
        }).setOrigin(0.5);

        this.nextButton.add([buttonBg, buttonText]);
        this.nextButton.setSize(160, 50);
        this.nextButton.setInteractive({ useHandCursor: true });

        this.nextButton.on("pointerover", () => {
            this.tweens.add({
                targets: this.nextButton,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
            });
        });

        this.nextButton.on("pointerout", () => {
            this.tweens.add({
                targets: this.nextButton,
                scaleX: 1,
                scaleY: 1,
                duration: 200,
            });
        });

        this.nextButton.on("pointerdown", () => {
            this.goToNextLevel();
        });

        this.nextButton.setAlpha(0);
        this.tweens.add({
            targets: this.nextButton,
            alpha: 1,
            duration: 500,
            delay: 9000,
        });
    }

    private createOptionContainers() {
        const { width, height } = this.cameras.main;
        const containerColors = [0x8b00ff, 0x0066ff, 0x00cc66];
        const startX = width / 2 - 250;
        const containerWidth = 200;
        const containerHeight = 200;
        const spacing = 250;

        for (let i = 0; i < 3; i++) {
            const x = startX + i * spacing;
            const y = height / 2 + 100;
            const container = this.add.container(x, y);

            const rect = this.add.rectangle(0, 0, containerWidth, containerHeight, containerColors[i]);
            rect.setStrokeStyle(4, 0xffffff);
            container.add(rect);
            container.setSize(containerWidth, containerHeight);

            const hitArea = new Phaser.Geom.Rectangle(-containerWidth / 12, -containerHeight / 12, containerWidth, containerHeight);
            container.setInteractive({
                hitArea,
                hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                useHandCursor: true,
            });
            container.setData("hitArea", hitArea);

            this.optionContainers.push(container);
        }
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
        this.optionContainers.forEach(container => {
            if (container && container.scene) {
                container.destroy();
            }
        });
        this.optionContainers = [];
        
        this.workplaceZones.forEach(zone => {
            if (zone && zone.scene) {
                zone.destroy();
            }
        });
        this.workplaceZones = [];
        
        this.questionText.setVisible(false);
        this.professionNameText.setVisible(false);
        
        const totalIntroLevels = ProfessionsGameData.introLevels.length;
        if (this.dudaImage && this.currentLevel >= totalIntroLevels) {
            this.dudaImage.setVisible(false);
        }
        
        if (this.nextButton && this.currentLevel >= totalIntroLevels) {
            this.nextButton.removeAllListeners();
            this.nextButton.destroy();
            this.nextButton = null;
        }
        
        this.draggedProfession = null;
    }
}
