import React, { useState, useEffect, useContext } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { BookContext } from './components/BookContext';
import { Feather } from '@expo/vector-icons';
import { Book } from './components/BookContext';

export default function TabTwoScreen() {
  const { library, deleteBook } = useContext(BookContext);
  const [sortFilterOption, setSortFilterOption] = useState('');
  const [filteredLibrary, setFilteredLibrary] = useState<Book[]>([]);
  const [filterAuthor, setFilterAuthor] = useState<string | null>(null);
  const [filterLanguage, setFilterLanguage] = useState<string | null>(null);
  const [authors, setAuthors] = useState<string[]>([]);
  const [languages, setLanguages] = useState<string[]>([]);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [bookToDeleteId, setBookToDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const uniqueAuthors = [...new Set(library.map((book) => book.author))];
    const uniqueLanguages = [...new Set(library.map((book) => book.language))];
    setAuthors(uniqueAuthors);
    setLanguages(uniqueLanguages);
    applyFilters();
  }, [library, filterAuthor, filterLanguage]);

  const applyFilters = () => {
    let filtered = [...library];

    if (filterAuthor) {
      filtered = filtered.filter((book) => book.author === filterAuthor);
    }

    if (filterLanguage) {
      filtered = filtered.filter((book) => book.language === filterLanguage);
    }

    setFilteredLibrary(filtered);
  };

  const handleSortFilterChange = (itemValue: string) => {
    setSortFilterOption(itemValue);
    setFilterAuthor(null);
    setFilterLanguage(null);
  };

  const handleDeleteBook = (id: string) => {
    setBookToDeleteId(id);
    setIsDeleteModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.libraryTitle}>My Library</Text>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter By Author:</Text>
        <RNPicker
          selectedValue={filterAuthor}
          style={styles.filterPicker}
          onValueChange={(itemValue) => setFilterAuthor(itemValue)}
        >
          <RNPicker.Item label="All Authors" value={null} />
          {authors.map((author) => (
            <RNPicker.Item key={author} label={author} value={author} />
          ))}
        </RNPicker>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Filter By Language:</Text>
        <RNPicker
          selectedValue={filterLanguage}
          style={styles.filterPicker}
          onValueChange={(itemValue) => setFilterLanguage(itemValue)}
        >
          <RNPicker.Item label="All Languages" value={null} />
          {languages.map((lang) => (
            <RNPicker.Item key={lang} label={lang} value={lang} />
          ))}
        </RNPicker>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Sort By:</Text>
        <RNPicker
          selectedValue={sortFilterOption}
          style={styles.filterPicker}
          onValueChange={handleSortFilterChange}
        >
          <RNPicker.Item label="None" value="" />
          <RNPicker.Item label="Title (A-Z)" value="title_asc" />
          <RNPicker.Item label="Title (Z-A)" value="title_desc" />
          <RNPicker.Item label="Author" value="author" />
          <RNPicker.Item label="Language" value="language" />
          <RNPicker.Item label="Date Added (Newest First)" value="date_desc" />
          <RNPicker.Item label="Date Added (Oldest First)" value="date_asc" />
        </RNPicker>
      </View>

      <FlatList
        data={filteredLibrary.sort((a, b) => {
          switch (sortFilterOption) {
            case 'title_asc':
              return a.title.localeCompare(b.title);
            case 'title_desc':
              return b.title.localeCompare(a.title);
            case 'author':
              return a.author.localeCompare(b.author);
            case 'language':
              return a.language.localeCompare(b.language);
            case 'date_desc':
              return new Date(b.dateAdded as string | Date).getTime() - new Date(a.dateAdded as string | Date).getTime();
            case 'date_asc':
              return new Date(a.dateAdded as string | Date).getTime() - new Date(b.dateAdded as string | Date).getTime();
            default:
              return 0;
          }
        })}
        keyExtractor={(item) => item.id!}
        renderItem={({ item }: { item: Book }) => (
          <View style={styles.bookItem}>
            <View style={styles.bookDetails}>
              <Text style={styles.bookTitle}>{item.title}</Text>
              <Text style={styles.bookAuthor}>by {item.author}</Text>
              {item.info && <Text style={styles.bookInfo}>Info: {item.info.substring(0, 50)}...</Text>}
              {item.dateAdded && (
                <Text style={styles.bookDateAdded}>Added on: {new Date(item.dateAdded!).toLocaleDateString()}</Text>
              )}
              <Text style={styles.bookLanguage}>Language: {item.language}</Text>
            </View>
            <TouchableOpacity onPress={() => handleDeleteBook(item.id!)} style={styles.deleteButton}>
              <Feather name="trash-2" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
      />

      {isDeleteModalVisible && bookToDeleteId && (
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to delete this book?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={() => setIsDeleteModalVisible(false)}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDeleteButton}
                onPress={() => {
                  console.log(`Confirmed deletion for ID: ${bookToDeleteId}`);
                  deleteBook(bookToDeleteId);
                  setIsDeleteModalVisible(false);
                  setBookToDeleteId(null);
                }}
              >
                <Text style={{ color: 'red' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  libraryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  filterContainer: {
    marginBottom: 15,
  },
  filterLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  filterPicker: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
  },
  bookItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  bookDetails: {
    flex: 1,
    marginRight: 10,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  bookAuthor: {
    fontSize: 14,
    color: 'black',
  },
  bookInfo: {
    fontSize: 14,
    color: 'black',
    marginTop: 5,
  },
  bookDateAdded: {
    fontSize: 12,
    color: 'black',
    marginTop: 5,
  },
  bookLanguage: {
    fontSize: 14,
    marginTop: 5,
  },
  deleteButton: {
    padding: 10,
  },
  modalContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalCancelButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'lightgray',
  },
  modalDeleteButton: {
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#ffe0e0',
  },
});