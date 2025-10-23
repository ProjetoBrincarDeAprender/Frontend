/**
 * Interface que define a estrutura de um nível do jogo de clicar em botões.
 * - answer: resposta correta do nível
 * - question: pergunta/comando do nível
 * - entityKey: chave da imagem auxiliar (opcional)
 * - options: alternativas de resposta
 * - content: conteúdo/estímulo do nível (opcional)
 * - completeContent: conteúdo completo após resposta correta (opcional)
 */
interface IClickButtonLevel {
  answer: string;
  question: string;
  entityKey?: string;
  options: string[];
  content?: string[];
  completeContent?: string[];
}

/**
 * Classe que representa um nível do jogo de clicar em botões.
 * Armazena os dados do nível e fornece métodos de acesso.
 */
export default class ClickButtonLevel {
  /** Resposta correta do nível */
  private answer: string;
  /** Pergunta/comando do nível */
  private question: string;
  /** Chave da imagem auxiliar (opcional) */
  private entityKey?: string;
  /** Conteúdo/estímulo do nível (opcional) */
  private content?: string[];
  /** Conteúdo completo após resposta correta (opcional) */
  private completeContent?: string[];
  /** Alternativas de resposta */
  private options: string[];

  /**
   * Cria um novo nível a partir dos dados fornecidos.
   * @param data Objeto com os dados do nível
   */
  constructor(data: IClickButtonLevel) {
    this.answer = data.answer;
    this.question = data.question;
    this.entityKey = data.entityKey;
    this.content = data.content;
    this.completeContent = data.completeContent;
    this.options = data.options;
  }

  /**
   * Retorna a resposta correta do nível.
   */
  public getAnswer(): string {
    return this.answer;
  }

  /**
   * Retorna a pergunta/comando do nível.
   */
  public getQuestion(): string {
    return this.question;
  }

  /**
   * Retorna a chave da imagem auxiliar do nível, se existir.
   */
  public getEntityKey(): string {
    if (this.entityKey) {
      return this.entityKey;
    }
    return "";
  }

  /**
   * Retorna as alternativas de resposta do nível.
   */
  public getOptions(): string[] {
    return this.options;
  }

  /**
   * Retorna o conteúdo/estímulo do nível, se existir.
   */
  public getContent(): string[] {
    if (this.content) {
      return this.content;
    }
    return [];
  }

  /**
   * Retorna o conteúdo completo do nível após resposta correta, se existir.
   */
  public getCompleteContent(): string[] {
    if (this.completeContent) {
      return this.completeContent;
    }
    return [];
  }
}
