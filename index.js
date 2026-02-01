import express from 'express';
import { usersRouter } from './users/users.js';

const port = 8000;
const app = express();

app.use((req, res, next) => {
  console.log(`Time is `, new Date().toLocaleString());  
  next();
});

app.get('/', (req, res) => {
  res.send('Hi');
});

app.use('/users', usersRouter);

usersRouter.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send(err.message)
  next();
});

app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`); 
});
