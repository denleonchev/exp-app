import express from 'express';
import { usersRouter } from './users/users.js';

const port = 8000;
const app = express();

app.get('/', (req, res) => {
  res.send('Hi');
});

app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`); 
});
