1.INTRODUCTION
This document provides the overview of a simple mobile application developed using Expo and React Native. The application allows users to view a library of books, add new books to the library and delete the existing books. This project serves as a demonstration of fundamental mobile app development skills, including UI development, state management, API integration, and basic data manipulation.

2.PROJECT OVERVIEW
This applocation presents user interface with the following features.
> Add Book: Allows user to input details for new book[Title, Author, Info, Language] and add it to library.
> View Library: Display a list of books with titles, authors and other information.
> Delete Book: Enables users to remove book from library.
> Filtering and Sorting: Provides options to filter books by author and language. Sort the library by various criteria like title, author,

3.TECH STACK
.Frontend:
> React Native: A JavaScript framework for building native mobile apps.
> Expo: A framework and platform for universal React applications. Expo simplifies React Native development by providing a wide range of pre-built components and APIs.
> TypeScript: A statically typed superset of JavaScript, enhancing code maintainability and reducing errors.
> React Hooks: Features in React that let you use state and other React features without writing classes.
> Axios: A promise-based HTTP client for making API requests to the backend.
> React Native UI Components: Built-in components like View, Text, TouchableOpacity, FlatList, TextInput, and ScrollView.
> @react-native-picker/picker: A component for creating dropdown selection menus.
> @expo/vector-icons: A library for using various icon sets (Feather icons were used for the delete button).

.Backend:
> Node.js: A JavaScript runtime environment.
> Express.js: A minimal and flexible Node.js web application framework 
> MongoDB: A NoSQL database.
> cors: Middleware for enabling Cross-Origin Resource Sharing.

.Database
> MongoDB Atlas: Cloud-managed MongoDB service 

4.PROJECT STRUCTURE
MyApp/
├── app/
│   ├── (tabs)/
│   │   ├── _layout.tsx         // Tab-based navigation layout (if 
│   │   ├── library.tsx         // Screen to display and manage the library
│   │   └── index.tsx             // Screen to add new books
│   │   └── components/
│   │       └── BookContext.tsx   // Context API for managing book data
├── components/                // Reusable components (initially BookContext)
├── backend/                   // (Conceptual - API structure only)
│   ├── server.js              // (Conceptual API server - outlines routes)
│   └── models/                // (Conceptual data models - defines data structure)
├── App.tsx                    // Root component
├── babel.config.js
├── package.json
├── tsconfig.json
└── README.md 

5. KEY FEATURES AND IMPLEMENTATIONS DETAILS
5.1 Viewing the Library(library.tsx)
> Uses FlatList to efficiently render a scrollable list of Book items.
> Fetches book data from the backend API using functions provided by BookContext.
> Displays book details (title, author, info, date added, language).
> Implements filtering by author and language using Picker components and state management.
> Implements sorting of the library based on various criteria.
> Provides a "Delete" button for each book, implemented with TouchableOpacity and a confirmation modal.

5.2 Adding New Books(index.tsx)
> Provides input fields for users to enter the details of a new book.
> Includes an "Add Book" button that triggers the addBook function from BookContext.
> The addBook function is designed to make a POST request to the backend API.
> The local state (within the BookContext) is updated upon a successful addition.

5.3 State Management(BookContext.tsx)
> Uses React's Context API to manage the global state related to the library of books.
> Provides the following context values:
.library: An array of Book objects.
.addBook: A function to add a new book.
.deleteBook: A function to delete a book.
> Fetches initial book data from the API when the component mounts using useEffect.  The API_URL is set based on the platform.

5.5 API Interaction (Conceptual)
The application is designed to interact with a backend API (assumed to be running at http://YOUR_COMPUTER_IP_ADDRESS:5000/api for mobile testing). The following endpoints are used:
.GET /api/books: Fetches the initial list of books.
.POST /api/books: Adds a new book to the library.
.DELETE /api/books/:id: Deletes a specific book based on its ID.
> The axios library is used to make these HTTP requests.  The API_URL is dynamically set based on the platform.


6. CONCLUSION
This library application demonstrates a functional mobile app built with Expo and React Native, showcasing key development concepts and the design to interact with a backend API. While it includes a conceptual backend, it provides a solid foundation for further development and the addition of more advanced features.
