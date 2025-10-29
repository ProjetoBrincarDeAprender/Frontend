export interface ProfessionIntroLevel {
    professionType: string;
    professionName: string;
    description: string;
    soundFile: string;
}

export interface ProfessionQuestion {
    correctProfession: string;
    options: string[];
    professionName: string;
}

export interface ProfessionDragLevel {
    profession: string;
    professionName: string;
    workplace: string;
    workplaceOptions: string[];
}

export class ProfessionsGameData {
    // Níveis introdutórios (0-6) - Duda explica cada profissão
    static readonly introLevels: ProfessionIntroLevel[] = [
        {
            professionType: 'duda',
            professionName: 'Introdução',
            description: 'Olá! Eu sou a Duda. Vamos aprender sobre\nas PROFISSÕES!',
            soundFile: '/assets/professions/sounds/intro.mp3'
        },
        {
            professionType: 'medico',
            professionName: 'Médico',
            description: 'Este é um MÉDICO!\nEle cuida da nossa saúde.',
            soundFile: '/assets/professions/sounds/medico.mp3'
        },
        {
            professionType: 'professor',
            professionName: 'Professor',
            description: 'Esta é uma PROFESSORA!\nEla ensina muitas coisas.',
            soundFile: '/assets/professions/sounds/professor.mp3'
        },
        {
            professionType: 'bombeiro',
            professionName: 'Bombeiro',
            description: 'Este é um BOMBEIRO!\nEle apaga o fogo e salva pessoas.',
            soundFile: '/assets/professions/sounds/bombeiro.mp3'
        },
        {
            professionType: 'cozinheira',
            professionName: 'Cozinheira',
            description: 'Esta é uma COZINHEIRA!\nEla prepara comidas deliciosas.',
            soundFile: '/assets/professions/sounds/cozinheira.mp3'
        },
        {
            professionType: 'policial',
            professionName: 'Policial',
            description: 'Este é um POLICIAL!\nEle protege as pessoas.',
            soundFile: '/assets/professions/sounds/policial.mp3'
        },
        {
            professionType: 'fim',
            professionName: 'Parabéns!',
            description: 'Agora você conhece\ntodas as profissões! Vamos jogar!',
            soundFile: '/assets/professions/sounds/fim.mp3'
        }
    ];

    // Níveis de pergunta (7-11) - Clicar na profissão correta
    static readonly questionLevels: ProfessionQuestion[] = [
        {
            correctProfession: 'medico',
            options: ['medico', 'professor', 'bombeiro'],
            professionName: 'Médico'
        },
        {
            correctProfession: 'professor',
            options: ['professor', 'cozinheira', 'policial'],
            professionName: 'Professor'
        },
        {
            correctProfession: 'bombeiro',
            options: ['bombeiro', 'medico', 'cozinheira'],
            professionName: 'Bombeiro'
        },
        {
            correctProfession: 'cozinheira',
            options: ['cozinheira', 'policial', 'professor'],
            professionName: 'Cozinheira'
        },
        {
            correctProfession: 'policial',
            options: ['policial', 'bombeiro', 'medico'],
            professionName: 'Policial'
        }
    ];

    // Níveis de arrastar (12-16) - Arrastar profissão para local de trabalho
    static readonly dragLevels: ProfessionDragLevel[] = [
        {
            profession: 'medico',
            professionName: 'Médico',
            workplace: 'hospital',
            workplaceOptions: ['hospital', 'escola', 'quartel']
        },
        {
            profession: 'professor',
            professionName: 'Professor',
            workplace: 'escola',
            workplaceOptions: ['escola', 'hospital', 'delegacia']
        },
        {
            profession: 'bombeiro',
            professionName: 'Bombeiro',
            workplace: 'quartel',
            workplaceOptions: ['quartel', 'escola', 'hospital']
        },
        {
            profession: 'cozinheira',
            professionName: 'Cozinheira',
            workplace: 'cozinha',
            workplaceOptions: ['cozinha', 'delegacia', 'quartel']
        },
        {
            profession: 'policial',
            professionName: 'Policial',
            workplace: 'delegacia',
            workplaceOptions: ['delegacia', 'hospital', 'escola']
        }
    ];

    static getTotalLevels(): number {
        return this.introLevels.length + this.questionLevels.length + this.dragLevels.length;
    }

    static getIntroLevel(index: number): ProfessionIntroLevel | undefined {
        return this.introLevels[index];
    }

    static getQuestionLevel(index: number): ProfessionQuestion | undefined {
        return this.questionLevels[index];
    }

    static getDragLevel(index: number): ProfessionDragLevel | undefined {
        return this.dragLevels[index];
    }
}