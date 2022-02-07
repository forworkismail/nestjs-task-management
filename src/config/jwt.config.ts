export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
    expiry: parseInt(process.env.JWT_EXPIRY, 10)
  }
});
