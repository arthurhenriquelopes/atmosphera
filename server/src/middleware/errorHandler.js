export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class LocationNotFoundError extends AppError {
  constructor(location) {
    super(`location "${location}" could not be found`, 404, 'LOCATION_NOT_FOUND');
  }
}

export class InvalidDateRangeError extends AppError {
  constructor(detail) {
    super(`invalid date range: ${detail}`, 400, 'INVALID_DATE_RANGE');
  }
}

export class ExternalAPIError extends AppError {
  constructor(service, detail) {
    super(`${service} api error: ${detail}`, 502, 'EXTERNAL_API_ERROR');
  }
}

export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';

  if (statusCode === 500) {
    console.error('[error]', err.stack || err.message);
  }

  res.status(statusCode).json({
    error: {
      code,
      message: err.message,
    },
  });
}
