import express from "express";
import path from "node:path";
import authRouter from "./routes/authRouter.js";

const PORT = process.env.PORT || 8000;

const app = express();

// View engine: EJS templates live in /views
app.set("view engine", "ejs");
app.set("views", path.join(import.meta.dirname, "views"));

// Middleware: parse HTML form bodies and serve static assets from /public
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(import.meta.dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "Members Only" });
});
app.use("/", authRouter);

// 404 handler (runs when no route matched)
app.use((req, res) => {
  res.status(404).render("error", { title: "Not Found", message: "Page not found." });
});

// Error handler (four arguments marks it as error-handling middleware)
app.use((err, req, res, next) => {
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
