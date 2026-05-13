import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { COLORS } from '../theme/colors';

interface Props {
  /** 'dark'  → for light backgrounds (default)
   *  'light' → for dark/gradient headers */
  variant?: 'dark' | 'light';
}

export default function LangToggle({ variant = 'dark' }: Props) {
  const { lang, setLang } = useLanguage();
  const isLight = variant === 'light';
  const next = lang === 'en' ? 'az' : 'en';

  return (
    <TouchableOpacity
      style={[styles.pill, isLight ? styles.pillLight : styles.pillDark]}
      onPress={() => setLang(next)}
      activeOpacity={0.8}
    >
      <Text style={[styles.text, isLight ? styles.textLight : styles.textDark]}>
        {lang === 'en' ? '🇬🇧 EN' : '🇦🇿 AZ'}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  pillDark: {
    backgroundColor: COLORS.cardAlt,
    borderColor: COLORS.border,
  },
  pillLight: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderColor: 'rgba(255,255,255,0.35)',
  },
  text: { fontSize: 12, fontWeight: '700' },
  textDark:  { color: COLORS.textDark },
  textLight: { color: COLORS.white },
});
