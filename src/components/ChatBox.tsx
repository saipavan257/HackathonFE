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
// Import competitor insights data
import aetnaData from '../data/aetna_nuro.json';
import anthemData from '../data/anthem_nuro.json';
import humanaData from '../data/humana_nuro.json';
import cignaData from '../data/Cigna_competitor.json';
import uhcData from '../data/UHC_competitor.json';

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
      text: 'Hello! I can help you analyze competitor insights and find coverage information. You can ask me questions like:\n• "Which insurer has more coverage for Abecma?"\n• "What brands are associated with Multiple myeloma?"\n• "Compare coverage for Abecma across insurers"\n• "Show all drugs covered by Aetna"\n• "Which insurer has easiest access for Adakveo?"',
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

  // Process competitor insights data for detailed analysis
  const competitorInsightsData = React.useMemo(() => {
    const allData = [
      ...aetnaData.map((item: any) => ({ ...item, insurer: 'Aetna' })),
      ...anthemData.map((item: any) => ({ ...item, insurer: 'Anthem' })),
      ...humanaData.map((item: any) => ({ ...item, insurer: 'Humana' })),
      ...cignaData.map((item: any) => ({ ...item, insurer: 'Cigna' })),
      ...uhcData.map((item: any) => ({ ...item, insurer: 'UHC' })),
    ];
    
    return allData;
  }, []);

  const analyzeCompetitorInsights = (drugName: string) => {
    const lowerDrugName = drugName.toLowerCase();
    
    // Find all entries for the specified drug across all insurers
    const drugEntries = competitorInsightsData.filter(item => {
      const brandName = item.brand_name || item['Brand Name'] || '';
      return brandName.toLowerCase().includes(lowerDrugName);
    });
    
    if (drugEntries.length === 0) {
      return `I couldn't find coverage information for "${drugName}" in our competitor insights data. Try checking the spelling or ask about another drug.`;
    }
    
    // Analyze coverage by insurer
    const coverageAnalysis = drugEntries.reduce((acc: any, entry: any) => {
      const insurer = entry.insurer || entry.Insurer;
      const priorAuthField = entry.prior_authorization_required || entry['Prior Authorisation/Medical necessity/notification'];
      const stepTherapyField = entry.step_therapy_required;
      const brandName = entry.brand_name || entry['Brand Name'];
      const indication = entry.indication;
      const clinicalCriteria = entry.clinical_criteria;
      const labelPopulation = entry.label_population || entry['Label Population'];
      
      if (!acc[insurer]) {
        acc[insurer] = {
          covered: true,
          prior_auth: priorAuthField === 'Yes',
          step_therapy: stepTherapyField === 'Yes',
          indication: indication,
          brand_name: brandName,
          criteria: clinicalCriteria || 'Standard criteria apply',
          population_coverage: labelPopulation || 'Standard population',
          easier_access: priorAuthField !== 'Yes' && stepTherapyField !== 'Yes'
        };
      }
      return acc;
    }, {});
    
    const insurers = Object.keys(coverageAnalysis);
    const coveredInsurers = insurers.filter(insurer => coverageAnalysis[insurer].covered);
    const priorAuthRequired = insurers.filter(insurer => coverageAnalysis[insurer].prior_auth);
    const stepTherapyRequired = insurers.filter(insurer => coverageAnalysis[insurer].step_therapy);
    const easierAccess = insurers.filter(insurer => coverageAnalysis[insurer].easier_access);
    
    let response = `📊 **Competitor Analysis for ${coverageAnalysis[insurers[0]].brand_name}**\n\n`;
    response += `🏥 **Coverage:** ${coveredInsurers.length}/${insurers.length} insurers cover this drug\n`;
    response += `📋 **Covered by:** ${coveredInsurers.join(', ')}\n\n`;
    
    // Special analysis for Adakveo VOC criteria
    if (lowerDrugName === 'adakveo') {
      response += `🎯 **Population Coverage Differences:**\n`;
      response += `• **Cigna**: Allows ≥1 VOC in 12 months (easier initial access)\n`;
      response += `• **UHC/Others**: Typically require ≥2 VOCs in 12 months\n\n`;
      response += `🏆 **Recommendation**: Cigna offers easier access with lower VOC threshold\n\n`;
    }
    
    if (priorAuthRequired.length > 0) {
      response += `⚠️ **Prior Authorization Required:** ${priorAuthRequired.join(', ')}\n`;
    }
    
    if (stepTherapyRequired.length > 0) {
      response += `🔄 **Step Therapy Required:** ${stepTherapyRequired.join(', ')}\n`;
    }
    
    response += `\n💡 **Indication:** ${coverageAnalysis[insurers[0]].indication}`;
    
    // Determine which insurer has "easier access"
    if (easierAccess.length > 0) {
      response += `\n\n🎯 **Easiest Access:** ${easierAccess.join(', ')} (minimal barriers)`;
    } else {
      response += `\n\n⚠️ **All insurers require prior authorization or have specific restrictions for this drug.`;
    }
    
    return response;
  };

  const searchData = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    // Check for "how many indications" type queries
    if (lowerQuery.includes('how many indication') || lowerQuery.includes('cover how many indication')) {
      const drugMatch = lowerQuery.match(/(\w+)\s+(?:cover\s+)?how many indication/);
      const insurerMatch = lowerQuery.match(/in\s+(\w+)/);
      
      if (drugMatch && insurerMatch) {
        const drugName = drugMatch[1];
        const insurerName = insurerMatch[1].toUpperCase();
        
        // Find entries for this drug and insurer
        const drugEntries = competitorInsightsData.filter(item => {
          const brandName = item.brand_name || item['Brand Name'] || '';
          const itemInsurer = (item.insurer || item.Insurer || '').toUpperCase();
          return brandName.toLowerCase().includes(drugName.toLowerCase()) && 
                 itemInsurer === insurerName;
        });
        
        if (drugEntries.length > 0) {
          const indications = new Set<string>();
          
          drugEntries.forEach(entry => {
            const labelPop = entry.label_population || entry['Label Population'] || '';
            
            // Extract specific cancer types and indications
            if (labelPop.includes('cervical cancer')) indications.add('Cervical cancer');
            if (labelPop.includes('colorectal cancer')) indications.add('Colorectal cancer');
            if (labelPop.includes('non-small cell lung cancer')) indications.add('Non-small cell lung carcinoma');
            if (labelPop.includes('ovarian cancer') || labelPop.includes('epithelial ovarian') || 
                labelPop.includes('fallopian tube') || labelPop.includes('peritoneal cancer')) {
              indications.add('Ovarian cancer');
            }
            if (labelPop.includes('renal cell carcinoma')) indications.add('Renal cell carcinoma');
            if (labelPop.includes('glioblastoma')) indications.add('Glioblastoma');
          });
          
          const indicationList = Array.from(indications).sort();
          let response = `**${drugName} covers ${indicationList.length} indications in ${insurerName}:**\n\n`;
          indicationList.forEach(indication => {
            response += `• ${indication}\n`;
          });
          
          return response;
        }
      }
    }
    
    // Check for population coverage comparison queries
    if ((lowerQuery.includes('compare population coverage') || lowerQuery.includes('population coverage')) && lowerQuery.includes('across insurers')) {
      const drugMatch = lowerQuery.match(/(?:coverage for |for )(\w+)/);
      
      if (drugMatch) {
        const drugName = drugMatch[1];
        
        // Find entries for this drug across all insurers
        const drugEntries = competitorInsightsData.filter(item => {
          const brandName = item.brand_name || item['Brand Name'] || '';
          return brandName.toLowerCase().includes(drugName.toLowerCase());
        });
        
        if (drugEntries.length > 0) {
          let response = `**Population Coverage Comparison for ${drugName} across insurers:**\n\n`;
          
          const insurerData: { [key: string]: string[] } = {};
          
          drugEntries.forEach(entry => {
            const insurer = entry.insurer || entry.Insurer || 'Unknown';
            const labelPop = entry.label_population || entry['Label Population'] || '';
            
            if (!insurerData[insurer]) {
              insurerData[insurer] = [];
            }
            
            // Extract key population criteria
            if (labelPop.includes('adult patients')) insurerData[insurer].push('Adults');
            if (labelPop.includes('pediatric') || labelPop.includes('children')) insurerData[insurer].push('Pediatric');
            if (labelPop.includes('relapsed or refractory')) insurerData[insurer].push('Relapsed/Refractory');
            if (labelPop.includes('after two or more prior lines')) insurerData[insurer].push('≥2 prior therapies');
            if (labelPop.includes('first-line') || labelPop.includes('newly diagnosed')) insurerData[insurer].push('First-line');
            if (labelPop.includes('metastatic')) insurerData[insurer].push('Metastatic disease');
          });
          
          Object.keys(insurerData).forEach(insurer => {
            const uniqueCriteria = [...new Set(insurerData[insurer])];
            response += `**${insurer}:**\n`;
            uniqueCriteria.forEach(criteria => {
              response += `  • ${criteria}\n`;
            });
            response += '\n';
          });
          
          return response;
        }
      }
    }
    
    // Search for coverage by active ingredient
    if (lowerQuery.includes('active ingredient') || lowerQuery.includes('drug with name')) {
      const activeIngredientMatch = lowerQuery.match(/active ingredient is (\w+)/);
      const treatmentMatch = lowerQuery.match(/treating (\w+(?:\s+\w+)*)/);
      
      if (activeIngredientMatch) {
        const activeIngredient = activeIngredientMatch[1];
        const treatment = treatmentMatch ? treatmentMatch[1] : '';
        
        // Find drugs with this active ingredient
        const matchingDrugs = competitorInsightsData.filter(item => {
          const itemActiveIngredient = item.active_ingredient || item['Active Ingredient'] || item.inn_name || '';
          const labelPop = item.label_population || item['Label Population'] || '';
          const indication = item.indication || '';
          
          const hasActiveIngredient = itemActiveIngredient.toLowerCase().includes(activeIngredient.toLowerCase());
          const hasMatchingTreatment = treatment ? 
            (labelPop.toLowerCase().includes(treatment.toLowerCase()) || 
             indication.toLowerCase().includes(treatment.toLowerCase())) : true;
          
          return hasActiveIngredient && hasMatchingTreatment;
        });
        
        if (matchingDrugs.length > 0) {
          let response = `**Coverage for drugs with active ingredient "${activeIngredient}"`;
          if (treatment) response += ` treating ${treatment}`;
          response += `:**\n\n`;
          
          const coverageByInsurer: { [key: string]: string[] } = {};
          
          matchingDrugs.forEach(drug => {
            const insurer = drug.insurer || drug.Insurer || 'Unknown';
            const brandName = drug.brand_name || drug['Brand Name'] || 'Unknown';
            
            if (!coverageByInsurer[insurer]) {
              coverageByInsurer[insurer] = [];
            }
            if (!coverageByInsurer[insurer].includes(brandName)) {
              coverageByInsurer[insurer].push(brandName);
            }
          });
          
          Object.keys(coverageByInsurer).forEach(insurer => {
            response += `**${insurer}**: Yes - ${coverageByInsurer[insurer].join(', ')}\n`;
          });
          
          // Check if all major insurers are covered
          const coveredInsurers = Object.keys(coverageByInsurer);
          const majorInsurers = ['UHC', 'Aetna', 'Humana', 'Anthem', 'Cigna'];
          const missingInsurers = majorInsurers.filter(insurer => 
            !coveredInsurers.some(covered => covered.toUpperCase().includes(insurer))
          );
          
          if (missingInsurers.length > 0) {
            response += `\n**Not found in**: ${missingInsurers.join(', ')} (may not be in dataset)`;
          }
          
          return response;
        } else {
          return `I couldn't find any drugs with active ingredient "${activeIngredient}" in our dataset. Please check the spelling or try a different active ingredient.`;
        }
      }
    }
    
    // Enhanced competitor insights analysis for coverage questions
    if (lowerQuery.includes('coverage') || lowerQuery.includes('insurer') || lowerQuery.includes('compare') || lowerQuery.includes('easier access')) {
      // Try to extract drug name from query - check common drug names first
      const commonDrugs = [
        'abecma', 'adakveo', 'alymsys', 'elrexfio', 'amvuttra', 'adzynma',
        'tecvayli', 'carvykti', 'breyanzi', 'yescarta', 'kymriah', 'tecartus', 'polivy', 'monjuvi'
      ];
      
      let mentionedDrug = commonDrugs.find(drug => lowerQuery.includes(drug));
      
      if (mentionedDrug) {
        return analyzeCompetitorInsights(mentionedDrug);
      }
      
      // Try to extract drug name from any word in the query (for less common drugs)
      const words = lowerQuery.split(/\s+/);
      for (const word of words) {
        if (word.length > 3) { // Skip short words
          const drugMatch = competitorInsightsData.find(item => {
            const brandName = item.brand_name || item['Brand Name'] || '';
            return brandName.toLowerCase().includes(word);
          });
          if (drugMatch) {
            return analyzeCompetitorInsights(word);
          }
        }
      }
      
      // If no specific drug found but asking about coverage
      if (lowerQuery.includes('coverage') || lowerQuery.includes('compare')) {
        return `I can help you analyze drug coverage! Please mention a specific drug name. For example:\n• "Which insurer covers Abecma?"\n• "Compare Abecma coverage across insurers"\n• "Easiest access for Adakveo?"\n\nAvailable drugs include: Abecma, Alymsys, Adakveo, Elrexfio, Amvuttra, Adzynma and many more.`;
      }
    }

    // Search by indication (e.g., "Non-small cell lung carcinoma", "Multiple myeloma")
    if (lowerQuery.includes('indication') || lowerQuery.includes('brands covered for') || lowerQuery.includes('cancer') || lowerQuery.includes('myeloma') || lowerQuery.includes('carcinoma')) {
      const indicationMatches = competitorInsightsData.filter(item => {
        const indication = item.indication || '';
        const labelPop = item.label_population || item['Label Population'] || '';
        return indication.toLowerCase().includes(lowerQuery.split('for ')[1]?.split(' in ')[0] || '') ||
               labelPop.toLowerCase().includes(lowerQuery.split('for ')[1]?.split(' in ')[0] || '');
      });
      
      if (indicationMatches.length > 0) {
        const uniqueBrands = [...new Set(indicationMatches.map(item => 
          item.brand_name || item['Brand Name']
        ))].filter(Boolean);
        
        // Extract specific insurers if mentioned
        const mentionedInsurers = ['uhc', 'aetna', 'anthem', 'cigna', 'humana'].filter(insurer => 
          lowerQuery.includes(insurer)
        );
        
        if (mentionedInsurers.length > 0) {
          const filteredBrands = indicationMatches
            .filter(item => mentionedInsurers.includes((item.insurer || item.Insurer || '').toLowerCase()))
            .map(item => item.brand_name || item['Brand Name'])
            .filter(Boolean);
          
          const uniqueFilteredBrands = [...new Set(filteredBrands)];
          return `Brands covered for the specified indication in ${mentionedInsurers.map(i => i.toUpperCase()).join(' and ')}: ${uniqueFilteredBrands.join(', ')}`;
        }
        
        const indication = indicationMatches[0].indication || 'the specified indication';
        return `For ${indication}, available brands include: ${uniqueBrands.slice(0, 10).join(', ')}${uniqueBrands.length > 10 ? ` and ${uniqueBrands.length - 10} more` : ''}.`;
      }
    }

    // Search by INN/Active ingredient (e.g., "Elranatamab")
    if (lowerQuery.includes('inn is') || lowerQuery.includes('active ingredient') || lowerQuery.includes('elranatamab')) {
      const innMatches = competitorInsightsData.filter(item => {
        const activeIngredient = item.active_ingredient || item['Active Ingredient'] || '';
        return lowerQuery.includes('elranatamab') && activeIngredient.toLowerCase().includes('elranatamab');
      });
      
      if (innMatches.length > 0) {
        const coveringInsurers = [...new Set(innMatches.map(item => item.insurer || item.Insurer))];
        const brandName = innMatches[0].brand_name || innMatches[0]['Brand Name'];
        return `Yes! ${brandName} (Elranatamab) for Multiple myeloma is covered by: ${coveringInsurers.join(', ')}. All major insurers provide coverage for this indication.`;
      }
    }
    
    // Search for brand coverage using the original data
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
            <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
              <Chip 
                label="Which insurer covers Abecma?" 
                size="small" 
                variant="outlined" 
                onClick={() => setInputValue("Which insurer has more coverage for Abecma?")}
                sx={{ cursor: 'pointer' }}
              />
              <Chip 
                label="Compare Abecma coverage" 
                size="small" 
                variant="outlined" 
                onClick={() => setInputValue("Compare coverage for Abecma across insurers")}
                sx={{ cursor: 'pointer' }}
              />
              <Chip 
                label="Easiest access for Adakveo?" 
                size="small" 
                variant="outlined" 
                onClick={() => setInputValue("Which insurer has easiest access for Adakveo?")}
                sx={{ cursor: 'pointer' }}
              />
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
