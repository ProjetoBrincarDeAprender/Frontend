import api from '@/utils/api';

export interface InteractionData {
    studentId: number;
    activityId: number;
    questionId: number;
    answer: string;
    timeSpent: number;
    attempts: number;
    neededHint: boolean;
    responseDate: string;
    isCorrect: boolean;
    [key: string]: unknown;
}

export class ProfessionsGameService {
    private static readonly ACTIVITY_ID = 3; // ID específico para o jogo de profissões
    private static readonly DEFAULT_STUDENT_ID = 10130001; // ID padrão quando não há aluno logado
    private startTime: number = 0;
    private attempts: number = 0;
    private hintsUsed: boolean = false;

    /**
     * Inicia o cronômetro para uma nova pergunta
     */
    startQuestion(): void {
        this.startTime = Date.now();
        this.attempts = 0;
        this.hintsUsed = false;
    }

    /**
     * Incrementa o número de tentativas
     */
    incrementAttempts(): void {
        this.attempts++;
    }

    /**
     * Marca que uma dica foi usada
     */
    useHint(): void {
        this.hintsUsed = true;
    }

    /**
     * Valida os dados antes de enviar para a API
     */
    private validateInteractionData(data: InteractionData): boolean {
        const required = ['studentId', 'activityId', 'questionId', 'answer', 'timeSpent', 'attempts', 'neededHint', 'responseDate', 'isCorrect'];
        
        for (const field of required) {
            if (data[field as keyof InteractionData] === undefined || data[field as keyof InteractionData] === null) {
                console.error(`Campo obrigatório ausente: ${field}`);
                return false;
            }
        }
        
        // Validações específicas
        if (typeof data.studentId !== 'number') {
            console.error('studentId deve ser um número');
            return false;
        }
        
        if (typeof data.activityId !== 'number') {
            console.error('activityId deve ser um número');
            return false;
        }
        
        if (typeof data.questionId !== 'number') {
            console.error('questionId deve ser um número');
            return false;
        }
        
        if (typeof data.timeSpent !== 'number') {
            console.error('timeSpent deve ser um número');
            return false;
        }
        
        return true;
    }

    /**
     * Registra uma interação no banco de dados
     */
    async registerInteraction(
        studentId: number,
        questionId: number,
        answer: string,
        isCorrect: boolean
    ): Promise<void> {
        try {
            const timeSpent = Date.now() - this.startTime;
            
            const interactionData: InteractionData = {
                studentId: studentId,
                activityId: ProfessionsGameService.ACTIVITY_ID,
                questionId,
                answer,
                timeSpent,
                attempts: this.attempts,
                neededHint: this.hintsUsed,
                responseDate: new Date().toISOString(),
                isCorrect
            };

            // Validar dados antes de enviar
            if (!this.validateInteractionData(interactionData)) {
                console.error('Dados inválidos, não enviando para API');
                return;
            }

            console.log('📊 Registrando interação do jogo de profissões:', interactionData);

            const response = await api.post('/adaptiveSystem/interaction/register', interactionData);
            
            if (response.status === 200) {
                console.log('✅ Interação registrada com sucesso!');
            }
        } catch (error) {
            console.error('❌ Erro ao registrar interação:', error);
            
            // Log mais detalhado do erro para debug
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { status: number; data: unknown; headers: unknown } };
                console.error('📋 Detalhes do erro:');
                console.error('Status:', axiosError.response?.status);
                console.error('Data:', axiosError.response?.data);
                console.error('Headers:', axiosError.response?.headers);
            }
            
            // Não interrompe o jogo se houver erro na API
        }
    }

    /**
     * Registra uma resposta correta
     */
    async registerCorrectAnswer(
        studentId: number,
        questionId: number,
        answer: string
    ): Promise<void> {
        await this.registerInteraction(studentId, questionId, answer, true);
    }

    /**
     * Registra uma resposta incorreta
     */
    async registerIncorrectAnswer(
        studentId: number,
        questionId: number,
        answer: string
    ): Promise<void> {
        await this.registerInteraction(studentId, questionId, answer, false);
    }

    /**
     * Obtém o ID do estudante do contexto/cookies ou retorna o ID padrão
     */
    getStudentId(): number {
        try {
            // Tenta obter do localStorage ou cookies
            const userData = localStorage.getItem('userData');
            if (userData) {
                const user = JSON.parse(userData);
                const id = user.id || user.studentId;
                if (id) {
                    return typeof id === 'string' ? parseInt(id, 10) : id;
                }
            }
            
            // Fallback para ID padrão se não estiver logado
            console.log(`🔑 Usando ID padrão: ${ProfessionsGameService.DEFAULT_STUDENT_ID}`);
            return ProfessionsGameService.DEFAULT_STUDENT_ID;
        } catch (error) {
            console.error('Erro ao obter ID do estudante:', error);
            console.log(`🔑 Usando ID padrão devido ao erro: ${ProfessionsGameService.DEFAULT_STUDENT_ID}`);
            return ProfessionsGameService.DEFAULT_STUDENT_ID;
        }
    }

    /**
     * Verifica se o estudante está autenticado
     */
    isAuthenticated(): boolean {
        try {
            const userData = localStorage.getItem('userData');
            return userData !== null;
        } catch (_error) {
            return false;
        }
    }
}