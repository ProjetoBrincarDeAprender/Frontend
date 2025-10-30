# Níveis do Jogo do Labirinto - Acessibilidade

## Níveis Redesenhados para Pessoas com Síndrome de Down

### Nível 1: Reta Simples ➡️

- **Forma**: Círculo vermelho (20px)
- **Caminho**: Linha reta horizontal
- **Largura do corredor**: 150px (muito espaçoso)
- **Dificuldade**: Muito fácil - apenas arrastar da esquerda para direita
- **Objetivo**: Familiarizar com o controle do mouse

```
Início (🔴) ═══════════════════════════════ Meta (⚫)
              Corredor largo e reto
```

### Nível 2: Curva de 90° 📐

- **Forma**: Círculo amarelo (20px)
- **Caminho**: Uma única curva (L invertido)
- **Largura do corredor**: 150px
- **Dificuldade**: Fácil - subir e virar à direita
- **Objetivo**: Praticar mudança de direção

```
                    Meta (⚫)
                       ║
                       ║
                       ║
                       ╚═══════════
                                  ║
                                  ║
                              Início (🟡)
```

### Nível 3: Duas Curvas em S 🌊

- **Forma**: Círculo azul (20px)
- **Caminho**: Formato de S com duas curvas de 90°
- **Largura do corredor**: 150px
- **Dificuldade**: Médio - combinar múltiplas direções

```
      Meta (⚫)
         ║
         ╚═════════╗
                   ║
         ╔═════════╝
         ║
     Início (🔵)
```

## Características de Acessibilidade

✅ **Corredor largo**: 150px de espaço (forma tem 20px)
✅ **Sem buracos**: Paredes completamente fechadas
✅ **Progressão suave**: Reta → 1 curva → 2 curvas
✅ **Forma pequena**: Mais fácil de controlar (20px)
✅ **Feedback visual**: Volta ao início se encostar na parede
✅ **Cores distintas**: Vermelho, Amarelo, Azul
✅ **Instrução clara**: "ARRASTE ATÉ A SOMBRA" no título
