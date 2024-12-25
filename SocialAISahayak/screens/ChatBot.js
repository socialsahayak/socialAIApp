import React, { useState, useRef, useEffect } from 'react';
import {ActivityIndicator, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard ,Alert} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';

function ChatScreen({ toggleTheme, isDarkTheme, addMessageToHistory, currentChat }) {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(currentChat.messages);
  const [isSending, setIsSending] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const flatListRef = useRef();

  const handleSend = async () => {
    if (message.trim()) {
      const userMessage = { type: 'user', text: message };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      addMessageToHistory(userMessage); // Update history in the parent component
      setMessage(''); // Clear the input field after sending
      setIsSending(true);
      setIsBotTyping(true);

      try {
        const response = await axios.post('http://192.168.51.90:5001/process_question', { question:message});
        const botResponseLines = response.data.answer.split("\n");
      for (let i = 0; i < botResponseLines.length; i++) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const botReply = { type: 'bot', text: botResponseLines[i] };
        setMessages((prevMessages) => [...prevMessages, botReply]);
        addMessageToHistory(botReply);
      }
      setIsBotTyping(false);
      } catch (error) {
        console.error('Error fetching response:', error);
        const errorMessage = { type: 'bot', text: 'Something went wrong. Please try again later.' };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
        addMessageToHistory(errorMessage); 
        setIsBotTyping(false);
      }finally{
        setIsSending(false);
      }
    }
  };

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true });
  }, [messages,isBotTyping]);

  const renderMessage = ({ item, index }) => (
    <View>
      <View style={[styles.messageBubble, item.type === 'user' ? styles.userMessage : styles.botMessage]}>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
      {isBotTyping && index === messages.length - 1 && item.type === 'user' && (
        <View style={[styles.messageBubble, styles.botMessage]}>
          <Text style={styles.messageText}>Fetching data...</Text>
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={[styles.botContainer, { backgroundColor: isDarkTheme ? '#000' : '#fff' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.chatArea}
            keyboardShouldPersistTaps="handled"
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, { backgroundColor: isDarkTheme ? '#1a1a1a' : '#f9f9f9', color: isDarkTheme ? '#fff' : '#000' }]}
              value={message}
              onChangeText={setMessage}

              placeholder="Type a message..."
              editable={!isSending}
              placeholderTextColor={isDarkTheme ? '#888' : '#555'}
            />
            <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={isSending|| !message.trim()}>
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

function CustomDrawerContent(props) {
  const { isDarkTheme, conversations, setCurrentChat, createNewChat } = props;
  const deleteConversation = (index) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedConversations = conversations.filter((_, i) => i !== index);
            // setConversations(updatedConversations);
          },
        },
      ]
    );
  };


  return (
    <DrawerContentScrollView {...props} style={[styles.drawerContent, { backgroundColor: isDarkTheme ? '#1a1a1a' : '#fff' }]}>
      <Text style={[styles.historyHeader, { color: isDarkTheme ? '#fff' : '#000' }]}>Chat History</Text>
      <TouchableOpacity style={styles.newChatButton} onPress={createNewChat}>
        <Text style={styles.newChatButtonText}>New Chat</Text>
      </TouchableOpacity>
      <FlatList
        data={conversations}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => setCurrentChat(item)} onLongPress={() => deleteConversation(index)}>
            <View style={styles.historyItem}>
              <Text style={{ color: isDarkTheme ? '#fff' : '#000' }}>Conversation {index + 1}</Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

export default function ChatBot() {
  const [conversations, setConversations] = useState([{ messages: [] }]);
  const [currentChat, setCurrentChat] = useState(conversations[0]);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const toggleTheme = () => {
    setIsDarkTheme(prevTheme => !prevTheme);
  };

  const addMessageToHistory = (message) => {
    setCurrentChat(prevChat => {
      const updatedMessages = [...prevChat.messages, message];
      return { ...prevChat, messages: updatedMessages };
    });
  };

  const createNewChat = () => {
    const newChat = { messages: [] };
    setConversations(prevConversations => [...prevConversations, newChat]);
    setCurrentChat(newChat); // Switch to the new chat
  };

  return (
      <Drawer.Navigator
        drawerContent={(props) => (
          <CustomDrawerContent
            {...props}
            conversations={conversations}
            setCurrentChat={setCurrentChat}
            setConversations={setConversations}
            createNewChat={createNewChat}
            isDarkTheme={isDarkTheme}
          />
        )}
        screenOptions={{
          gestureEnabled: true,
          headerStyle: { backgroundColor: isDarkTheme ? '#1a1a1a' : '#fff' },
          headerTintColor: isDarkTheme ? '#fff' : '#000',
          drawerStyle: { backgroundColor: isDarkTheme ? '#1a1a1a' : '#fff' },
          headerRight: () => (
            <View style={styles.headerRightContainer}>
              <TouchableOpacity onPress={toggleTheme}>
                <Icon name={isDarkTheme ? 'sunny-outline' : 'moon-outline'} size={24} color={isDarkTheme ? '#fff' : '#000'} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.profileButton}>
                <Icon name="person-outline" size={24} color={isDarkTheme ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>
          ),
        }}
      >
        <Drawer.Screen name="Bot">
          {() => <ChatScreen key={currentChat} toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} addMessageToHistory={addMessageToHistory} currentChat={currentChat} />}
        </Drawer.Screen>
      </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  botContainer: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  chatArea: {
    padding: 10,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: '80%',
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
  },
  messageText: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  historyHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: 16,
    marginVertical: 10,
  },
  historyItem: {
    padding: 8,
    marginLeft: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  newChatButton: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 20,
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 16,
  },
  newChatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  drawerContent: {
    backgroundColor: '#1a1a1a',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  profileButton: {
    marginLeft: 15,
  },
});
