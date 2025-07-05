import React, { useState } from 'react';
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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const mockConversations = [
  {
    id: '1',
    name: 'Pet Shelter',
    lastMessage: 'Congratulations! Your adoption request for Bella has been approved.',
    messages: [
      {
        id: 'm1',
        sender: 'Pet Shelter',
        text: 'Congratulations! Your adoption request for Bella has been approved.',
        date: '2025-07-05',
      },
      {
        id: 'm2',
        sender: 'You',
        text: 'Thank you so much!',
        date: '2025-07-05',
      },
    ],
  },
  {
    id: '2',
    name: 'Support',
    lastMessage: 'Welcome to PetApp. How can we help you?',
    messages: [
      {
        id: 'm1',
        sender: 'Support',
        text: 'Welcome to PetApp. How can we help you?',
        date: '2025-07-04',
      },
    ],
  },
];

export default function InboxScreen() {
  const [conversations, setConversations] = useState(mockConversations);
  const [selectedConversation, setSelectedConversation] = useState(conversations[0] || null);
  const [newMessage, setNewMessage] = useState('');
  const [showNewChat, setShowNewChat] = useState(false);
  const [recipient, setRecipient] = useState('');
  const [initialMsg, setInitialMsg] = useState('');

  const handleOpenChat = (conv) => setSelectedConversation(conv);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        const newMsg = {
          id: `m${conv.messages.length + 1}`,
          sender: 'You',
          text: newMessage,
          date: new Date().toISOString().slice(0, 10),
        };
        return {
          ...conv,
          lastMessage: newMessage,
          messages: [...conv.messages, newMsg],
        };
      }
      return conv;
    });
    setConversations(updatedConversations);
    setSelectedConversation(
      updatedConversations.find(c => c.id === selectedConversation.id)
    );
    setNewMessage('');
  };

  // --- New Chat Logic ---
  const handleCreateChat = () => {
    if (!recipient.trim() || !initialMsg.trim()) return;
    const newConv = {
      id: `${Date.now()}`,
      name: recipient,
      lastMessage: initialMsg,
      messages: [
        {
          id: 'm1',
          sender: 'You',
          text: initialMsg,
          date: new Date().toISOString().slice(0, 10),
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

  const renderConversation = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.messageCard,
        selectedConversation?.id === item.id && styles.selectedCard,
      ]}
      onPress={() => handleOpenChat(item)}
    >
      <View style={{ flex: 1 }}>
        <Text style={styles.subject}>{item.name}</Text>
        <Text style={styles.sender} numberOfLines={1}>{item.lastMessage}</Text>
      </View>
      <Ionicons name="chatbubble-ellipses-outline" size={22} color={Colors.PRIMARY} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerText}>Inbox</Text>
        <TouchableOpacity style={styles.composeBtn} onPress={() => setShowNewChat(true)}>
          <Ionicons name="create-outline" size={22} color={Colors.PRIMARY} />
        </TouchableOpacity>
      </View>
      <View style={styles.flexRow}>
        {/* Conversation List */}
        <View style={styles.conversationList}>
          {conversations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="mail-open-outline" size={60} color="#bbb" />
              <Text style={styles.emptyText}>No conversations yet</Text>
            </View>
          ) : (
            <FlatList
              data={conversations}
              keyExtractor={item => item.id}
              renderItem={renderConversation}
              contentContainerStyle={{ padding: 8 }}
            />
          )}
        </View>
        {/* Chat Section */}
        <View style={styles.chatSection}>
          {selectedConversation ? (
            <>
              <View style={styles.chatHeader}>
                <Text style={styles.chatTitle}>{selectedConversation.name}</Text>
              </View>
              <FlatList
                data={selectedConversation.messages}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.chatBubble,
                      item.sender === 'You'
                        ? styles.chatBubbleRight
                        : styles.chatBubbleLeft,
                    ]}
                  >
                    <Text style={styles.chatSender}>{item.sender}</Text>
                    <Text style={styles.chatText}>{item.text}</Text>
                    <Text style={styles.chatDate}>{item.date}</Text>
                  </View>
                )}
                contentContainerStyle={{ padding: 16 }}
              />
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={80}
              >
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.input}
                    placeholder="Type your message..."
                    value={newMessage}
                    onChangeText={setNewMessage}
                  />
                  <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                    <Ionicons name="send" size={22} color="#fff" />
                  </TouchableOpacity>
                </View>
              </KeyboardAvoidingView>
            </>
          ) : (
            <View style={styles.emptyChat}>
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
              placeholder="Recipient (e.g. Pet Shelter, Support)"
              value={recipient}
              onChangeText={setRecipient}
            />
            <TextInput
              style={[styles.modalInput, { height: 60 }]}
              placeholder="Initial message"
              value={initialMsg}
              onChangeText={setInitialMsg}
              multiline
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12 }}>
              <TouchableOpacity onPress={() => setShowNewChat(false)} style={styles.cancelBtn}>
                <Text style={{ color: Colors.PRIMARY }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCreateChat} style={styles.createBtn}>
                <Text style={{ color: '#fff' }}>Create</Text>
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
  container: { flex: 1, backgroundColor: Colors.BACKGROUND },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    justifyContent: 'space-between',
  },
  headerText: { fontSize: 22, fontWeight: 'bold', color: '#222' },
  composeBtn: {
    backgroundColor: '#F0F6FF',
    padding: 8,
    borderRadius: 8,
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
  selectedCard: {
    backgroundColor: '#F0F6FF',
  },
  messageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    position: 'relative',
  },
  subject: { fontWeight: 'bold', fontSize: 16, color: '#222' },
  sender: { color: '#555', fontSize: 13, marginTop: 2 },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#bbb',
    fontSize: 18,
    marginTop: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  chatTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.PRIMARY },
  chatBubble: {
    maxWidth: '80%',
    marginBottom: 14,
    padding: 10,
    borderRadius: 12,
    backgroundColor: '#F0F6FF',
  },
  chatBubbleLeft: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0F6FF',
  },
  chatBubbleRight: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  chatSender: {
    fontWeight: 'bold',
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  chatText: {
    fontSize: 15,
    color: '#222',
  },
  chatDate: {
    fontSize: 11,
    color: '#888',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 15,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  sendBtn: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyChat: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    width: '85%',
    elevation: 5,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#222',
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 15,
    backgroundColor: '#F8FAFC',
  },
  cancelBtn: {
    padding: 10,
    marginRight: 10,
  },
  createBtn: {
    backgroundColor: Colors.PRIMARY,
    padding: 10,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
});