import { body, param, query, validationResult } from 'express-validator';
import { InvalidDateRangeError } from './errorHandler.js';

export function handleValidationErrors(req, _res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg).join(', ');
    throw new InvalidDateRangeError(messages);
  }
  next();
}

export const validateRecordCreate = [
  body('location').trim().notEmpty().withMessage('location is required'),
  body('dateStart').isISO8601().withMessage('dateStart must be a valid date'),
  body('dateEnd').isISO8601().withMessage('dateEnd must be a valid date'),
  body('dateEnd').custom((value, { req }) => {
    if (new Date(value) < new Date(req.body.dateStart)) {
      throw new Error('dateEnd must be after dateStart');
    }
    return true;
  }),
  handleValidationErrors,
];

export const validateRecordUpdate = [
  param('id').isInt().withMessage('id must be an integer'),
  body('location').optional().trim().notEmpty().withMessage('location cannot be empty'),
  body('dateStart').optional().isISO8601().withMessage('dateStart must be a valid date'),
  body('dateEnd').optional().isISO8601().withMessage('dateEnd must be a valid date'),
  body('dateEnd').optional().custom((value, { req }) => {
    if (req.body.dateStart && new Date(value) < new Date(req.body.dateStart)) {
      throw new Error('dateEnd must be after dateStart');
    }
    return true;
  }),
  handleValidationErrors,
];

export const validateId = [
  param('id').isInt().withMessage('id must be an integer'),
  handleValidationErrors,
];

export const validateExportFormat = [
  param('format')
    .isIn(['json', 'csv', 'xml', 'pdf', 'markdown'])
    .withMessage('format must be one of: json, csv, xml, pdf, markdown'),
  handleValidationErrors,
];
