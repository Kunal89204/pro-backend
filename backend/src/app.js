import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(
  cors({
    origin: [process.env.CORS_CLIENT_URL, "http://localhost:3000", "https://insanity-tube.vercel.app", "https://youtube.kunalkhandelwal.dev"],
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import userRouter from './routes/user.routes.js';
import videoRouter from './routes/video.routes.js';
import playlistRouter from './routes/playlist.routes.js'
import commentsRouter from './routes/comment.routes.js'


// routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/video", videoRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use('/api/v1/comment', commentsRouter)


export { app };
