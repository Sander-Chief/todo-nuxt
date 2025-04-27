export enum ResponseStatus {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface ServerResponse<T = unknown> {
  statusMessage: ResponseStatus,
  statusCode?: number,
  data?: T,
  message?: string | Error,
}
