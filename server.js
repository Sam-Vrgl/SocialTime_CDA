const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.get('/test', (req, res) => {
  res.json({ message: 'This is a test route' });
});

app.get('/hello', (req, res) => {
  const name = req.query.name || 'stranger';
  res.json({ greeting: `Hello, ${name}!` });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
