import { validationResult } from "express-validator";

// Last step of every validator array: if any rule failed, re-render the
// form with the messages; otherwise continue to the controller.
export default function handleErrors(view, title) {
  return (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    // values: req.body is safe — the views never put passwords back in the inputs.
    res.status(400).render(view, { title, errors: errors.array(), values: req.body });
  };
}
