export class ApiError extends Error {
  statusCode: number;
  errors?: Array<{ path: string; message: string }>;

  constructor(
    statusCode: number,
    message: string,
    errors?: Array<{ path: string; message: string }>
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}
