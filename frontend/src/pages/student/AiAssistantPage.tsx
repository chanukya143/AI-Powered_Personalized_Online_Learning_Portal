import React, { useState, useRef, useEffect } from 'react';
import {
  BotMessageSquare,
  Send,
  Sparkles,
  HelpCircle,
  Map,
  BookOpen,
  Info,
  User as UserIcon,
} from 'lucide-react';
import { aiService } from '../../services/aiService';
import { getApiErrorMessage } from '../../services/apiClient';
import { PageHeader } from '../../components/common/PageHeader';
import { NeoCard } from '../../components/common/NeoCard';
import { NeoButton } from '../../components/common/NeoButton';
import { NeoInput } from '../../components/common/NeoInput';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  suggestedFollowups?: string[];
  timestamp: Date;
}

export const AiAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'assistant',
      text: "👋 Hello! I am your AI Learning Assistant. You can ask me to explain any complex software architecture concept, generate practice challenge questions, or map out an engineering career roadmap.",
      suggestedFollowups: [
        'Explain Java Virtual Threads and Project Loom',
        'Generate practice questions on Spring Security',
        'Create a learning roadmap for Full-Stack Development',
      ],
      timestamp: new Date(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string, mode: 'general' | 'concept_explainer' | 'practice_questions' | 'roadmap' = 'general') => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await aiService.chat({
        message: text,
        mode,
      });

      setDemoMode(response.demoMode);

      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: response.reply,
        suggestedFollowups: response.suggestedFollowups,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: unknown) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: `⚠️ ${getApiErrorMessage(err)}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="AI Learning Assistant"
        subtitle="Your real-time engineering tutor for deep technical comprehension and self-assessment."
        action={
          demoMode ? (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.35rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                backgroundColor: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.35)',
                color: 'var(--neo-warning)',
                fontSize: '0.78rem',
                fontWeight: 600,
              }}
            >
              <Info size={14} />
              Operating in Local Demo Mode
            </div>
          ) : null
        }
      />

      {/* Mode Shortcut Bar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
        <NeoButton
          variant="neutral"
          size="sm"
          onClick={() => handleSendMessage('Give me practice challenge questions', 'practice_questions')}
          icon={<HelpCircle size={15} color="var(--neo-primary)" />}
        >
          Practice Challenge
        </NeoButton>
        <NeoButton
          variant="neutral"
          size="sm"
          onClick={() => handleSendMessage('Map out a full-stack career roadmap', 'roadmap')}
          icon={<Map size={15} color="var(--neo-secondary)" />}
        >
          Engineering Roadmap
        </NeoButton>
        <NeoButton
          variant="neutral"
          size="sm"
          onClick={() => handleSendMessage('Explain how polymorphism works in Java', 'concept_explainer')}
          icon={<BookOpen size={15} color="var(--neo-accent-coral)" />}
        >
          Explain OOP & Polymorphism
        </NeoButton>
      </div>

      {/* Chat Window Frame */}
      <NeoCard
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '620px',
          padding: '1.5rem',
          borderRadius: 'var(--radius-xl)',
        }}
      >
        {/* Messages Scroll Area */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            paddingRight: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.85rem',
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                }}
              >
                {!isUser && (
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--neo-primary)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(91, 103, 241, 0.4)',
                      flexShrink: 0,
                    }}
                  >
                    <BotMessageSquare size={18} />
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-lg)',
                      backgroundColor: isUser ? 'var(--neo-primary)' : 'var(--neo-surface)',
                      color: isUser ? '#FFFFFF' : 'var(--neo-text)',
                      boxShadow: isUser
                        ? '0 4px 12px rgba(91, 103, 241, 0.3)'
                        : 'var(--neo-raised-sm)',
                      border: isUser
                        ? '1px solid rgba(255, 255, 255, 0.25)'
                        : '1px solid rgba(255, 255, 255, 0.7)',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {msg.text}
                  </div>

                  {/* Follow-up suggestions (assistant only) */}
                  {!isUser && msg.suggestedFollowups && msg.suggestedFollowups.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.25rem' }}>
                      {msg.suggestedFollowups.map((followup, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(followup)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid rgba(91, 103, 241, 0.35)',
                            backgroundColor: 'var(--neo-surface)',
                            color: 'var(--neo-primary)',
                            boxShadow: 'var(--neo-raised-sm)',
                            cursor: 'pointer',
                          }}
                        >
                          {followup}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--neo-surface)',
                      color: 'var(--neo-text)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--neo-raised-sm)',
                      flexShrink: 0,
                    }}
                  >
                    <UserIcon size={18} />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--neo-primary)',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BotMessageSquare size={18} />
              </div>
              <div
                style={{
                  padding: '0.85rem 1.25rem',
                  borderRadius: 'var(--radius-lg)',
                  backgroundColor: 'var(--neo-surface)',
                  boxShadow: 'var(--neo-raised-sm)',
                  fontSize: '0.9rem',
                  color: 'var(--neo-text-muted)',
                  fontStyle: 'italic',
                }}
              >
                Formulating intelligent answer...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputMessage);
          }}
          style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'center',
            paddingTop: '0.75rem',
            borderTop: '1px solid rgba(163, 177, 198, 0.3)',
          }}
        >
          <NeoInput
            placeholder="Ask anything about software architecture, code snippets, or study plans..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
          />
          <NeoButton
            type="submit"
            variant="primary"
            size="md"
            disabled={!inputMessage.trim() || isLoading}
            icon={<Send size={18} />}
          >
            Send
          </NeoButton>
        </form>
      </NeoCard>
    </div>
  );
};
