import crypto from "node:crypto";

export default class Hand {
  public readonly uuid: string;

  constructor(
    public readonly name: string,
    public readonly publicKey: string,
    public readonly publicSignKey: string
  ) {
    if (!name || !publicKey || !publicSignKey) {
      throw new Error("Invalid parameters to create Hand");
    }

    this.uuid = crypto.randomUUID();
  }
}
