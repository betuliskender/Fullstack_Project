import { body, validationResult } from "express-validator";

export const validateUserRegistration = [
  body("firstName")
    .not().isEmpty()
    .withMessage("First name is required")
    .trim()
    .escape(),
  body("lastName")
    .not().isEmpty()
    .withMessage("Last name is required")
    .trim()
    .escape(),
  body("userName")
    .not().isEmpty()
    .withMessage("User name is required")
    .trim()
    .escape(),
  body("email")
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const validateUserLogin = [
  body("email")
    .isEmail()
    .withMessage("Must be a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
