import React, { createContext, useState, ReactNode, useEffect } from 'react';
import axios from 'axios';

export interface Book {
  _id?: string; // MongoDB uses _id
  id?: string; // Keep a local id for FlatList key
  title: string;
  author: string;
  info: string;
  dateAdded?: string | Date; // It can be a string from API or Date after conversion
  language: string;
}

interface BookContextType {
  library: Book[];
  addBook: (book: Omit<Book, '_id' | 'id' | 'dateAdded'>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  updateBook: (book: Book) => Promise<void>;
}

export const BookContext = createContext<BookContextType>({
  library: [],
  addBook: async () => {},
  deleteBook: async () => {},
  updateBook: async () => {},
});

interface BookContextProviderProps {
  children: ReactNode;
}

export const BookContextProvider: React.FC<BookContextProviderProps> = ({ children }) => {
  const [library, setLibrary] = useState<Book[]>([]);
  const API_URL = 'http://192.168.0.53:5000/api'; // Replace with your backend URL
  console.log('API URL in BookContext:', API_URL);

  const fetchBooks = async () => {
    try {
      const response = await axios.get<Book[]>(`${API_URL}/books`);
      // Convert dateAdded string to Date object
      const processedData = response.data.map(book => ({
        ...book,
        id: book._id!,
        dateAdded: book.dateAdded ? new Date(book.dateAdded) : undefined, // Handle potential null/undefined
      }));
      setLibrary(processedData);
      console.log('Fetched books:', processedData);
    } catch (error) {
      console.error('Error fetching books: ', error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const addBook = async (book: Omit<Book, '_id' | 'id' | 'dateAdded'>) => {
    try {
      const response = await axios.post<Book>(`${API_URL}/books`, book);
      setLibrary((prevLibrary) => [
        ...prevLibrary,
        { ...response.data, id: response.data._id!, dateAdded: response.data.dateAdded ? new Date(response.data.dateAdded) : undefined },
      ]);
      console.log('Book added:', response.data);
    } catch (error) {
      console.error('Error adding book: ', error);
    }
  };

  const deleteBook = async (id: string) => {
    console.log(`deleteBook function called with ID: ${id}`);
    try {
      const response = await axios.delete(`${API_URL}/books/${id}`);
      console.log('Backend delete response:', response.data); // Log the backend response
      setLibrary((prevLibrary) => {
        const updatedLibrary = prevLibrary.filter((book) => book.id !== id);
        console.log('Updated local library after delete:', updatedLibrary);
        return updatedLibrary;
      });
    } catch (error) {
      console.error('Error deleting book: ', error);
    }
  };

  const updateBook = async (book: Book) => {
    try {
      const {_id, ...updatedBookData} = book;
      const response = await axios.put<Book>(`${API_URL}/books/${_id}`, updatedBookData);
      setLibrary((prevLibrary) =>
        prevLibrary.map((b) =>
          b.id === book.id
            ? { ...response.data, id: response.data._id!, dateAdded: response.data.dateAdded ? new Date(response.data.dateAdded) : undefined }
            : b
        )
      );
      console.log('Book updated:', response.data);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  return (
    <BookContext.Provider value={{ library, addBook, deleteBook, updateBook }}>
      {children}
    </BookContext.Provider>
  );
};