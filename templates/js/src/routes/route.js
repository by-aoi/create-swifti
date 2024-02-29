export const GET = (ctx) => {
  ctx.res.status(200).json({
    message: "Hello from swifti!",
  });
};
