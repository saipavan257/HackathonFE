import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Fab,
  Paper,
  Chip,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Send as SendIcon,
  Close as CloseIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import brandCoverageData from '../data/brand_coverage_analysis.json';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBoxProps {
  isVisible?: boolean;
}

const ChatBox: React.FC<ChatBoxProps> = ({ isVisible = true }) => {
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I can help you find information about brands, coverage, drugs, and insurers. You can ask me questions like:\n• "Which insurer covers Drug X?"\n• "What brands are associated with Indication Y?"\n• "Show all drugs covered by Insurer Z"',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Process the coverage data for searching
  const processedData = React.useMemo(() => {
    return brandCoverageData.map((item: any) => ({
      brand_name: item.brand_name,
      indication: item.indication,
      indicated_population: item.indicated_population,
      insurers: {
        uhc: item.uhc,
        aetna: item.aetna,
        anthem: item.anthem,
        hcsc: item.hcsc,
        cigna: item.cigna,
        humana: item.humana,
      },
    }));
  }, []);

  const searchData = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Search for brand coverage
    if (lowerQuery.includes('which insurer') || lowerQuery.includes('who covers')) {
      const brandMatch = processedData.find(item => 
        lowerQuery.includes(item.brand_name.toLowerCase())
      );
      
      if (brandMatch) {
        const coveredInsurers = Object.entries(brandMatch.insurers)
          .filter(([_, coverage]) => coverage === 'Yes')
          .map(([insurer, _]) => insurer.toUpperCase());
        
        return `${brandMatch.brand_name} is covered by: ${coveredInsurers.join(', ')}. It's indicated for ${brandMatch.indication}.`;
      }
    }
    
    // Search for drugs by indication
    if (lowerQuery.includes('indication') || lowerQuery.includes('disease') || lowerQuery.includes('condition')) {
      const indicationMatches = processedData.filter(item =>
        lowerQuery.includes(item.indication.toLowerCase())
      );
      
      if (indicationMatches.length > 0) {
        const uniqueBrands = [...new Set(indicationMatches.map(item => item.brand_name))];
        const indication = indicationMatches[0].indication;
        return `For ${indication}, the available brands include: ${uniqueBrands.slice(0, 5).join(', ')}${uniqueBrands.length > 5 ? ` and ${uniqueBrands.length - 5} more` : ''}.`;
      }
    }
    
    // Search by insurer
    const insurerKeywords = ['uhc', 'aetna', 'anthem', 'hcsc', 'cigna', 'humana'];
    const mentionedInsurer = insurerKeywords.find(insurer => 
      lowerQuery.includes(insurer)
    );
    
    if (mentionedInsurer) {
      const coveredDrugs = processedData.filter(item => 
        item.insurers[mentionedInsurer as keyof typeof item.insurers] === 'Yes'
      );
      
      if (coveredDrugs.length > 0) {
        const uniqueBrands = [...new Set(coveredDrugs.map(item => item.brand_name))];
        return `${mentionedInsurer.toUpperCase()} covers ${coveredDrugs.length} drug records including brands like: ${uniqueBrands.slice(0, 5).join(', ')}${uniqueBrands.length > 5 ? ` and ${uniqueBrands.length - 5} more` : ''}.`;
      }
    }
    
    // General search
    const generalMatches = processedData.filter(item =>
      item.brand_name.toLowerCase().includes(lowerQuery) ||
      item.indication.toLowerCase().includes(lowerQuery) ||
      item.indicated_population.toLowerCase().includes(lowerQuery)
    );
    
    if (generalMatches.length > 0) {
      const match = generalMatches[0];
      const coveredInsurers = Object.entries(match.insurers)
        .filter(([_, coverage]) => coverage === 'Yes')
        .map(([insurer, _]) => insurer.toUpperCase());
      
      return `Found: ${match.brand_name} for ${match.indication}. Covered by: ${coveredInsurers.join(', ')}.`;
    }
    
    return "I couldn't find specific information for that query. Try asking about specific brands, indications, or insurers. For example: 'Which insurer covers Abecma?' or 'What drugs are available for Multiple myeloma?'";
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError(null);

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = searchData(inputValue);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      setError('Sorry, I encountered an error processing your request.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setError(null);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Action Button */}
      <Fab
        color="primary"
        aria-label="chatbot"
        onClick={toggleChat}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1000,
          backgroundColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#1565c0',
            transform: 'scale(1.1)',
          },
          transition: 'all 0.3s ease-in-out',
          boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
        }}
      >
        <ChatIcon />
      </Fab>

      {/* Chat Dialog */}
      <Dialog
        open={isOpen}
        onClose={toggleChat}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            height: '600px',
            display: 'flex',
            flexDirection: 'column'
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: '#1976d2', 
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <BotIcon />
            <Typography variant="h6">Insurance Data Assistant</Typography>
          </Box>
          <IconButton onClick={toggleChat} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          padding: 0
        }}>
          {/* Messages Area */}
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto', 
            padding: 2,
            backgroundColor: '#f5f5f5'
          }}>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  mb: 2
                }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start',
                  gap: 1,
                  maxWidth: '80%'
                }}>
                  {message.sender === 'bot' && (
                    <Avatar sx={{ bgcolor: '#1976d2', width: 32, height: 32 }}>
                      <BotIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}
                  
                  <Paper sx={{
                    p: 2,
                    backgroundColor: message.sender === 'user' ? '#1976d2' : 'white',
                    color: message.sender === 'user' ? 'white' : 'black',
                    borderRadius: 2,
                    whiteSpace: 'pre-line'
                  }}>
                    <Typography variant="body2">
                      {message.text}
                    </Typography>
                  </Paper>

                  {message.sender === 'user' && (
                    <Avatar sx={{ bgcolor: '#666', width: 32, height: 32 }}>
                      <PersonIcon sx={{ fontSize: 16 }} />
                    </Avatar>
                  )}
                </Box>
              </Box>
            ))}
            
            {isLoading && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: theme.palette.primary.main }}>
                  <BotIcon />
                </Avatar>
                <Paper sx={{ p: 1.5, borderRadius: 2 }}>
                  <CircularProgress size={20} />
                </Paper>
              </Box>
            )}
            
            <div ref={messagesEndRef} />
          </Box>
          
          {error && (
            <Alert severity="error" sx={{ m: 1 }}>
              {error}
            </Alert>
          )}
          
          {/* Input Area */}
          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid #e0e0e0',
            backgroundColor: 'white'
          }}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <Chip label="Brands" size="small" variant="outlined" />
              <Chip label="Coverage" size="small" variant="outlined" />
              <Chip label="Insurers" size="small" variant="outlined" />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
              <TextField
                fullWidth
                multiline
                maxRows={3}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about insurers, brands, coverage, HCPCS codes..."
                variant="outlined"
                size="small"
              />
              <IconButton
                color="primary"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                sx={{ minWidth: 'auto', px: 2 }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChatBox;
