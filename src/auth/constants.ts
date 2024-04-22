export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  jwtAccSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccExpTime: process.env.JWT_ACCESS_EXPIRATION_TIME,
  jwtRefExpTime: process.env.JWT_REFRESH_EXPIRATION_TIME,
};
