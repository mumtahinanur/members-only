import express from "express";
import path from "node:path";
import sessionMiddleware from "./config/session.js";
import passport from "./config/passport.js";
import authRouter from "./routes/authRouter.js";
import clubRouter from "./routes/clubRouter.js";
import messageRouter from "./routes/messageRouter.js";

const PORT = process.env.PORT || 8000;

const app = express();

// View engine: EJS templates live in /views
app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "views"));

// Middleware: parse HTML form bodies and serve static assets from /public
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, "public")));

// Sessions (config/session.js) must come before passport.session()
app.use(sessionMiddleware);

// Passport reads the user id from the session and sets req.user
app.use(passport.session());

// Make the logged-in user (or undefined) available in every view
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Routes (home page "/" lives in messageRouter)
app.use("/", authRouter);
app.use("/", clubRouter);
app.use("/", messageRouter);

// 404 handler (runs when no route matched)
app.use((req, res) => {
  res.status(404).render("error", {
    title: "Not Found",
    message: "Page not found.",
  });
});

// Error handler. Express recognises it by its four parameters, so `_next`
// must stay even though it's unused (the _ tells ESLint that's intentional).
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(err.status || 500).render("error", {
    title: "Error",
    message: "Something went wrong.",
  });
});

app.listen(PORT, (error) => {
  if (error) {
    throw error;
  }
  console.log(`Members Only listening on http://localhost:${PORT}`);
});
