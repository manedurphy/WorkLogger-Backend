import 'reflect-metadata';
import app from './server';

app.listen(process.env.PORT || 5000, () =>
  console.log('Server started on port 5000...')
);
