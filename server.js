const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

// Здесь будет логика для хранения и получения данных о местах

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
