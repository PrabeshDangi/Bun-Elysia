import app from "./app";

app.on("error", (error) => {
  console.log("Error initializing the application.");
  throw error;
});

app.listen(Number(process.env.PORT), () => {
  console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
  );
});
