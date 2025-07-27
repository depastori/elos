import React, { useState } from 'react';
import { Search, Send, MoreVertical, Phone, Video, Shield, Heart, Clock, Check, CheckCheck } from 'lucide-react';

interface User {
  id: string;
  name: string;
  email: string;
  isVerified: boolean;
}

interface PrivateMessagesProps {
  user: User;
}

type Contact = {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  isOnline: boolean;
  unreadCount: number;
  isVerified: boolean;
  avatar: string;
};

type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
};

const PrivateMessages: React.FC<PrivateMessagesProps> = ({ user }) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const contacts: Contact[] = [
    {
      id: '1',
      name: 'Ana Silva',
      lastMessage: 'Obrigada pelo apoio, estou me sentindo melhor',
      timestamp: '14:30',
      isOnline: true,
      unreadCount: 2,
      isVerified: true,
      avatar: 'A',
    },
    {
      id: '2',
      name: 'Carla Santos',
      lastMessage: 'Você conhece alguma advogada especializada?',
      timestamp: '12:15',
      isOnline: false,
      unreadCount: 0,
      isVerified: true,
      avatar: 'C',
    },
    {
      id: '3',
      name: 'Júlia Mendes',
      lastMessage: 'O grupo de apoio foi muito útil!',
      timestamp: 'Ontem',
      isOnline: true,
      unreadCount: 1,
      isVerified: false,
      avatar: 'J',
    },
  ];

  const messages: Message[] = [
    {
      id: '1',
      senderId: '1',
      content: 'Oi! Como você está se sentindo hoje?',
      timestamp: '14:25',
      status: 'read',
      type: 'text',
    },
    {
      id: '2',
      senderId: user.id,
      content: 'Estou melhor, obrigada por perguntar. O apoio de vocês tem sido fundamental.',
      timestamp: '14:27',
      status: 'delivered',
      type: 'text',
    },
    {
      id: '3',
      senderId: '1',
      content: 'Que bom! Lembre-se que estamos sempre aqui. Você é mais forte do que imagina 💜',
      timestamp: '14:30',
      status: 'read',
      type: 'text',
    },
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;
    
    // Aqui seria enviada a mensagem
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-12rem)] bg-white rounded-xl shadow-sm border border-gray-100 flex">
      {/* Contacts Sidebar */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Mensagens</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar conversas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map(contact => (
            <button
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`w-full p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
                selectedContact?.id === contact.id ? 'bg-purple-50 border-r-2 border-r-purple-500' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">{contact.avatar}</span>
                  </div>
                  {contact.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1">
                      <span className="font-medium text-gray-900 truncate">{contact.name}</span>
                      {contact.isVerified && (
                        <Shield className="h-3 w-3 text-green-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{contact.timestamp}</span>
                      {contact.unreadCount > 0 && (
                        <div className="w-5 h-5 bg-purple-500 text-white text-xs rounded-full flex items-center justify-center">
                          {contact.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">{selectedContact.avatar}</span>
                  </div>
                  {selectedContact.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900">{selectedContact.name}</span>
                    {selectedContact.isVerified && (
                      <Shield className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <span className="text-sm text-gray-500">
                    {selectedContact.isOnline ? 'Online' : 'Última vez há 2h'}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Phone className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <Video className="h-5 w-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.senderId === user.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <div className={`flex items-center justify-end space-x-1 mt-1 ${
                      message.senderId === user.id ? 'text-purple-200' : 'text-gray-500'
                    }`}>
                      <span className="text-xs">{message.timestamp}</span>
                      {message.senderId === user.id && (
                        <div>
                          {message.status === 'sent' && <Check className="h-3 w-3" />}
                          {message.status === 'delivered' && <CheckCheck className="h-3 w-3" />}
                          {message.status === 'read' && <CheckCheck className="h-3 w-3 text-blue-300" />}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Bem-vinda às Mensagens</h3>
              <p className="text-gray-600 max-w-sm">
                Selecione uma conversa para começar a trocar mensagens de apoio com outras mulheres da comunidade.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateMessages;