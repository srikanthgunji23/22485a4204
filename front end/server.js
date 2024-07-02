const express = require('express');
const axios = require('axios');
const app = express();

const windowSize = 10;
let numbers = [];

app.get('/numbers/:id', async (req, res) => {
  const { id } = req.params;
  const url = `http://third-party-server.com/api/${id}`; // Replace with actual URL
  try {
    const response = await axios.get(url);
    const newNumbers = response.data.numbers;
    
    const uniqueNumbers = [...new Set([...numbers, ...newNumbers])].slice(0, windowSize);
    const avg = uniqueNumbers.reduce((sum, num) => sum + num, 0) / uniqueNumbers.length;
    numbers = uniqueNumbers;

    res.json({
      windowPrevState: numbers.slice(0, -newNumbers.length),
      windowCurrState: numbers,
      numbers: newNumbers,
      avg: avg.toFixed(2)
    });
  } catch (error) {
    console.error('Error fetching numbers:', error.message);
    res.status(500).json({ error: 'Failed to fetch numbers' });
  }
});

app.listen(9877, () => {
  console.log('Server listening on port 9876');
});
