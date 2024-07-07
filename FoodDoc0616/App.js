import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, Button, ScrollView } from 'react-native';
import axios from 'axios'; // Import axios library to make HTTP requests

export default function App() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSend = async () => {
    if (message.trim() === '') return;

    const newChatHistory = [...chatHistory, { sender: 'user', text: message }];
    setChatHistory(newChatHistory);
    setMessage('');

    try {
      const response = await axios.post('http://YOUR_IP_ADDRESS:3000/chat', { message }); // http://YOUR_IP_ADDRESS:3000/chat
      setChatHistory([...newChatHistory, { sender: 'bot', text: response.data.response }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setChatHistory([...newChatHistory, { sender: 'bot', text: 'Sorry, something went wrong.' }]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>FoodDoc Chatbot</Text>
      <ScrollView style={styles.chatWindow}>
        {chatHistory.map((chat, index) => (
          <View key={index} style={[styles.chatBubble, chat.sender === 'user' ? styles.userBubble : styles.botBubble]}>
            <Text style={styles.chatText}>{chat.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="How can I help you?"
        />
        <Button title="Send" onPress={handleSend} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  chatWindow: {
    flex: 1,
    padding: 10,
  },
  chatBubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    maxWidth: '80%',
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#007BFF',
  },
  botBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#eee',
  },
  chatText: {
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});
