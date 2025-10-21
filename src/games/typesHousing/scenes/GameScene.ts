import Phaser from 'phaser';
import { AnimationManager } from '@/games/sum/components/animations/AnimationManager';
import EffectManager from '@/games/common/managers/EffectManager';

interface HousingQuestion {
    correctHousing: string;
    options: string[];
    housingName: string;
}

export class GameScene extends Phaser.Scene {
    private animationsManager!: AnimationManager;
    private effectManager!: EffectManager;
    private currentLevel: number = 0;
    private score: number = 0;
    private background!: Phaser.GameObjects.Image;
    private questionText!: Phaser.GameObjects.Text;
    private housingNameText!: Phaser.GameObjects.Text;
    private optionContainers: Phaser.GameObjects.Container[] = [];
    private dudaThinking!: Phaser.GameObjects.Image;
    
    private housingQuestions: HousingQuestion[] = [
        {
            correctHousing: 'casa',
            options: ['casa', 'castelo', 'oca'],
            housingName: 'Casa'
        },
        {
            correctHousing: 'castelo',
            options: ['casa', 'castelo', 'iglu'],
            housingName: 'Castelo'
        },
        {
            correctHousing: 'oca',
            options: ['oca', 'casa', 'predio'],
            housingName: 'Oca'
        },
        {
            correctHousing: 'iglu',
            options: ['casa', 'iglu', 'castelo'],
            housingName: 'Iglu'
        },
        {
            correctHousing: 'predio',
            options: ['predio', 'casa', 'oca'],
            housingName: 'Prédio'
        }
    ];

    constructor() {
        super({ key: 'GameScene' });
    }

    init(data?: { currentLevel?: number; score?: number }) {
        this.currentLevel = data?.currentLevel || 0;
        this.score = data?.score || 0;
    }

    preload() {
        // Assets carregados na StartScene
    }

    create() {
        this.animationsManager = new AnimationManager(this);
        this.effectManager = new EffectManager(this);
        
        this.setupBackground();
        this.setupUI();
        this.startLevel();
    }

    private setupBackground() {

        this.background = this.add.image(this.scale.width / 2, this.scale.height / 2, 'background');
        this.background.setScale(1.6);
         this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            this.scale.width,
            this.scale.height,
            0x000000,
            0.5
            );
        
        this.dudaThinking = this.add.image(190, 200, 'duda-thinking');
        this.dudaThinking.setScale(0.4);
    }

    private setupUI() {
        const { width } = this.cameras.main;
        
        this.questionText = this.add.text(width / 2, 100, '', {
            fontSize: '32px',
            color: '#2D5AA0',
            fontFamily: 'Arial',
            align: 'center',
            backgroundColor: '#FFFFFF'
        }).setOrigin(0.5);
        
        this.housingNameText = this.add.text(width / 2, 150, '', {
            fontSize: '48px',
            color: '#FF6B35',
            fontFamily: 'Arial Black',
            align: 'center',
            backgroundColor: '#FFFFFF'
        }).setOrigin(0.5);
        
    }

    private createOptionContainers() {
        const { width, height } = this.cameras.main;
        const containerColors = [0x8B00FF, 0x0066FF, 0x00CC66]; 
        const startX = width / 2 - 250;
        const containerWidth = 200;
        const containerHeight = 200;
        const spacing = 250;
        
        for (let i = 0; i < 3; i++) {
            const x = startX + (i * spacing);
            const y = height / 2 + 100;
            
            const container = this.add.container(x, y);
            
            const rect = this.add.rectangle(0, 0, containerWidth, containerHeight, containerColors[i]);
            rect.setStrokeStyle(4, 0xFFFFFF); 
            container.add(rect);
            container.setSize(containerWidth, containerHeight);
            
            const hitArea = new Phaser.Geom.Rectangle(-containerWidth / 12, -containerHeight / 10, containerWidth, containerHeight);
            container.setInteractive({
                hitArea,
                hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                useHandCursor: true
            });
            container.setData('hitArea', hitArea);
            
            this.optionContainers.push(container);
        }
    }

    private startLevel() {
        if (this.currentLevel >= this.housingQuestions.length) {
            return;
        }
        
        const question = this.housingQuestions[this.currentLevel];
        
        this.questionText.setText(`Qual moradia é?`);
        this.housingNameText.setText(question.housingName);
        
        const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
        
        this.optionContainers.forEach(container => {
            if (container && container.scene) {
                container.removeAllListeners();
                container.destroy();
            }
        });
        this.optionContainers = [];
        
        this.createOptionContainers();
        
        shuffledOptions.forEach((housing, index) => {
            const container = this.optionContainers[index];
            
            const housingImage = this.add.image(0, 0, housing);
            housingImage.setDisplaySize(280, 210);
            container.add(housingImage);
            
            container.removeAllListeners('pointerdown');
            container.removeAllListeners('pointerover');
            container.removeAllListeners('pointerout');
            
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
                this.selectOption(housing, question.correctHousing, container);
            });
        });
        
        this.animateContainersEntry();
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
                delay: index * 200,
                ease: 'Back.easeOut'
            });
        });
    }

    private selectOption(selectedHousing: string, correctHousing: string, selectedContainer: Phaser.GameObjects.Container) {
        const isCorrect = selectedHousing === correctHousing;
        
        this.optionContainers.forEach(container => {
            container.disableInteractive();
        });
        
        if (isCorrect) {
            this.handleCorrectAnswer(selectedContainer);
        } else {
            this.handleWrongAnswer(selectedContainer);
        }
    }

    private handleCorrectAnswer(container: Phaser.GameObjects.Container) {
        this.score += 100;
        
        this.effectManager.growup(container, "Cubic.out", 1.2, 500);
        
        this.sound.play('correct-sound');
        
        this.time.delayedCall(2000, () => {
            const isLastLevel = this.currentLevel + 1 >= this.housingQuestions.length;
            
            this.scene.start('LevelCompletedScene', {
                score: this.score,
                gameType: 'housing',
                currentLevel: this.currentLevel + 1,
                isLastLevel: isLastLevel
            });
        });
    }

    private handleWrongAnswer(container: Phaser.GameObjects.Container) {
        this.animationsManager.incorrectAnswerEffect(container);
        
        // Áudio
        this.sound.play('wrong-sound');
        
        this.time.delayedCall(1000, () => {
            this.optionContainers.forEach(c => {
                if (c && c.scene) {
                    const hitArea: Phaser.Geom.Rectangle | undefined = c.getData('hitArea');
                    if (hitArea) {
                        c.setInteractive({
                            hitArea,
                            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                            useHandCursor: true
                        });
                    } else {
                        c.setInteractive({
                            hitArea: new Phaser.Geom.Rectangle(-200, -120, 300, 240),
                            hitAreaCallback: Phaser.Geom.Rectangle.Contains,
                            useHandCursor: true
                        });
                    }
                }
            });
        });
    }
}