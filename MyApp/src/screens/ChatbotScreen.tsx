import React, { useState, useRef, useEffect } from 'react';
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
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../theme/colors';

const { width } = Dimensions.get('window');

type Message = { id: string; text: string; from: 'user' | 'bot'; time: string };

const SUGGESTED = [
  'Best farms in Sheki?',
  'Horse riding near Gabala?',
  'Traditional food experiences?',
  'Camping spots in Azerbaijan?',
  'Historical places to visit?',
  'Harvest season tours?',
];

const getTime = () => {
  const d = new Date();
  return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

const getResponse = (text: string): string => {
  const t = text.toLowerCase();
  if (t.includes('farm') || t.includes('organic')) {
    return "🌿 Top farms to visit:\n\n• Green Valley Farm (Sheki) — ₼45/person\n• Sunrise Orchard (Ganja) — ₼35/person\n• Pomegranate Estate (Goychay) — ₼50/person\n\nAll offer guided tours and tastings. Shall I help you book one?";
  }
  if (t.includes('horse') || t.includes('riding') || t.includes('ranch')) {
    return "🐴 Horse riding experiences:\n\n• Sunrise Horse Ranch (Gabala) — ₼60/person\n• Karabakh Stud Farm (Aghdam) — ₼80/person\n• Forest Trail Rides (Quba) — ₼45/person\n\nThe Karabakh is Azerbaijan's national horse — definitely worth experiencing!";
  }
  if (t.includes('food') || t.includes('eat') || t.includes('traditional') || t.includes('cuisine')) {
    return "🍽️ Must-try food experiences:\n\n• Piti Pottery Kitchen (Sheki) — clay pot lamb stew\n• Dolma & Bread Workshop (Qakh) — roll your own\n• Pakhlava Sweets Tour (Ganja) — hand-made pastries\n\nSheki is considered the culinary capital of Azerbaijani village cuisine!";
  }
  if (t.includes('camp') || t.includes('tent') || t.includes('glamp')) {
    return "⛺ Best camping spots:\n\n• Mountain Camp Site (Lahij) — ₼30/person\n• Riverside Wild Camp (Gabala) — ₼25/person\n• Eco Glamping Retreat (Guba) — ₼65/person\n• Stargazer Plateau (Nakhchivan) — ₼40/person\n\nThe Lahij site wakes you up to stunning mountain mist!";
  }
  if (t.includes('histor') || t.includes('ancient') || t.includes('palace') || t.includes('museum')) {
    return "🏛️ Azerbaijan's top historical sites:\n\n• Maiden Tower (Baku) — 12th century, UNESCO\n• Sheki Khan Palace — stunning stained glass\n• Gobustan Rock Art — 12,000 years old!\n• Ateshgah Fire Temple — eternal flame\n\nCheck the Historical Places tab to plan your visit.";
  }
  if (t.includes('harvest') || t.includes('season')) {
    return "🍎 Best harvest seasons:\n\n• Sept–Oct — Pomegranates (Goychay)\n• Aug–Sept — Hazelnuts (Zagatala)\n• Oct — Grapes (Shamakhi)\n• Jul–Aug — Apples (Quba)\n\nGoychay's Pomegranate Festival in October is unmissable!";
  }
  if (t.includes('hotel') || t.includes('stay') || t.includes('accommodation')) {
    return "🏨 Recommended stays:\n\n• Khan's Garden Inn (Sheki) — ₼85/night, historic caravanserai\n• Gabala Forest Lodge — ₼110/night, mountain views\n• Shamakhi Heritage Hotel — ₼70/night, boutique\n\nAll include traditional Azerbaijani breakfast!";
  }
  if (t.includes('hello') || t.includes('hi') || t.includes('hey')) {
    return "Hello! 👋 I'm AgroBot, your Azerbaijan agro-tourism assistant.\n\nI can help you find farms, historical sites, activities, and local experiences.\n\nWhat would you like to explore today?";
  }
  return "Great question! 😊 I'd suggest exploring our curated experiences:\n\n• 🌿 Farms & Orchards\n• 🏛️ Historical Places\n• 🐴 Horse Riding\n• ⛺ Camping & Nature\n• 🍽️ Traditional Food\n\nWhich of these interests you most?";
};

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm AgroBot 🌿\n\nYour personal Azerbaijan agro-tourism assistant. Ask me about farms, historical places, activities, food, and more!",
      from: 'bot',
      time: getTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [messages, isTyping]);

  const send = (text?: string) => {
    const msg = text ?? input.trim();
    if (!msg) return;

    const userMsg: Message = { id: Date.now().toString(), text: msg, from: 'user', time: getTime() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = { id: (Date.now() + 1).toString(), text: getResponse(msg), from: 'bot', time: getTime() };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1100 + Math.random() * 600);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* ── Header ───────────────────────────────────────────────────── */}
      <LinearGradient colors={[COLORS.aiPurple, COLORS.aiLight]} style={styles.header}>
        <View style={[styles.hbubble, { width: 140, height: 140, top: -50, right: -30 }]} />
        <View style={styles.headerInner}>
          <View style={styles.botAvatar}>
            <Ionicons name="leaf" size={20} color={COLORS.white} />
          </View>
          <View>
            <Text style={styles.headerTitle}>AgroBot</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>Online · Azerbaijan Tourism AI</Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* ── Suggested prompts ────────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.suggestScroll}
        style={styles.suggestBar}
      >
        {SUGGESTED.map((s) => (
          <TouchableOpacity key={s} onPress={() => send(s)} style={styles.suggestChip} activeOpacity={0.75}>
            <Text style={styles.suggestText}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ── Messages ─────────────────────────────────────────────────── */}
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.msgList}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={[styles.msgRow, msg.from === 'user' && styles.msgRowUser]}>
              {msg.from === 'bot' && (
                <LinearGradient colors={[COLORS.aiPurple, COLORS.aiLight]} style={styles.botIcon}>
                  <Ionicons name="leaf" size={14} color={COLORS.white} />
                </LinearGradient>
              )}
              <View style={[styles.bubble, msg.from === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
                <Text style={[styles.bubbleText, msg.from === 'user' && styles.bubbleTextUser]}>{msg.text}</Text>
                <Text style={[styles.bubbleTime, msg.from === 'user' && styles.bubbleTimeUser]}>{msg.time}</Text>
              </View>
            </View>
          ))}

          {isTyping && (
            <View style={styles.msgRow}>
              <LinearGradient colors={[COLORS.aiPurple, COLORS.aiLight]} style={styles.botIcon}>
                <Ionicons name="leaf" size={14} color={COLORS.white} />
              </LinearGradient>
              <View style={styles.typingBubble}>
                <View style={styles.typingDots}>
                  <View style={[styles.typingDot, { opacity: 0.4 }]} />
                  <View style={[styles.typingDot, { opacity: 0.65 }]} />
                  <View style={[styles.typingDot, { opacity: 1 }]} />
                </View>
              </View>
            </View>
          )}

          <View style={{ height: 8 }} />
        </ScrollView>

        {/* ── Input bar ───────────────────────────────────────────────── */}
        <View style={styles.inputBar}>
          <TouchableOpacity style={styles.micBtn}>
            <Ionicons name="mic-outline" size={20} color={COLORS.aiLight} />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Ask about farms, places, activities…"
            placeholderTextColor={COLORS.textLight}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={() => send()}
            returnKeyType="send"
            multiline
          />
          <TouchableOpacity
            style={[styles.sendBtn, input.trim().length > 0 && styles.sendBtnActive]}
            onPress={() => send()}
            disabled={input.trim().length === 0}
            activeOpacity={0.8}
          >
            <Ionicons name="send" size={16} color={input.trim().length > 0 ? COLORS.white : COLORS.textLight} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },

  // Header
  header: { paddingTop: 14, paddingHorizontal: 20, paddingBottom: 18, overflow: 'hidden' },
  hbubble: { position: 'absolute', borderRadius: 200, backgroundColor: 'rgba(255,255,255,0.08)' },
  headerInner: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  botAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)',
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: COLORS.white },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  onlineDot: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#2ECC71' },
  onlineText: { fontSize: 11, color: 'rgba(255,255,255,0.75)' },

  // Suggested
  suggestBar: { maxHeight: 52, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.divider },
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
  botIcon: { width: 30, height: 30, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  bubble: { maxWidth: width * 0.72, borderRadius: 18, padding: 12, gap: 4 },
  bubbleBot: {
    backgroundColor: COLORS.card, borderBottomLeftRadius: 4,
    shadowColor: COLORS.shadow, shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1, shadowRadius: 4, elevation: 1,
  },
  bubbleUser: {
    backgroundColor: COLORS.aiLight, borderBottomRightRadius: 4,
  },
  bubbleText: { fontSize: 14, color: COLORS.textDark, lineHeight: 20 },
  bubbleTextUser: { color: COLORS.white },
  bubbleTime: { fontSize: 10, color: COLORS.textLight, textAlign: 'right' },
  bubbleTimeUser: { color: 'rgba(255,255,255,0.65)' },

  // Typing
  typingBubble: {
    backgroundColor: COLORS.card, borderRadius: 18, borderBottomLeftRadius: 4,
    paddingHorizontal: 14, paddingVertical: 12,
  },
  typingDots: { flexDirection: 'row', gap: 5, alignItems: 'center' },
  typingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.aiLight },

  // Input bar
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 10,
    backgroundColor: COLORS.card, paddingHorizontal: 16, paddingVertical: 12,
    borderTopWidth: 1, borderTopColor: COLORS.divider,
  },
  micBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.aiXLight,
    justifyContent: 'center', alignItems: 'center',
  },
  input: {
    flex: 1, backgroundColor: COLORS.cardAlt, borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 14, color: COLORS.textDark, maxHeight: 100,
    borderWidth: 1, borderColor: COLORS.border,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: COLORS.divider,
    justifyContent: 'center', alignItems: 'center',
  },
  sendBtnActive: { backgroundColor: COLORS.aiLight },
});
