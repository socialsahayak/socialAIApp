import React, { useState, useRef, useEffect } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,

} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
import { useUser } from '../context/UserContext';

const chatEventEmitter = { 
  listeners: new Set(), 
  emit() { this.listeners.forEach(listener => listener()); }, 
  subscribe(listener) { 
      this.listeners.add(listener); 
      return () => this.listeners.delete(listener); 
  } 
};

function ChatScreen({ route, navigation, toggleTheme, isDarkTheme }) {
  const { sessionId } = route.params || {};
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef();
  const {user, token, logout}=useUser();
  useEffect(() => {
    if (sessionId) {
      setIsLoading(true);
      console.log(sessionId);
      axios.get(`http://192.168.51.90:5001/conversations/session/${sessionId}`)
        .then(response => {
          if (response.data && response.data.length > 0) {
            const formattedMessages = response.data[0].messages.map(msg => ({
              type: msg.sender === 'user' ? 'user' : 'bot',
              text: msg.message
            }));
            setMessages(formattedMessages);
          }
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching chat messages:', error);
          setIsLoading(false);
          Alert.alert('Error', 'Failed to load chat history');
        });
    } else {
      setMessages([]);
      setIsLoading(false);
    }
  }, [sessionId]);
  
  const handleSend = async () => {
    if (message.trim()) {
      const userMessage = { type: 'user', text: message };
      setMessages(prevMessages => [...prevMessages, userMessage]);
      const currentMessage = message;
      setMessage('');
      setIsSending(true);
      setIsBotTyping(true);

      try {
        console.log(user.email);
        const response = await axios.post(`http://192.168.51.90:5001/process_question/${user.email}`, {
          question: currentMessage,
          sessionId: sessionId,

        });

        if (!sessionId && response.data.sessionId) {
          navigation.setParams({ sessionId: response.data.sessionId });
          // Emit event to update chat history
          chatEventEmitter.emit();
        }

        const botResponseLines = response.data.answer.split("\n");
        for (let i = 0; i < botResponseLines.length; i++) {
          if (botResponseLines[i].trim()) {
            await new Promise(resolve => setTimeout(resolve, 2000));
            const botReply = { type: 'bot', text: botResponseLines[i] };
            setMessages(prevMessages => [...prevMessages, botReply]);
          }
        }
        chatEventEmitter.emit();
      } catch (error) {
        console.error('Error fetching response:', error);
        const errorMessage = { type: 'bot', text: 'Something went wrong. Please try again later.' };
        setMessages(prevMessages => [...prevMessages, errorMessage]);
      } finally {
        setIsSending(false);
        setIsBotTyping(false);
        useEffect(() => {
          fetchConversations(); // Fetch chat history on mount
          const unsubscribe = chatEventEmitter.subscribe(fetchChatHistory); // Subscribe to event
          return () => unsubscribe(); // Clean up subscription
      }, [sessionId]);
      
      }
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageBubble,
      item.type === 'user' ? styles.userMessage : styles.botMessage
    ]}>
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDarkTheme ? '#000' : '#fff' }]}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <View
      style={[styles.botContainer, { backgroundColor: isDarkTheme ? '#000' : '#fff' }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{...styles.messagesList,paddingBottom:20}}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={true}
            initialNumToRender={20}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews={true}
            style={styles.flatList}
          />
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: isDarkTheme ? '#1a1a1a' : '#f9f9f9', color: isDarkTheme ? '#fff' : '#000' }
              ]}
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor={isDarkTheme ? '#888' : '#555'}
              editable={!isSending}
            />
            <TouchableOpacity
              style={[styles.sendButton, { opacity: isSending || !message.trim() ? 0.5 : 1 }]}
              onPress={handleSend}
              disabled={isSending || !message.trim()}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
}

function CustomDrawerContent(props) {
  const { isDarkTheme, navigation } = props;
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const {user, token, logout}=useUser();
  console.log(user.email);
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await axios.get(`http://192.168.51.90:5001/user/conversations/${user.email}`);
        setConversations(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching conversations:', error);
        setLoading(false);
        Alert.alert('Error', 'Unable to load conversations. Please try again later.');
      }
    };
    fetchConversations();
    const unsubscribe = chatEventEmitter.subscribe(() => {
      fetchConversations();
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const createNewChat = async () => {
    // Create a new chat without sending a request to the backend for session creation
    navigation.navigate('Bot', { sessionId: null }); // Pass null to indicate a new chat
    navigation.closeDrawer();
    // Reset conversations to reflect the new chat
   
        
};

  const deleteConversation = (sessionId) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`http://192.168.51.90:5001/conversations/session/${sessionId}`);
              setConversations(prev => 
                prev.filter(conv => conv.session_id !== sessionId)
              );
            } catch (error) {
              console.error('Error deleting conversation:', error);
              Alert.alert('Error', 'Failed to delete conversation. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => {
        navigation.navigate('Bot', { 
          sessionId: item.session_id 
        });
        navigation.closeDrawer();
      }}
      onLongPress={() => deleteConversation(item.session_id)}
    >
      <View style={styles.conversationItemContainer}>
        <Icon 
          name="chatbubble-outline" 
          size={20} 
          color={isDarkTheme ? '#fff' : '#000'} 
          style={styles.chatIcon}
        />
        <Text style={[
          styles.conversationTitle, 
          { color: isDarkTheme ? '#fff' : '#000' }
        ]}>
          {item.title || `Conversation ${item.session_id}`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: isDarkTheme ? '#1a1a1a' : '#fff' }]}>
         <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <DrawerContentScrollView style={[styles.drawerContent, { backgroundColor: isDarkTheme ? '#1a1a1a' : '#fff' }]}>
      <Text style={[styles.historyHeader, { color: isDarkTheme ? '#fff' : '#000' }]}>
        Chat History
      </Text>
      <TouchableOpacity style={styles.newChatButton} onPress={createNewChat}>
        <Icon name="add-outline" size={24} color="#fff" style={styles.newChatIcon} />
        <Text style={styles.newChatButtonText}>New Chat</Text>
      </TouchableOpacity>
      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.session_id.toString()}
        contentContainerStyle={styles.conversationsList}
      />
    </DrawerContentScrollView>
  );
}

const Drawer = createDrawerNavigator();

export default function ChatBot() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const toggleTheme = () => {
    setIsDarkTheme(prevTheme => !prevTheme);
  };

  return (
    <Drawer.Navigator
      drawerContent={(props) => (
        <CustomDrawerContent
          {...props}
          isDarkTheme={isDarkTheme}
        />
      )}
      screenOptions={({navigation})=>({
        gestureEnabled: true,
        headerStyle: { backgroundColor: isDarkTheme ? '#1a1a1a' : '#fff' ,elevation:0,shadowOpacity:0 },
        headerTintColor: isDarkTheme ? '#fff' : '#000',
        drawerStyle: { backgroundColor: isDarkTheme ? '#1a1a1a' : '#fff',width:'60%' },
        headerRight: () => (
          <View style={styles.headerRightContainer}>
            <TouchableOpacity onPress={toggleTheme}>
              <Icon 
                name={isDarkTheme ? 'sunny-outline' : 'moon-outline'} 
                size={24} 
                color={isDarkTheme ? '#fff' : '#000'} 
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('UserSettings')}>
              <Icon 
                name="person-outline" 
                size={24} 
                color={isDarkTheme ? '#fff' : '#000'} 
              />
            </TouchableOpacity>
          </View>
        ),
      })}
    >
      <Drawer.Screen 
        name="Bot"
        component={ChatScreen}
        initialParams={{ sessionId: null }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  botContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  flatList: {
    flex: 1,
  },
  messagesList: {
    padding: 10,
    paddingBottom: 20,
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
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: 'transparent',
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderColor: '#555',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#007bff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignSelf: 'flex-end',
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  drawerContent: {
    flex: 1,
  },
  historyHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 16,
  },
  historyItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  conversationItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  chatIcon: {
    marginRight: 10,
  },
  conversationTitle: {
    flex: 1,
    fontSize: 16,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007bff',
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  newChatIcon: {
    marginRight: 8,
  },
  newChatButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  profileButton: {
    marginLeft: 15,
  },
  conversationsList: {
    flexGrow: 1,
  },
})