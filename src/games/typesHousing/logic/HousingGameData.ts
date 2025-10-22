export interface HousingLevel {
    id: number;
    housingName: string;
    correctHousing: string;
    options: string[];
    difficulty: 'easy' | 'medium' | 'hard';
}

export class HousingGameData {
    private levels: HousingLevel[] = [
        {
            id: 1,
            housingName: 'Casa',
            correctHousing: 'casa',
            options: ['casa', 'castelo', 'oca'],
            difficulty: 'easy'
        },
        {
            id: 2,
            housingName: 'Castelo',
            correctHousing: 'castelo', 
            options: ['casa', 'castelo', 'iglu'],
            difficulty: 'easy'
        },
        {
            id: 3,
            housingName: 'Oca',
            correctHousing: 'oca',
            options: ['oca', 'casa', 'predio'],
            difficulty: 'medium'
        },
        {
            id: 4,
            housingName: 'Iglu',
            correctHousing: 'iglu',
            options: ['casa', 'iglu', 'castelo'],
            difficulty: 'medium'
        },
        {
            id: 5,
            housingName: 'Prédio',
            correctHousing: 'predio',
            options: ['predio', 'casa', 'oca'],
            difficulty: 'hard'
        }
    ];

    getLevels(): HousingLevel[] {
        return [...this.levels];
    }

    getLevel(id: number): HousingLevel | undefined {
        return this.levels.find(level => level.id === id);
    }

    getTotalLevels(): number {
        return this.levels.length;
    }
}