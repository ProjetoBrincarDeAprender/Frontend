# Jogo de Conta Armada

Jogo educativo de adição sem "vai um" (carry).

## Estrutura

- **3 níveis**: 2, 3 e 4 algarismos (5 fases cada)
- **Total**: 15 fases
- **Regra**: A soma de cada coluna não pode passar de 9

## Arquivos

- `ArmedSumLevel.ts` - Gerador de níveis
- `ArmedSumLogic.ts` - Lógica do jogo
- `ArmedSumDataManager.ts` - Envio para backend
- `scenes/StartScene.ts` - Tela inicial
- `scenes/GameScene.ts` - Tela do jogo
- `index.ts` - Configuração Phaser

## Backend

- **Activity ID**: 30
- Envia dados após cada fase completada
- Registra tentativas e tempo

## Rota

`/games/armed-sum`
