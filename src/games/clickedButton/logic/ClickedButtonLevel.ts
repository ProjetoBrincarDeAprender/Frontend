interface IClickedButtonLevel {
  answer: string;
  question: string;
  entityKey?: string;
  completeEntityKey?: string;
  options: string[];
  content?: string[];
  completeContent?: string[];
}

export default class ClickedButtonLevel {
  private answer: string;
  private question: string;
  private entityKey?: string;
  private completeEntityKey?: string;
  private content?: string[];
  private completeContent?: string[];
  private options: string[];

  constructor(data: IClickedButtonLevel) {
    this.answer = data.answer;
    this.question = data.question;
    this.entityKey = data.entityKey;
    this.completeEntityKey = data.completeEntityKey;
    this.content = data.content;
    this.completeContent = data.completeContent;
    this.options = data.options;
  }

  public getAnswer(): string {
    return this.answer;
  }

  public getQuestion(): string {
    return this.question;
  }

  public getEntityKey(): string {
    if (this.entityKey) {
      return this.entityKey;
    }
    return "";
  }

  public getCompleteEntityKey(): string {
    if (this.completeEntityKey) {
      return this.completeEntityKey;
    }
    return "";
  }

  public getOptions(): string[] {
    return this.options;
  }

  public getContent(): string[] {
    if (this.content) {
      return this.content;
    }
    return [];
  }

  public getCompleteContent(): string[] {
    if (this.completeContent) {
      return this.completeContent;
    }
    return [];
  }
}
