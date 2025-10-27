import Phaser from "phaser";

export class StartScene extends Phaser.Scene{
    private backgroundKey: string;
    private backgroundPath: string;
    private trophyImagePath: string;
    private trophyImageKey: string;
    private gameTitle: string;
    private nextSceneName: string;

    constructor(config?: { 
        backgroundKey?: string; 
        backgroundPath?: string;
        trophyImagePath?: string;
        trophyImageKey?: string;
        gameTitle?: string;
        nextSceneName?: string;
    }){
        super({key: "StartScene"}) ;
        this.backgroundKey = config?.backgroundKey || "backgroundStart";
        this.backgroundPath = config?.backgroundPath || "/assets/spaceGame/background.png";
        this.trophyImagePath = config?.trophyImagePath || "/assets/common/trophy.png";
        this.trophyImageKey = config?.trophyImageKey || "trophy";
        this.gameTitle = config?.gameTitle || "VAMOS JOGAR";
        this.nextSceneName = config?.nextSceneName || "GameScene";
    }

    // Método estático para criar uma instância com configuração específica
    static create(
        nextSceneName?: string,
        backgroundPath?: string, 
        backgroundKey?: string,
        gameTitle?: string,
        trophyImagePath?: string,
        trophyImageKey?: string
    ): StartScene {
        return new StartScene({ 
            nextSceneName,
            backgroundPath, 
            backgroundKey,
            gameTitle,
            trophyImagePath,
            trophyImageKey
        });
    }

    preload(){
        this.load.image(this.trophyImageKey, this.trophyImagePath);
        this.load.image(this.backgroundKey, this.backgroundPath);
        this.load.image('bgTitle', '/assets/common/bgTitle.svg');
        this.load.image('star', '/assets/common/star.svg');
        
    }
    create(){
        this.createBackground();
        this.createTitle();
        this.createStartButton();
        this.createMainContent();
    }


    private createTitle(){

        // background do título
        const titleBg = this.add.graphics();
        titleBg.fillStyle(0x2D5EFF, 1);
        titleBg.fillRoundedRect(
            this.scale.width / 2 - 280, 
            130, 
            560, 
            100, 
            20
        );
    //    titulo do jogo
        this.add.text(this.scale.width / 2, 180, this.gameTitle, {
            fontFamily: 'Comic Sans MS, Arial, sans-serif',
            fontSize: '42px',
            color: '#ffffff',
            align: 'center',
        }).setOrigin(0.5);
    }

    private createMainContent(){
        const star2 = this.add.image(300, 80, 'star').setScale(0.5);
        const star3 = this.add.image(500, 300, 'star').setScale(0.5);
        const star4 = this.add.image(700, 470, 'star').setScale(0.5);
        const star5 = this.add.image(120, 500, 'star').setScale(0.5);
        const star1 = this.add.image(700, 100, 'star').setScale(0.5);

        this.tweens.add({
            targets: star1,
            rotation: Math.PI * 2,
            duration: 6000,
            repeat: -1,
            ease: "Linear",
        });

        this.tweens.add({
            targets: star2,
            rotation: Math.PI * 2,
            duration: 7000,
            repeat: -1,
            ease: "Linear",
        });
        this.tweens.add({
            targets: star3,
             rotation: Math.PI * 2,
      duration: 5000,
      repeat: -1,
      ease: "Linear",
        });
        this.tweens.add({   
            targets: star4,
             rotation: Math.PI * 2,
      duration: 10000,
      repeat: -1,
      ease: "Linear",
        });
        this.tweens.add({
            targets: star5,
             rotation: Math.PI * 2,
        duration: 9000,
        repeat: -1,
        ease: "Linear",
        });

        const trophy = this.add
                .image(100, 300, this.trophyImageKey)
                .setScale(0.2);

        this.tweens.add({
            targets: trophy,
            y: 310,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
            });

        const trophy2 = this.add
            .image(700, 300, this.trophyImageKey)
            .setScale(0.2);

        this.tweens.add({
            targets: trophy2,
            y: 310,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: "Sine.easeInOut",
            });


    }

    private createStartButton(){
        const restartContainer = this.add.container(
                   this.scale.width / 2,
                   470,
               );
               
               // Sombra do botão (retângulo mais escuro atrás)
               const shadow = this.add.graphics();
               shadow.fillStyle(0x000000, 0.3);
               shadow.fillRoundedRect(-122, -38, 244, 84, 20);
               
               // Botão principal com bordas arredondadas
               const buttonGraphics = this.add.graphics();
               buttonGraphics.fillStyle(0x16a34a);
               buttonGraphics.fillRoundedRect(-120, -40, 240, 80, 20);
               
               // Texto do botão
               const restartText = this.add
               .text(0, 0, "INICIAR", {
                   fontFamily: "Arial Black",
                   fontSize: "20px",
                   color: "#FFFFFF",
                   fontStyle: "bold",
               })
               .setOrigin(0.5);
               
               // Adicionar elementos ao container
               restartContainer.add([shadow, buttonGraphics, restartText]);
               
               // Configurar interatividade
               restartContainer.setInteractive(
                 new Phaser.Geom.Rectangle(-120, -40, 240, 80),
                 Phaser.Geom.Rectangle.Contains,
               );
           
               // Eventos de hover
               restartContainer.on("pointerover", () => {
                 buttonGraphics.clear();
                 buttonGraphics.fillStyle(0x22c55e);
                 buttonGraphics.fillRoundedRect(-120, -40, 240, 80, 20);
                 
                 this.tweens.add({
                   targets: restartContainer,
                   scale: 1.05,
                   duration: 150,
                   ease: "Power2.easeOut",
                   cursor: "pointer",
                 });
               });
           
               restartContainer.on("pointerout", () => {
                 buttonGraphics.clear();
                 buttonGraphics.fillStyle(0x16a34a);
                 buttonGraphics.fillRoundedRect(-120, -40, 240, 80, 20);
                 
                 this.tweens.add({
                   targets: restartContainer,
                   scale: 1,
                   duration: 150,
                   ease: "Power2.easeOut",
                 });
               });
           

               // Evento de clique
               restartContainer.on("pointerdown", () => {
                 this.tweens.add({
                   targets: restartContainer,
                   scale: 0.95,
                   duration: 100,
                   yoyo: true,
                   ease: "Power2.easeInOut",
                   onComplete: () => {
                       // Vai para a cena especificada ou URL
                       if (this.nextSceneName.startsWith('/')) {
                         // Se começa com '/', é uma URL - redireciona
                         window.location.href = this.nextSceneName;
                       } else {
                         // Se não, é uma cena do Phaser - inicia a cena
                         this.scene.start(this.nextSceneName);
                       }
                     }
                   });
                 });
                 
        }

    private createBackground(){

        this.add.image(this.scale.width / 2, this.scale.height / 2, this.backgroundKey).setScale(1.0);    
        // Overlay escuro por cima do background
        this.add.rectangle(
        this.scale.width / 2,
        this.scale.height / 2,
        this.scale.width,
        this.scale.height,
        0x000000,
        0.6
        );
        
    }
}
