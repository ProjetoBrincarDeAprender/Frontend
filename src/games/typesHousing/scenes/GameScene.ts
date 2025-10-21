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
        // Carregar assets do jogo
        this.load.image('background', '/assets/housingGame/bg.png');
        this.load.image('duda-thinking', '/assets/housingGame/duda-pensando.png');
        
        // Carregar imagens das moradias
        this.load.image('casa', '/assets/housingGame/casa.png');
        this.load.image('castelo', '/assets/housingGame/castelo.png');
        this.load.image('oca', '/assets/housingGame/oca.png');
        this.load.image('iglu', '/assets/housingGame/iglu.png');
        this.load.image('predio', '/assets/housingGame/predio.png');

        // // Carregar botões
        // this.load.image('next-button', 'assets/ui/next-button.png');
        // this.load.image('star', 'assets/ui/star.png');
        
        // // Carregar áudios
        this.load.audio('correct-sound', '/assets/common/sounds/correct.mp3');
        this.load.audio('wrong-sound', '/assets/common/sounds/incorrect.mp3');
        this.load.audio('celebration', '/assets/common/sounds/complete.mp3');
    }

    create() {
        this.animationsManager = new AnimationManager(this);
        this.effectManager = new EffectManager(this);
        
        this.setupBackground();
        this.setupUI();
        this.startLevel();
    }

    private setupBackground() {
        // const { width, height } = this.cameras.main;
        
        this.background = this.add.image(200, 200, 'background');
        this.background.setScale(0.8);
        
        // Adicionar Duda pensando
        this.dudaThinking = this.add.image(190, 200, 'duda-thinking');
        this.dudaThinking.setScale(0.4);
    }

    private setupUI() {
        const { width } = this.cameras.main;
        
        // Texto da pergunta
        this.questionText = this.add.text(width / 2, 100, '', {
            fontSize: '32px',
            color: '#2D5AA0',
            fontFamily: 'Arial',
            align: 'center',
            backgroundColor: '#FFFFFF'
        }).setOrigin(0.5);
        
        // Nome da moradia
        this.housingNameText = this.add.text(width / 2, 150, '', {
            fontSize: '48px',
            color: '#FF6B35',
            fontFamily: 'Arial Black',
            align: 'center',
            backgroundColor: '#FFFFFF'
        }).setOrigin(0.5);
        
        // Containers das opções
        this.createOptionContainers();
    }

    private createOptionContainers() {
        const { width, height } = this.cameras.main;
        const containerColors = [0x8B00FF, 0x0066FF, 0x00CC66]; // Roxo, Azul, Verde
        const startX = width / 2 - 300;
        const containerWidth = 200;
        const containerHeight = 200;
        const spacing = 300;
        
        for (let i = 0; i < 3; i++) {
            const x = startX + (i * spacing);
            const y = height / 2 + 100;
            
            const container = this.add.container(x, y);
            
            // Criar retângulo colorido manualmente
            const rect = this.add.rectangle(0, 0, containerWidth, containerHeight, containerColors[i]);
            rect.setStrokeStyle(4, 0xFFFFFF); // Borda branca
            
            container.add(rect);
            container.setSize(containerWidth, containerHeight);
            container.setInteractive(new Phaser.Geom.Rectangle(-containerWidth/2, -containerHeight/2, containerWidth, containerHeight), Phaser.Geom.Rectangle.Contains);
            
            this.optionContainers.push(container);
        }
    }

    private startLevel() {
        if (this.currentLevel >= this.housingQuestions.length) {
            // Jogo completo - isso não deveria acontecer mais pois sempre vamos para LevelCompletedScene
            return;
        }
        
        const question = this.housingQuestions[this.currentLevel];
        
        // Atualizar textos
        this.questionText.setText(`Qual moradia é?`);
        this.housingNameText.setText(question.housingName);
        
        // Embaralhar opções
        const shuffledOptions = [...question.options].sort(() => Math.random() - 0.5);
        
        // Configurar containers com imagens
        shuffledOptions.forEach((housing, index) => {
            const container = this.optionContainers[index];
            
            // Limpar container anterior
            if (container.length > 1) {
                container.removeAt(1);
            }
            
            // Adicionar imagem da moradia
            const housingImage = this.add.image(0, 0, housing);
            housingImage.setDisplaySize(150, 170);
            container.add(housingImage);
            
            // Configurar interação
            container.removeAllListeners();
            container.on('pointerdown', () => this.selectOption(housing, question.correctHousing, container));
        });
        
        // Animar entrada dos containers
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
        
        // Desabilitar interações
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
        
        // Efeitos visuais usando EffectManager
        this.effectManager.growup(container, "Cubic.out", 1.2, 500);
        
        // Áudio
        this.sound.play('correct-sound');
        
        // Ir para próximo nível ou completar jogo após delay
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
        // Efeitos visuais usando EffectManager - efeito de tremor através do AnimationManager
        this.animationsManager.incorrectAnswerEffect(container);
        
        // Áudio
        this.sound.play('wrong-sound');
        
        // Reativar interações após delay
        this.time.delayedCall(1000, () => {
            this.optionContainers.forEach(c => {
                c.setInteractive();
            });
        });
    }
}