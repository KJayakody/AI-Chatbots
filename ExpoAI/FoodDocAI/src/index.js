import { View, Text } from "react-native"
import React, { useState } from "react"
import { GiftedChat } from 'react-native-gifted-chat'
import axios from "axios"

const ChatBot = () => {
    const [messages, setMessages] = useState([])

    const YOUR_CHATGPT_API_KEY = 'sk-proj-e06lS00RNrUSjT4624TtT3BlbkFJPmHvSbrn1RlTW8mc7dvF'

    const handleSend = async (newMessages = []) => {
        try {
            // Get the user's message
            const userMessage = newMessages[0];

            // Add the user's message to the message state
            setMessages(previousMessages => GiftedChat.append(previousMessages, userMessage))
            const messageText = userMessage.text.tolowerCase();
            const keywords = ['food', 'nutrition', 'health'] // add more keywords as needed
            if (!keywords.some(keyword => messageText.includes(keyword))){
                // if the message does not contain any nutrition related keywords, respond with a default message
                const botMessage = {
                    id: new Date().getTime() + 1,
                    text: "I;m your personal FoodDoc, ask me anything related to food nutrition",
                    createdAt: new Date(),
                    user: {
                        _id: 2,
                        name: 'FoodDoc'
                    }
                };
                setMessages(previousMessages => GiftedChat.append(previousMessages, botMessage));
                return;
            }

            // if the message contains food-related keywords, fetch a recipe from the API and respond with
            const response = await axios.post('https://api.openai.com/v1/engines/text-davinci-003/completions', {
                prompt:     `Get me a recipe for ${messageText}`,
                max_tokens: 1200,
                temperature: 0.2,
                n:1,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${YOUR_CHATGPT_API_KEY}`
                }
            });
            console.log(response.data);

            const recipe = response.data.choices[0].text.trim();
            const botMessage = {
                _id: new Date().getTime() + 1,
                text: recipe,
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'FoodDoc'
                }
            };

            setMessages(previousMessages => GiftedChat.append(previousMessages, botMessage));
            
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <View style={{ flex:1 }}>
            <View
                style={{
                    backgroundColor:'#F5F5F5',
                    padding:10,
                    alignItems:'center',
                    justifyContent:'center',
                    borderBottomWidth:1,
                    marginTop:40,
                    marginBottom:5
                }}
            >
                <Text style={{
                    fontSize:32,
                    fontWeight:'bold'
                }}>
                    FoodDoc
                </Text>
            </View>
                <GiftedChat 
                    messages={messages}
                    onSend={newMessages => handleSend(newMessages)}
                    user={{ _id: 1}}
                />

        </View>
    )
}

export default ChatBot