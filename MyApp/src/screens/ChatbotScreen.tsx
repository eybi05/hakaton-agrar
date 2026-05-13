import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';
import TokenBar from '../components/TokenBar';
import LangToggle from '../components/LangToggle';
import { useLanguage } from '../context/LanguageContext';

const { width } = Dimensions.get('window');

import { DEEPSEEK_API_KEY, DEEPSEEK_URL, DEEPSEEK_MODEL } from '../config/api';

const SYSTEM_PROMPT = `You are AgroBot, a friendly and knowledgeable agro-tourism assistant for Azerbaijan.
You help visitors discover farms, historical places, village tours, horse riding, camping, organic food experiences, local hotels, traditional foods, and nature activities across Azerbaijan.
Key locations you know well: Sheki, Gabala, Quba, Ganja, Masalli, Zagatala, Goychay, Lahij, Baku, Nakhchivan, Shamakhi.
Keep answers concise, warm, and practical. Use bullet points for lists. Include prices in Azerbaijani Manat (₼) or USD when relevant. Always encourage booking through the app.`;

// ── Types ─────────────────────────────────────────────────────────────────────
type Message = { id: string; text: string; from: 'user' | 'bot'; time: string };

// OpenAI-compatible message format (DeepSeek uses the same schema)
type ChatTurn = { role: 'user' | 'assistant'; content: string };

// ── Helpers ───────────────────────────────────────────────────────────────────
const getTime = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

const SUGGESTED = [
  'Best farms in Sheki?',
  'Horse riding near Gabala?',
  'Traditional food experiences?',
  'Camping spots in Azerbaijan?',
  'Historical places to visit?',
];

// ── Screen ────────────────────────────────────────────────────────────────────
export default function ChatbotScreen() {
  const { t } = useLanguage();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: t.chatbot.welcome,
      from: 'bot',
      time: getTime(),
    },
  ]);
  // Conversation history — grows with each exchange
  const [history, setHistory] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const scrollToBottom = () => scrollRef.current?.scrollToEnd({ animated: true });

  // ── Call DeepSeek API (OpenAI-compatible) ─────────────────────────────────
  const callAI = async (userText: string, currentHistory: ChatTurn[]): Promise<string> => {
    if (DEEPSEEK_API_KEY === 'YOUR_DEEPSEEK_API_KEY_HERE') {
      throw new Error('API key not set. Open ChatbotScreen.tsx and replace YOUR_DEEPSEEK_API_KEY_HERE with your DeepSeek key from https://platform.deepseek.com/api_keys');
    }

    const res = await fetch(DEEPSEEK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: DEEPSEEK_MODEL,
        messages: [
          { role: 'system',    content: SYSTEM_PROMPT },
          ...currentHistory,
          { role: 'user',      content: userText },
        ],
        max_tokens: 600,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as any)?.error?.message ?? `HTTP ${res.status}`);
    }

    const data = await res.json();
    const reply: string = data?.choices?.[0]?.message?.content ?? '';
    if (!reply.trim()) throw new Error('Empty response from DeepSeek');
    return reply.trim();
  };

  // ── Send message ────────────────────────────────────────────────────────────
  const send = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || isTyping) return;

    // Add user message to UI
    const userMsg: Message = { id: Date.now().toString(), text, from: 'user', time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(scrollToBottom, 100);

    try {
      const reply = await callAI(text, history);

      // Append bot reply to UI
      const botMsg: Message = { id: (Date.now() + 1).toString(), text: reply, from: 'bot', time: getTime() };
      setMessages((prev) => [...prev, botMsg]);

      // Extend history for next turn
      setHistory((prev) => [
        ...prev,
        { role: 'user',      content: text  },
        { role: 'assistant', content: reply },
      ]);
    } catch (err: any) {
      const errMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: `⚠️ Sorry, I couldn't reach the AI right now.\n${err.message}`,
        from: 'bot',
        time: getTime(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
      setTimeout(scrollToBottom, 100);
    }
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <LinearGradient colors={[COLORS.aiPurple, COLORS.aiLight]} style={styles.header}>
        <View style={[styles.hbubble, { width: 140, height: 140, top: -50, right: -30 }]} />
        <View style={styles.headerInner}>
          <LinearGradient colors={[COLORS.aiLight, COLORS.aiPurple]} style={styles.botAvatar}>
            <Ionicons name="leaf" size={20} color={COLORS.white} />
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{t.chatbot.title}</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>{t.chatbot.subtitle}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              setMessages([{
                id: '0',
                text: "Hi! I'm AgroBot 🌿\n\nNew conversation started. How can I help you explore Azerbaijan?",
                from: 'bot',
                time: getTime(),
              }]);
              setHistory([]);
            }}
            style={styles.clearBtn}
          >
            <Ionicons name="refresh-outline" size={18} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* ── Token bar ────────────────────────────────────────────────────── */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 6, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.divider }}>
        <View style={{ flex: 1 }}><TokenBar /></View>
        <LangToggle variant="dark" />
      </View>

      {/* ── Suggested prompts ───────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.suggestScroll}
        style={styles.suggestBar}
      >
        {SUGGESTED.map((s) => (
          <TouchableOpacity key={s} onPress={() => send(s)} style={styles.suggestChip} activeOpacity={0.75} disabled={isTyping}>
            <Text style={styles.suggestText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Messages + Input ────────────────────────────────────────────── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >

        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.msgList}
          onContentSizeChange={scrollToBottom}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.msgRow, msg.from === 'user' && styles.msgRowUser]}>
              {msg.from === 'bot' && (
                <LinearGradient colors={[COLORS.aiPurple, COLORS.aiLight]} style={styles.botIcon}>
                  <Ionicons name="leaf" size={13} color={COLORS.white} />
                </LinearGradient>
              )}
              <View style={[styles.bubble, msg.from === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
                <Text style={[styles.bubbleText, msg.from === 'user' && styles.bubbleTextUser]}>
                  {msg.text}
                </Text>
                <Text style={[styles.bubbleTime, msg.from === 'user' && styles.bubbleTimeUser]}>
                  {msg.time}
                </Text>
              </View>
            </View>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <View style={styles.msgRow}>
              <LinearGradient colors={[COLORS.aiPurple, COLORS.aiLight]} style={styles.botIcon}>
                <Ionicons name="leaf" size={13} color={COLORS.white} />
              </LinearGradient>
              <View style={styles.typingBubble}>
                <View style={styles.typingDots}>
                  <View style={[styles.typingDot, styles.typingDot1]} />
                  <View style={[styles.typingDot, styles.typingDot2]} />
                  <View style={[styles.typingDot, styles.typingDot3]} />
                </View>
              </View>
            </View>
          )}

          <View style={{ height: 8 }} />
        </ScrollView>

        {/* ── Input bar ────────────────────────────────────────────────── */}
        <View style={styles.inputBar}>
          <TextInput
            style={styles.input}
            placeholder={t.chatbot.placeholder}
            placeholderTextColor={COLORS.textLight}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => send()}
            returnKeyType="send"
            multiline
            editable={!isTyping}
          />
          <TouchableOpacity
            style={[styles.sendBtn, input.trim().length > 0 && !isTyping && styles.sendBtnActive]}
            onPress={() => send()}
            disabled={input.trim().length === 0 || isTyping}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isTyping ? 'hourglass-outline' : 'send'}
              size={16}
              color={input.trim().length > 0 && !isTyping ? COLORS.white : COLORS.textLight}
            />
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header: { paddingTop: 14, paddingHorizontal: 20, paddingBottom: 18, overflow: 'hidden' },
  hbubble: { position: 'absolute', borderRadius: 200, backgroundColor: 'rgba(255,255,255,0.08)' },
  headerInner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  botAvatar: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.white },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#2ECC71' },
  onlineText: { fontSize: 11, color: 'rgba(255,255,255,0.72)' },
  clearBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center', alignItems: 'center',
  },

  // Suggested prompts
  suggestBar: {
    maxHeight: 52,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1, borderBottomColor: COLORS.divider,
  },
  suggestScroll: { paddingHorizontal: 16, alignItems: 'center', gap: 8 },
  suggestChip: {
    paddingHorizontal: 14, paddingVertical: 7, borderRadius: 18,
    backgroundColor: COLORS.aiXLight, borderWidth: 1, borderColor: COLORS.aiLight + '40',
  },
  suggestText: { fontSize: 12, color: COLORS.aiLight, fontWeight: '600' },

  // Messages
  msgList: { padding: 16, gap: 12 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  msgRowUser: { flexDirection: 'row-reverse' },
  botIcon: {
    width: 30, height: 30, borderRadius: 15,
    justifyContent: 'center', alignItems: 'center',
  },
  bubble: { maxWidth: width * 0.74, borderRadius: 18, padding: 12, gap: 4 },
  bubbleBot: {
    backgroundColor: COLORS.card, borderBottomLeftRadius: 4,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 4, elevation: 1,
  },
  bubbleUser: { backgroundColor: COLORS.aiLight, borderBottomRightRadius: 4 },
  bubbleText: { fontSize: 14, color: COLORS.textDark, lineHeight: 21 },
  bubbleTextUser: { color: COLORS.white },
  bubbleTime: { fontSize: 10, color: COLORS.textLight, textAlign: 'right' },
  bubbleTimeUser: { color: 'rgba(255,255,255,0.6)' },

  // Typing animation
  typingBubble: {
    backgroundColor: COLORS.card, borderRadius: 18, borderBottomLeftRadius: 4,
    paddingHorizontal: 14, paddingVertical: 13,
  },
  typingDots: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  typingDot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: COLORS.aiLight,
  },
  typingDot1: { opacity: 0.35 },
  typingDot2: { opacity: 0.65 },
  typingDot3: { opacity: 1 },

  // Input bar
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    backgroundColor: COLORS.card,
    paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: COLORS.divider,
  },
  input: {
    flex: 1, backgroundColor: COLORS.cardAlt, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 14, color: COLORS.textDark, maxHeight: 110,
    borderWidth: 1, borderColor: COLORS.border,
  },
  sendBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: COLORS.divider,
    justifyContent: 'center', alignItems: 'center',
  },
  sendBtnActive: { backgroundColor: COLORS.aiLight },
});
