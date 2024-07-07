import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, TextInput, Button, Text, ScrollView } from 'react-native';
import axios from 'axios';

export default function App() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleGenerate = async () => {
    try {
      const res = await axios.post('http://YOUR_IP_ADDRESS:3000/generate', { text: input });
      setResponse(res.data.response);
    } catch (error) {
      console.error(error);
      setResponse('An error occurred. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <TextInput
          style={styles.input}
          placeholder="Enter your question"
          value={input}
          onChangeText={setInput}
        />
        <Button title="Generate" onPress={handleGenerate} />
        <Text style={styles.response}>{response}</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
  },
  response: {
    marginTop: 20,
    fontSize: 16,
  },
});
