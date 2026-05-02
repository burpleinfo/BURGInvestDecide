import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { AppCard } from '@/components/common/AppCard';
import { AppHeader } from '@/components/common/AppHeader';
import { Screen } from '@/components/common/Screen';
import { AppColors, Fonts } from '@/constants/theme';
import { driverGuidelines } from '@/data/appData';

export default function DriverGuidelinesScreen() {
  return (
    <Screen scroll contentStyle={styles.content}>
      <AppHeader title="Safety Guidelines" subtitle="Rules and emergency contacts" />

      <AppCard>
        <Text style={styles.sectionTitle}>Operating Rules</Text>
        {driverGuidelines.map((rule) => (
          <View key={rule} style={styles.ruleRow}>
            <Ionicons name="checkmark-circle" size={18} color={AppColors.green} />
            <Text style={styles.ruleText}>{rule}</Text>
          </View>
        ))}
      </AppCard>

      <AppCard>
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        <View style={styles.contactRow}>
          <Ionicons name="call" size={18} color="#FFFFFF" />
          <Text style={styles.contactText}>911</Text>
          <Text style={styles.contactLabel}>Emergency Services</Text>
        </View>
        <View style={[styles.contactRow, styles.contactTeal]}>
          <Ionicons name="call" size={18} color="#FFFFFF" />
          <Text style={styles.contactText}>+1-555-0100</Text>
          <Text style={styles.contactLabel}>Transportation Office</Text>
        </View>
        <View style={[styles.contactRow, styles.contactDark]}>
          <Ionicons name="build" size={18} color="#FFFFFF" />
          <Text style={styles.contactText}>+1-555-0101</Text>
          <Text style={styles.contactLabel}>Maintenance</Text>
        </View>
      </AppCard>

      <AppCard>
        <Text style={styles.sectionTitle}>Vehicle Details</Text>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Vehicle ID</Text>
          <Text style={styles.detailValue}>BUS-342</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Type</Text>
          <Text style={styles.detailValue}>School Bus</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Capacity</Text>
          <Text style={styles.detailValue}>45 passengers</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Last Maintenance</Text>
          <Text style={styles.detailValue}>2026-04-15</Text>
        </View>
      </AppCard>
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
  ruleRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  ruleText: {
    flex: 1,
    fontSize: 13,
    color: AppColors.text,
  },
  contactRow: {
    backgroundColor: AppColors.orange,
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactTeal: {
    backgroundColor: AppColors.teal,
  },
  contactDark: {
    backgroundColor: '#1F2937',
  },
  contactText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  contactLabel: {
    color: '#FFFFFF',
    marginLeft: 'auto',
    fontSize: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 12,
    color: AppColors.muted,
  },
  detailValue: {
    fontSize: 12,
    color: AppColors.text,
    fontWeight: '600',
  },
});
