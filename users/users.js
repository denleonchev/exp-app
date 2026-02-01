import express from 'express';

export const usersRouter = express.Router();

usersRouter.use((req, res, next) => {
  console.log('Users middleware');  
  next();
});

usersRouter.post('/login', (req, res) => {
  throw new Error('bad')
  res.send('login');
});

usersRouter.post('/register', (req, res) => {
  res.send('register');
});
