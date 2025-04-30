import React, { useState, useContext } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { BookContext } from './components/BookContext';
import { Feather } from '@expo/vector-icons';
import { blue } from 'react-native-reanimated/lib/typescript/Colors';
interface Book {
  id: string;
  title: string;
  author: string;
  info: string;
  dateAdded: Date;
  language: string;
}

export default function TabOneScreen() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [info, setInfo] = useState('');
  const [language, setLanguage] = useState('');
  const { addBook } = useContext(BookContext);

  const handleAddBook = () => {
    console.log('handleAddBook called from Add Book screen');
    console.log('Title:', title, 'Author:', author, 'Info:', info, 'Language:', language);
    if (title.trim() && author.trim()) {
      const newBook: Book = {
        id: Date.now().toString(),
        title,
        author,
        info,
        dateAdded: new Date(),
        language,
      };
      addBook(newBook);
      setTitle('');
      setAuthor('');
      setInfo('');
      setLanguage('');
    } else {
      alert('Please enter at least title and author.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add New Book</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Title"
          value={title}
          onChangeText={(text) => setTitle(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Author"
          value={author}
          onChangeText={(text) => setAuthor(text)}
        />
        <TextInput
          style={styles.multilineInput}
          placeholder="Book Info"
          value={info}
          onChangeText={(text) => setInfo(text)}
          multiline
          numberOfLines={3}
        />
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Language:</Text>
          <RNPicker
            selectedValue={language}
            style={styles.picker}
            onValueChange={(itemValue) => setLanguage(itemValue)}
          >
            <RNPicker.Item label="Select Language" value="" />
            <RNPicker.Item label="Bengali" value="Bengali" />
            <RNPicker.Item label="Chinese" value="Chinese" />
            <RNPicker.Item label="English" value="English" />
            <RNPicker.Item label="French" value="French" />
            <RNPicker.Item label="Hindi" value="Hindi" />
            <RNPicker.Item label="Italian" value="Italian" />
            <RNPicker.Item label="Japanese" value="japanese" />
            <RNPicker.Item label="Korean" value="Korean" />
            <RNPicker.Item label="Kannada" value="Kannada" />
            <RNPicker.Item label="Sanskrit" value="Sanskrit" />
            <RNPicker.Item label="Tamil" value="Tamil" />
            <RNPicker.Item label="Telugu" value="Telugu" />
          </RNPicker>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddBook}>
          <Text style={styles.addButtonText}>Add Book <Feather name='book' size={20}/> </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  multilineInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    marginBottom: 10,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: 'lightgreen',
    padding: 15,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});


