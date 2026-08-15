export class ApiError extends Error {
  readonly status: number;
  readonly code?: number;
  readonly details?: unknown;

  constructor(options: {
    message: string;
    status: number;
    code?: number;
    details?: unknown;
  }) {
    super(options.message);
    this.name = "Api Error";
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
  }
}
