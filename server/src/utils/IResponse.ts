export class IResponse<Type> {
  status: number;
  message: string;
  data?: Type;

  constructor(status: number, message: string, data?: Type) {
    this.status = status;
    this.message = message;
    if (data) this.data = data;
  }
}
