import express, { type NextFunction, type Request, type Response } from 'express';
import { usersRouter } from './users/users';
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

usersRouter.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.status(500).send(err.message)
  next();
});

app.listen(port, () => {
  console.log(`Server is running on localhost:${port}`); 
});
