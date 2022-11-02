class PirateKingException implements IPirateKingException {
  public message: string = '';

  constructor(
    message: string,
  ) {
    this.message = message;
  }
}

export interface IPirateKingException {
  message: string;
}

export const pirateKingException = PirateKingException;
