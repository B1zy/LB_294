const express = require('express');
const app = express();
const mongoose = require('mongoose');
const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
mongoose.connect('mongodb://localhost:27017/diary', { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});
const entrySchema = new mongoose.Schema({
    title: String,
    description: String,
    author: String,
    content: String,
    creationDate: String,
    creationHour: String,
    appendix: Boolean
  });
  
  const Entry = mongoose.model('Entry', entrySchema);
  app.use(express.json());

// Get all entries
app.get('/entries', async (req, res) => {
  const entries = await Entry.find();
  res.json(entries);
});

// Create a new entry
app.post('/entries', async (req, res) => {
  const newEntry = req.body;
  const entry = new Entry(newEntry);
  await entry.save();
  res.json(entry);
});

// Update an entry
app.put('/entries/:id', async (req, res) => {
  const entryId = req.params.id;
  const updatedEntry = req.body;
  await Entry.findByIdAndUpdate(entryId, updatedEntry);
  res.json(updatedEntry);
});

// Delete an entry
app.delete('/entries/:id', async (req, res) => {
  const entryId = req.params.id;
  await Entry.findByIdAndDelete(entryId);
  res.json({ message: 'Entry deleted successfully' });
});
