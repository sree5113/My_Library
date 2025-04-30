require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connect() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    return client.db('book_library').collection('books');
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

async function run() {
  let booksCollection;

  try {
    booksCollection = await connect();

    // GET all books
    app.get('/api/books', async (req, res) => {
      try {
        const books = await booksCollection.find().toArray();
        res.json(books);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching books' });
      }
    });

    // POST a new book
    app.post('/api/books', async (req, res) => {
      const newBook = req.body;
      newBook.dateAdded = new Date();
      try {
        const result = await booksCollection.insertOne(newBook);
        res.status(201).json({ ...newBook, _id: result.insertedId });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding book' });
      }
    });

    // DELETE a book by ID
    app.delete('/api/books/:id', async (req, res) => {
      const bookId = req.params.id;
      try {
        const result = await booksCollection.deleteOne({ _id: new ObjectId(bookId) });
        if (result.deletedCount === 1) {
          res.json({ message: 'Book deleted successfully' });
        } else {
          res.status(404).json({ message: 'Book not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting book' });
      }
    });

    // PUT (Update) a book by ID
    app.put('/api/books/:id', async (req, res) => {
      const bookId = req.params.id;
      const updatedBook = req.body;
      updatedBook.dateAdded = new Date(updatedBook.dateAdded); // Ensure date is a Date object
      try {
        const result = await booksCollection.updateOne(
          { _id: new ObjectId(bookId) },
          { $set: updatedBook }
        );
        if (result.modifiedCount === 1) {
          const updatedDocument = await booksCollection.findOne({ _id: new ObjectId(bookId) });
          res.json(updatedDocument);
        } else {
          res.status(404).json({ message: 'Book not found' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating book' });
      }
    });

    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

run().catch(console.dir);