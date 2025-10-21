import Phaser from 'phaser';

export class StartScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StartScene' });
    }

    preload() {
        // Carregar assets para a tela inicial
        this.load.image('backgroundStart', '/assets/housingGame/bg.png');
        this.load.image('dudaWelcome', '/assets/housingGame/duda-pensando.png');
        
        // Carregar assets do jogo principal também
        this.load.image('background', '/assets/housingGame/bg.png');
        this.load.image('duda-thinking', '/assets/housingGame/duda-pensando.png');
        
        // Carregar imagens das moradias
        this.load.image('casa', '/assets/housingGame/casa.png');
        this.load.image('castelo', '/assets/housingGame/castelo.png');
        this.load.image('oca', '/assets/housingGame/oca.png');
        this.load.image('iglu', '/assets/housingGame/iglu.png');
        this.load.image('predio', '/assets/housingGame/predio.png');

        // Carregar áudios
        this.load.audio('correct-sound', '/assets/common/sounds/correct.mp3');
        this.load.audio('wrong-sound', '/assets/common/sounds/incorrect.mp3');
        this.load.audio('celebration', '/assets/common/sounds/complete.mp3');
    }

    create() {
        this.createStartScene();
    }

    private createStartScene() {
        this.add.image(400,300, "backgroundStart").setScale(1.2);
         this.add.rectangle(
        this.scale.width / 2,
        this.scale.height / 2,
        this.scale.width,
        this.scale.height,
        0x000000,
        0.4
        );
        
        this.add.image(200, 430, "dudaWelcome").setScale(0.6);

        this.createTitle();
        this.createStartButton();
    }

    private createTitle() {
        const titleBg = this.add.graphics();
        titleBg.fillStyle(0xFF6B35, 1); 
        titleBg.fillRoundedRect(
            this.scale.width / 2 - 280, 
            60, 
            560, 
            100, 
            20
        );

        this.add
            .text(this.scale.width / 2, 110, "DESCUBRA AS MORADIAS!", {
                fontSize: "36px",
                fontFamily: "Arial Black",
                color: "#fff",
                align: 'center'
            })
            .setOrigin(0.5);
    }

   

    private createStartButton() {
        const buttonContainer = this.add.container(this.scale.width / 2, 380);
        
        const buttonBg = this.add.rectangle(0, 0, 200, 60, 0x22c55e);
        buttonBg.setStrokeStyle(4, 0xFFFFFF);
        
        const buttonText = this.add.text(0, 0, "COMEÇAR", {
            fontSize: "24px",
            fontFamily: "Arial",
            color: "#FFFFFF",
            fontStyle: "bold"
        }).setOrigin(0.5);

        buttonContainer.add([buttonBg, buttonText]);
        
        buttonContainer.setInteractive(
            new Phaser.Geom.Rectangle(-100, -30, 200, 60),
            Phaser.Geom.Rectangle.Contains
        );

        buttonContainer.on('pointerover', () => {
            buttonBg.setFillStyle(0x16a34a);
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1.05,
                scaleY: 1.05,
                duration: 150,
                ease: 'Power2.easeOut'
            });
        });

        buttonContainer.on('pointerout', () => {
            buttonBg.setFillStyle(0x22c55e);
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 1,
                scaleY: 1,
                duration: 150,
                ease: 'Power2.easeOut'
            });
        });

        
        buttonContainer.on('pointerdown', () => {
            this.tweens.add({
                targets: buttonContainer,
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                ease: 'Power2.easeInOut',
                onComplete: () => {
                    this.scene.start('GameScene', {
                        currentLevel: 0,
                        score: 0
                    });
                }
            });
        });

        this.tweens.add({
            targets: buttonContainer,
            scaleX: 1.02,
            scaleY: 1.02,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    update() {}
}