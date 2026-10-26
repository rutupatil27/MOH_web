export class HttpError extends Error {
  constructor(status, message, details = undefined) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const notFound = (what = "Resource") => new HttpError(404, `${what} not found.`);
export const badRequest = (message, details) => new HttpError(400, message, details);
export const unprocessable = (fields) => new HttpError(422, "Please correct the highlighted fields.", { fields });
