interface IClickedButtonLevel {
  answer: string;
  question: string;
  entityKey: string;
  completeEntityKey: string;
  options: string[];
}

export default class ClickedButtonLevel {
  private answer: string;
  private question: string;
  private entityKey: string;
  private completeEntityKey: string;
  private options: string[];

  constructor(data: IClickedButtonLevel) {
    this.answer = data.answer;
    this.question = data.question;
    this.entityKey = data.entityKey;
    this.completeEntityKey = data.completeEntityKey;
    this.options = data.options;
  }

  public getAnswer(): string {
    return this.answer;
  }

  public getQuestion(): string {
    return this.question;
  }

  public getEntityKey(): string {
    return this.entityKey;
  }

  public getCompleteEntityKey(): string {
    return this.completeEntityKey;
  }

  public getOptions(): string[] {
    return this.options;
  }
}
