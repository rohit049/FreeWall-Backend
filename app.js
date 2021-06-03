const fs = require('fs');
const express = require('express');
const morgan = require('morgan');

const wallRouter = require('./routes/wallRoutes');
const userRouter = require('./routes/userRoutes');

const app = express();

// Middlewares
if (process.env.NODE_ENV == 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
// app.use((req, res, next) => {
//   req.requestTime = new Date().toLocaleTimeString();
//   next();
// });

app.use('/api/v1/walls', wallRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  res.status(404).send({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

module.exports = app;
