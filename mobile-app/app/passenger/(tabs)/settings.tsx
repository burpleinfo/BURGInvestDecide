import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { useRouter } from 'expo-router';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppHeader } from '@/components/common/AppHeader';
import { Screen } from '@/components/common/Screen';
import { AppColors, Fonts } from '@/constants/theme';
import { usePassenger } from '@/contexts/PassengerContext';
import { faqs } from '@/data/appData';

export default function PassengerSettingsScreen() {
  const router = useRouter();
  const { passenger } = usePassenger();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [shareLocation, setShareLocation] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <Screen scroll contentStyle={styles.content}>
      <AppHeader title="Settings & Support" subtitle="Manage preferences and get help" />

      <AppCard>
        <Text style={styles.sectionTitle}>Profile</Text>
        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>Name</Text>
          <Text style={styles.profileValue}>{passenger?.name || 'Not specified'}</Text>
        </View>
        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>BURG ID</Text>
          <Text style={styles.profileValue}>{passenger?.burgId || 'Not assigned'}</Text>
        </View>
        <View style={styles.profileRow}>
          <Text style={styles.profileLabel}>Pickup stop</Text>
          <Text style={styles.profileValue}>{passenger?.pickupStop || 'Not assigned'}</Text>
        </View>
        <AppButton title="Edit profile" variant="outline" onPress={() => router.push('/passenger/edit-profile')} />
      </AppCard>

      <AppCard>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Push notifications</Text>
          <Switch
            value={pushNotifications}
            onValueChange={setPushNotifications}
            trackColor={{ true: AppColors.teal, false: AppColors.border }}
          />
        </View>
        <View style={styles.toggleRow}>
          <Text style={styles.toggleLabel}>Share live location during trips</Text>
          <Switch
            value={shareLocation}
            onValueChange={setShareLocation}
            trackColor={{ true: AppColors.teal, false: AppColors.border }}
          />
        </View>
        <AppButton title="Change PIN" variant="outline" />
      </AppCard>

      <AppCard>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.supportRow}>
          <Ionicons name="call" size={18} color={AppColors.card} />
          <Text style={styles.supportText}>+1-555-0100</Text>
          <Text style={styles.supportLabel}>Contact support</Text>
        </View>
        <AppButton title="Report a problem" variant="secondary" />
      </AppCard>

      <AppCard>
        <Text style={styles.sectionTitle}>FAQs</Text>
        {faqs.map((faq, index) => (
          <Pressable
            key={faq.question}
            style={styles.faqCard}
            onPress={() => setExpanded(expanded === index ? null : index)}>
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion}>{faq.question}</Text>
              <Ionicons
                name={expanded === index ? 'chevron-up' : 'chevron-down'}
                size={16}
                color={AppColors.muted}
              />
            </View>
            {expanded === index ? <Text style={styles.faqAnswer}>{faq.answer}</Text> : null}
          </Pressable>
        ))}
      </AppCard>

      <AppButton
        title="Logout"
        variant="outline"
        icon={<Ionicons name="log-out" size={18} color={AppColors.red} />}
        style={{ borderColor: AppColors.red }}
        textStyle={{ color: AppColors.red }}
        onPress={() => router.replace('/login')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 90,
    gap: 16,
  },
  sectionTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 10,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  toggleLabel: {
    fontSize: 13,
    color: AppColors.text,
    flex: 1,
    paddingRight: 12,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileLabel: {
    fontSize: 12,
    color: AppColors.muted,
  },
  profileValue: {
    fontSize: 13,
    color: AppColors.text,
    fontWeight: '600',
  },
  supportRow: {
    backgroundColor: AppColors.teal,
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  supportText: {
    color: AppColors.card,
    fontWeight: '700',
  },
  supportLabel: {
    color: AppColors.card,
    marginLeft: 'auto',
    fontSize: 12,
  },
  faqCard: {
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
  },
  faqQuestion: {
    fontSize: 13,
    color: AppColors.text,
    flex: 1,
    fontWeight: '600',
  },
  faqAnswer: {
    marginTop: 8,
    fontSize: 12,
    color: AppColors.muted,
  },
});
