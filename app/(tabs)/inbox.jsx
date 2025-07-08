import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
  Modal,
  Alert,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const mockConversations = [
  {
    id: '1',
    name: 'Pet Shelter',
    lastMessage: 'Congratulations! Your adoption request for Bella has been approved.',
    isOnline: true,
    lastSeen: 'now',
    avatar: '🏠',
    unread: false,
    messages: [
      {
        id: 'm1',
        sender: 'Pet Shelter',
        text: 'Congratulations! Your adoption request for Bella has been approved.',
        date: '2025-07-05',
        time: '10:30 AM',
        type: 'text',
        status: 'read',
      },
      {
        id: 'm2',
        sender: 'You',
        text: 'Thank you so much!',
        date: '2025-07-05',
        time: '10:32 AM',
        type: 'text',
        status: 'read',
      },
      {
        id: 'm3',
        sender: 'Pet Shelter',
        text: 'Would you like to schedule a pickup time for Bella?',
        date: '2025-07-05',
        time: '10:33 AM',
        type: 'quick_reply',
        status: 'read',
        quickReplies: ['Yes, schedule pickup', 'I need more time', 'Call me instead'],
      },
    ],
  },
  {
    id: '2',
    name: 'Support',
    lastMessage: 'Welcome to PetApp. How can we help you?',
    isOnline: false,
    lastSeen: '2 hours ago',
    avatar: '🎧',
    unread: true,
    messages: [
      {
        id: 'm1',
        sender: 'Support',
        text: 'Welcome to PetApp. How can we help you?',
        date: '2025-07-04',
        time: '2:15 PM',
        type: 'text',
        status: 'read',
      },
    ],
  },
  {
    id: '3',
    name: 'Bella\'s Owner',
    lastMessage: 'Hi! I saw you\'re interested in adopting Bella...',
    isOnline: true,
    lastSeen: 'now',
    avatar: '👤',
    unread: false,
    messages: [
      {
        id: 'm1',
        sender: 'Bella\'s Owner',
        text: 'Hi! I saw you\'re interested in adopting Bella. She\'s a wonderful dog!',
        date: '2025-07-05',
        time: '3:20 PM',
        type: 'text',
        status: 'read',
      },
      {
        id: 'm2',
        sender: 'You',
        text: 'Yes, I\'d love to know more about her!',
        date: '2025-07-05',
        time: '3:22 PM',
        type: 'text',
        status: 'read',
      },
      {
        id: 'm3',
        sender: 'Bella\'s Owner',
        text: 'Great! What would you like to know?',
        date: '2025-07-05',
        time: '3:23 PM',
        type: 'quick_reply',
        status: 'read',
        quickReplies: ['Bella\'s personality', 'Health records', 'Care requirements', 'Meeting arrangement'],
      },
    ],
  },
];

// Auto-response system for chat bot
const botResponses = {
  'Bella\'s personality': 'Bella is very friendly and energetic! She loves playing fetch and is great with children. She\'s house-trained and knows basic commands like sit, stay, and come.',
  'Health records': 'Bella is up to date on all vaccinations and has been spayed. She had a recent check-up and is in excellent health. I can share her medical records with you.',
  'Care requirements': 'Bella needs daily walks (about 30-45 minutes), regular grooming every 6-8 weeks, and she eats twice daily. She\'s used to a routine and does well with consistency.',
  'Meeting arrangement': 'I\'d be happy to arrange a meeting! I\'m available weekends and weekday evenings. We could meet at a local park so Bella can show you her playful side!',
  'Yes, schedule pickup': 'Perfect! I\'m available this Saturday or Sunday between 10 AM - 4 PM. What works best for you?',
  'I need more time': 'No problem at all! Take your time to prepare. Just let me know when you\'re ready. Bella will be waiting for you!',
  'Call me instead': 'Of course! You can reach me at (555) 123-4567. I\'m usually available between 9 AM - 7 PM.',
};

export default function InboxScreen() {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState(conversations[0] || null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [initialMsg, setInitialMsg] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);

  // Calculate unread count
  const unreadCount = conversations.filter(conv => conv.unread).length;

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (flatListRef.current && selectedConversation?.messages) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [selectedConversation?.messages]);

  // Animate new message indicator
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: unreadCount > 0 ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [unreadCount]);

  const handleOpenChat = (conv) => {
    setSelectedConversation(conv);
    // Mark as read
    const updatedConversations = conversations.map(c => 
      c.id === conv.id ? { ...c, unread: false } : c
    );
    setConversations(updatedConversations);
  };

  const simulateBotResponse = (message) => {
    if (selectedConversation?.name.includes('Owner') || selectedConversation?.name.includes('Support')) {
      setIsTyping(true);
      
      setTimeout(() => {
        let response = "Thanks for your message! I'll get back to you soon.";
        
        // Check for specific responses
        if (botResponses[message]) {
          response = botResponses[message];
        } else if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
          response = "Hello! How can I help you today?";
        } else if (message.toLowerCase().includes('thank')) {
          response = "You're very welcome! Is there anything else I can help you with?";
        } else if (message.toLowerCase().includes('when') || message.toLowerCase().includes('time')) {
          response = "I'm flexible with timing. What works best for your schedule?";
        }

        const botMessage = {
          id: `m${Date.now()}`,
          sender: selectedConversation.name,
          text: response,
          date: new Date().toISOString().slice(0, 10),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
          status: 'sent',
        };

        // Add quick replies for certain responses
        if (selectedConversation.name.includes('Owner')) {
          botMessage.quickReplies = ['Tell me more', 'Sounds good!', 'I have questions'];
        }

        const updatedConversations = conversations.map(conv => {
          if (conv.id === selectedConversation.id) {
            return {
              ...conv,
              lastMessage: response,
              messages: [...conv.messages, botMessage],
            };
          }
          return conv;
        });
        
        setConversations(updatedConversations);
        setSelectedConversation(
          updatedConversations.find(c => c.id === selectedConversation.id)
        );
        setIsTyping(false);
      }, 1500 + Math.random() * 1000); // Random delay to feel more natural
    }
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    
    const userMessage = {
      id: `m${Date.now()}`,
      sender: 'You',
      text: newMessage,
      date: new Date().toISOString().slice(0, 10),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      status: 'sent',
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        return {
          ...conv,
          lastMessage: newMessage,
          messages: [...conv.messages, userMessage],
        };
      }
      return conv;
    });
    
    setConversations(updatedConversations);
    setSelectedConversation(
      updatedConversations.find(c => c.id === selectedConversation.id)
    );
    
    const messageToBot = newMessage;
    setNewMessage('');
    setShowEmojiPicker(false);
    
    // Simulate bot response
    simulateBotResponse(messageToBot);
  };

  const handleQuickReply = (reply) => {
    setNewMessage(reply);
    setTimeout(() => handleSend(), 100);
  };

  const handleCreateChat = () => {
    if (!recipient.trim() || !initialMsg.trim()) return;
    
    const newConv = {
      id: `${Date.now()}`,
      name: recipient,
      lastMessage: initialMsg,
      isOnline: Math.random() > 0.5,
      lastSeen: Math.random() > 0.5 ? 'now' : '5 minutes ago',
      avatar: '💬',
      unread: false,
      messages: [
        {
          id: 'm1',
          sender: 'You',
          text: initialMsg,
          date: new Date().toISOString().slice(0, 10),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'text',
          status: 'sent',
        },
      ],
    };
    
    const updatedConvs = [newConv, ...conversations];
    setConversations(updatedConvs);
    setSelectedConversation(newConv);
    setShowNewChat(false);
    setRecipient('');
    setInitialMsg('');
  };

  const deleteConversation = (convId) => {
    Alert.alert(
      'Delete Conversation',
      'Are you sure you want to delete this conversation?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const updatedConvs = conversations.filter(conv => conv.id !== convId);
            setConversations(updatedConvs);
            if (selectedConversation?.id === convId) {
              setSelectedConversation(updatedConvs[0] || null);
            }
          },
        },
      ]
    );
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const emojis = ['😊', '😂', '❤️', '👍', '🙏', '😍', '🎉', '👏', '🔥', '💯', '🐕', '🐱', '🏠', '💝'];

  const renderMessage = ({ item }) => {
    const isUser = item.sender === 'You';
    
    return (
      <View style={styles.messageContainer}>
        <View
          style={[
            styles.chatBubble,
            isUser ? styles.chatBubbleRight : styles.chatBubbleLeft,
          ]}
        >
          {!isUser && (
            <Text style={styles.chatSender}>{item.sender}</Text>
          )}
          <Text style={[
            styles.chatText,
            isUser && styles.chatTextRight,
          ]}>
            {item.text}
          </Text>
          <View style={styles.messageFooter}>
            <Text style={[styles.chatTime, isUser && styles.chatTimeRight]}>
              {item.time}
            </Text>
            {isUser && (
              <Ionicons 
                name={item.status === 'read' ? 'checkmark-done' : 'checkmark'} 
                size={12} 
                color={item.status === 'read' ? Colors.PRIMARY : '#999'}
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
        </View>
        
        {/* Quick Reply Buttons */}
        {item.quickReplies && !isUser && (
          <View style={styles.quickRepliesContainer}>
            {item.quickReplies.map((reply, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickReplyButton}
                onPress={() => handleQuickReply(reply)}
              >
                <Text style={styles.quickReplyText}>{reply}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.messageCard,
        selectedConversation?.id === item.id && styles.selectedCard,
      ]}
      onPress={() => handleOpenChat(item)}
    >
      <View style={styles.avatarContainer}>
        <Text style={styles.avatar}>{item.avatar}</Text>
        <View style={[
          styles.onlineIndicator,
          { backgroundColor: item.isOnline ? '#4CAF50' : '#999' }
        ]} />
      </View>
      <View style={styles.conversationInfo}>
        <View style={styles.conversationHeader}>
          <Text style={styles.subject}>{item.name}</Text>
          <Text style={styles.lastSeen}>{item.lastSeen}</Text>
        </View>
        <Text style={styles.sender} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
      <View style={styles.conversationActions}>
        <Ionicons name="chatbubble-ellipses-outline" size={20} color={Colors.PRIMARY} />
        {item.unread && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>●</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerText}>Inbox</Text>
          {unreadCount > 0 && (
            <Animated.View style={[styles.unreadIndicator, { opacity: fadeAnim }]}>
              <Text style={styles.unreadCount}>{unreadCount}</Text>
            </Animated.View>
          )}
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.headerBtn} 
            onPress={() => setShowSearch(!showSearch)}
          >
            <Ionicons name="search-outline" size={22} color={Colors.PRIMARY} />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerBtn} 
            onPress={() => setShowNewChat(true)}
          >
            <Ionicons name="create-outline" size={22} color={Colors.PRIMARY} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      {showSearch && (
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      )}

      <View style={styles.flexRow}>
        {/* Conversation List */}
        <View style={styles.conversationList}>
          {filteredConversations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="mail-open-outline" size={60} color="#bbb" />
              <Text style={styles.emptyText}>
                {searchQuery ? 'No conversations found' : 'No conversations yet'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={filteredConversations}
              keyExtractor={item => item.id}
              renderItem={renderConversation}
              contentContainerStyle={{ padding: 8 }}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Chat Section */}
        <View style={styles.chatSection}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <View style={styles.chatHeader}>
                <View style={styles.chatHeaderLeft}>
                  <Text style={styles.avatar}>{selectedConversation.avatar}</Text>
                  <View>
                    <Text style={styles.chatTitle}>{selectedConversation.name}</Text>
                    <Text style={styles.chatStatus}>
                      {selectedConversation.isOnline ? 'Online' : `Last seen ${selectedConversation.lastSeen}`}
                    </Text>
                  </View>
                </View>
                <View style={styles.chatHeaderRight}>
                  <TouchableOpacity style={styles.headerBtn}>
                    <Ionicons name="call-outline" size={22} color={Colors.PRIMARY} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.headerBtn}>
                    <Ionicons name="videocam-outline" size={22} color={Colors.PRIMARY} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.headerBtn}
                    onPress={() => deleteConversation(selectedConversation.id)}
                  >
                    <Ionicons name="trash-outline" size={22} color="#d00" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Messages */}
              <FlatList
                ref={flatListRef}
                data={selectedConversation.messages}
                keyExtractor={item => item.id}
                renderItem={renderMessage}
                contentContainerStyle={{ padding: 16 }}
                showsVerticalScrollIndicator={false}
              />

              {/* Typing Indicator */}
              {isTyping && (
                <View style={styles.typingIndicator}>
                  <View style={styles.typingBubble}>
                    <ActivityIndicator size="small" color={Colors.PRIMARY} />
                    <Text style={styles.typingText}>{selectedConversation.name} is typing...</Text>
                  </View>
                </View>
              )}

              {/* Input Area */}
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={80}
              >
                <View style={styles.inputContainer}>
                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <View style={styles.emojiPicker}>
                      {emojis.map((emoji, index) => (
                        <TouchableOpacity
                          key={index}
                          style={styles.emojiButton}
                          onPress={() => setNewMessage(prev => prev + emoji)}
                        >
                          <Text style={styles.emojiText}>{emoji}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                  
                  <View style={styles.inputRow}>
                    <TouchableOpacity 
                      style={styles.inputBtn}
                      onPress={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <Ionicons name="happy-outline" size={22} color={Colors.PRIMARY} />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.input}
                      placeholder="Type your message..."
                      value={newMessage}
                      onChangeText={setNewMessage}
                      multiline
                      maxLength={500}
                    />
                    <TouchableOpacity style={styles.inputBtn}>
                      <Ionicons name="attach-outline" size={22} color={Colors.PRIMARY} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.sendBtn, !newMessage.trim() && styles.sendBtnDisabled]} 
                      onPress={handleSend}
                      disabled={!newMessage.trim()}
                    >
                      <Ionicons name="send" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </>
          ) : (
            <View style={styles.emptyChat}>
              <Ionicons name="chatbubbles-outline" size={80} color="#ddd" />
              <Text style={styles.emptyText}>Select a conversation to start chatting</Text>
            </View>
          )}
        </View>
      </View>

      {/* New Chat Modal */}
      <Modal
        visible={showNewChat}
        animationType="slide"
        transparent
        onRequestClose={() => setShowNewChat(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>New Conversation</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Recipient (e.g. Pet Owner, Veterinarian)"
              value={recipient}
              onChangeText={setRecipient}
            />
            <TextInput
              style={[styles.modalInput, { height: 80 }]}
              placeholder="Write your message..."
              value={initialMsg}
              onChangeText={setInitialMsg}
              multiline
              textAlignVertical="top"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                onPress={() => setShowNewChat(false)} 
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleCreateChat} 
                style={[styles.createBtn, (!recipient.trim() || !initialMsg.trim()) && styles.createBtnDisabled]}
                disabled={!recipient.trim() || !initialMsg.trim()}
              >
                <Text style={styles.createText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const screenWidth = Dimensions.get('window').width;
const isLargeScreen = screenWidth > 700;

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.BACKGROUND 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    color: '#222' 
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerBtn: {
    backgroundColor: '#F0F6FF',
    padding: 8,
    borderRadius: 8,
    marginLeft: 8,
  },
  unreadIndicator: {
    backgroundColor: '#FF4444',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadCount: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#eee',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  flexRow: {
    flex: 1,
    flexDirection: isLargeScreen ? 'row' : 'column',
  },
  conversationList: {
    width: isLargeScreen ? 320 : '100%',
    borderRightWidth: isLargeScreen ? 1 : 0,
    borderRightColor: '#eee',
    backgroundColor: '#fff',
    minHeight: 200,
  },
  chatSection: {
    flex: 1,
    backgroundColor: Colors.BACKGROUND,
    minHeight: 200,
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 1,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  selectedCard: {
    backgroundColor: '#F0F6FF',
    borderWidth: 1,
    borderColor: Colors.PRIMARY,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    fontSize: 24,
    width: 40,
    height: 40,
    textAlign: 'center',
    lineHeight: 40,
    backgroundColor: '#F0F6FF',
    borderRadius: 20,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#fff',
  },
  conversationInfo: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  subject: { 
    fontWeight: 'bold', 
    fontSize: 16, 
    color: '#222' 
  },
  lastSeen: {
    fontSize: 12,
    color: '#999',
  },
  sender: { 
    color: '#666', 
    fontSize: 14 
  },
  conversationActions: {
    alignItems: 'center',
  },
  unreadBadge: {
    marginTop: 4,
  },
  unreadText: {
    color: Colors.PRIMARY,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    color: '#bbb',
    fontSize: 16,
    marginTop: 12,
    textAlign: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chatHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chatTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: Colors.PRIMARY,
    marginLeft: 12,
  },
  chatStatus: {
    fontSize: 12,
    color: '#666',
    marginLeft: 12,
  },
  chatHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messageContainer: {
    marginBottom: 16,
  },
  chatBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    backgroundColor: '#F0F6FF',
  },
  chatBubbleLeft: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F6FF',
    borderBottomLeftRadius: 4,
  },
  chatBubbleRight: {
    alignSelf: 'flex-end',
    backgroundColor: Colors.PRIMARY,
    borderBottomRightRadius: 4,
  },
  chatSender: {
    fontWeight: 'bold',
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  chatText: {
    fontSize: 16,
    color: '#222',
    lineHeight: 20,
  },
  chatTextRight: {
    color: '#fff',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  chatTime: {
    fontSize:10,
color: '#666',
},
chatTimeRight: {
color: 'rgba(255,255,255,0.7)',
},
quickRepliesContainer: {
flexDirection: 'row',
flexWrap: 'wrap',
marginTop: 8,
marginLeft: 8,
},
quickReplyButton: {
backgroundColor: '#E3F2FD',
borderRadius: 16,
paddingVertical: 6,
paddingHorizontal: 12,
marginRight: 8,
marginBottom: 8,
},
quickReplyText: {
color: Colors.PRIMARY,
fontSize: 14,
},
typingIndicator: {
marginBottom: 16,
alignItems: 'flex-start',
},
typingBubble: {
flexDirection: 'row',
alignItems: 'center',
backgroundColor: '#F0F6FF',
padding: 8,
borderRadius: 16,
borderBottomLeftRadius: 4,
},
typingText: {
color: '#666',
fontSize: 12,
marginLeft: 4,
},
inputContainer: {
backgroundColor: Colors.WHITE,
padding: 8,
borderTopWidth: 1,
borderTopColor: '#eee',
},
emojiPicker: {
flexDirection: 'row',
flexWrap: 'wrap',
backgroundColor: '#fff',
padding: 8,
borderTopWidth: 1,
borderTopColor: '#eee',
maxHeight: 200,
},
emojiButton: {
padding: 8,
},
emojiText: {
fontSize: 24,
},
inputRow: {
flexDirection: 'row',
alignItems: 'center',
},
inputBtn: {
padding: 8,
},
input: {
flex: 1,
backgroundColor: '#F5F5F5',
borderRadius: 20,
paddingHorizontal: 16,
paddingVertical: 10,
marginHorizontal: 8,
maxHeight: 120,
},
sendBtn: {
backgroundColor: Colors.PRIMARY,
borderRadius: 20,
padding: 10,
},
sendBtnDisabled: {
backgroundColor: '#ccc',
},
emptyChat: {
flex: 1,
alignItems: 'center',
justifyContent: 'center',
},
modalOverlay: {
flex: 1,
backgroundColor: 'rgba(0,0,0,0.5)',
justifyContent: 'center',
alignItems: 'center',
},
modalContent: {
backgroundColor: '#fff',
width: '90%',
maxWidth: 500,
borderRadius: 16,
padding: 24,
},
modalTitle: {
fontSize: 20,
fontWeight: 'bold',
marginBottom: 20,
color: '#222',
textAlign: 'center',
},
modalInput: {
backgroundColor: '#F5F5F5',
borderRadius: 12,
padding: 16,
marginBottom: 16,
fontSize: 16,
},
modalButtons: {
flexDirection: 'row',
justifyContent: 'flex-end',
marginTop: 16,
},
cancelBtn: {
padding: 12,
marginRight: 12,
},
cancelText: {
color: '#666',
fontSize: 16,
},
createBtn: {
backgroundColor: Colors.PRIMARY,
borderRadius: 12,
padding: 12,
paddingHorizontal: 24,
},
createBtnDisabled: {
backgroundColor: '#ccc',
},
createText: {
color: '#fff',
fontSize: 16,
fontWeight: 'bold',
},
});