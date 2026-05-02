import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';

import { AppButton } from '@/components/common/AppButton';
import { AppCard } from '@/components/common/AppCard';
import { AppHeader } from '@/components/common/AppHeader';
import { Screen } from '@/components/common/Screen';
import { useToast } from '@/components/common/Toast';
import { AppColors, Fonts } from '@/constants/theme';
import { paymentHistory } from '@/data/appData';

const paymentTabs = ['Pay Now', 'Payment History'] as const;
const methods = ['Card', 'UPI', 'Net Banking'] as const;

type PaymentTab = (typeof paymentTabs)[number];

type PaymentMethod = (typeof methods)[number];

export default function PassengerPaymentsScreen() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<PaymentTab>('Pay Now');
  const [method, setMethod] = useState<PaymentMethod>('Card');

  return (
    <Screen scroll contentStyle={styles.content}>
      <AppHeader title="Payments" subtitle="Manage your transactions" />

      <View style={styles.tabRow}>
        {paymentTabs.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabChip, activeTab === tab && styles.tabChipActive]}>
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>{tab}</Text>
          </Pressable>
        ))}
      </View>

      {activeTab === 'Pay Now' ? (
        <View style={{ gap: 16 }}>
          <AppCard>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Fare</Text>
              <Text style={styles.amountValue}>$15.00</Text>
            </View>
            <View style={styles.amountRow}>
              <Text style={styles.amountLabel}>Total Due</Text>
              <Text style={styles.amountTotal}>$15.00</Text>
            </View>
          </AppCard>

          <AppCard>
            <Text style={styles.sectionTitle}>Payment Method</Text>
            <View style={styles.methodRow}>
              {methods.map((item) => (
                <Pressable
                  key={item}
                  onPress={() => setMethod(item)}
                  style={[styles.methodChip, method === item && styles.methodChipActive]}>
                  <Text style={[styles.methodText, method === item && styles.methodTextActive]}>
                    {item}
                  </Text>
                </Pressable>
              ))}
            </View>

            {method === 'Card' ? (
              <View style={styles.paymentBox}>
                <Text style={styles.methodHint}>Card details</Text>
                <View style={styles.cardRow}>
                  <Ionicons name="card" size={20} color={AppColors.teal} />
                  <Text style={styles.cardText}>•••• 4242</Text>
                </View>
              </View>
            ) : null}

            {method === 'UPI' ? (
              <View style={styles.paymentBox}>
                <Text style={styles.methodHint}>Scan any UPI QR</Text>
                <View style={styles.qrMock} />
                <View style={styles.upiRow}>
                  <Text style={styles.upiBadge}>GPay</Text>
                  <Text style={styles.upiBadge}>PhonePe</Text>
                  <Text style={styles.upiBadge}>Paytm</Text>
                </View>
              </View>
            ) : null}

            {method === 'Net Banking' ? (
              <View style={styles.paymentBox}>
                <Text style={styles.methodHint}>Select your bank</Text>
                <View style={styles.bankRow}>
                  {['SBI', 'HDFC', 'ICICI', 'Axis'].map((bank) => (
                    <Text key={bank} style={styles.bankChip}>
                      {bank}
                    </Text>
                  ))}
                </View>
              </View>
            ) : null}
          </AppCard>

          <AppButton
            title="Pay $15.00"
            onPress={() => showToast('Payment successful', 'success')}
          />
        </View>
      ) : (
        <View style={{ gap: 12 }}>
          {paymentHistory.map((payment) => (
            <AppCard key={payment.route}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyRoute}>{payment.route}</Text>
                <View style={styles.paidBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={AppColors.green} />
                  <Text style={styles.paidText}>{payment.status}</Text>
                </View>
              </View>
              <View style={styles.amountRow}>
                <Text style={styles.amountLabel}>{payment.date}</Text>
                <Text style={styles.amountValue}>{payment.amount}</Text>
              </View>
            </AppCard>
          ))}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 90,
    gap: 16,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
  },
  tabChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: AppColors.surface,
  },
  tabChipActive: {
    backgroundColor: AppColors.teal,
  },
  tabText: {
    fontSize: 12,
    color: AppColors.muted,
    fontWeight: '600',
  },
  tabTextActive: {
    color: AppColors.card,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 12,
    color: AppColors.muted,
  },
  amountValue: {
    fontSize: 13,
    color: AppColors.text,
    fontWeight: '600',
  },
  amountTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: AppColors.teal,
  },
  sectionTitle: {
    fontFamily: Fonts.rounded,
    fontSize: 15,
    fontWeight: '700',
    color: AppColors.text,
    marginBottom: 8,
  },
  methodRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  methodChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  methodChipActive: {
    borderColor: AppColors.teal,
    backgroundColor: AppColors.tealSoft,
  },
  methodText: {
    fontSize: 12,
    color: AppColors.muted,
    fontWeight: '600',
  },
  methodTextActive: {
    color: AppColors.teal,
  },
  paymentBox: {
    backgroundColor: AppColors.surface,
    borderRadius: 14,
    padding: 12,
    gap: 10,
  },
  methodHint: {
    fontSize: 12,
    color: AppColors.muted,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  cardText: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.text,
  },
  qrMock: {
    width: '100%',
    height: 140,
    borderRadius: 14,
    backgroundColor: AppColors.border,
  },
  upiRow: {
    flexDirection: 'row',
    gap: 8,
  },
  upiBadge: {
    backgroundColor: AppColors.card,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 11,
    color: AppColors.text,
  },
  bankRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bankChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: AppColors.card,
    fontSize: 11,
    color: AppColors.text,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  historyRoute: {
    fontSize: 14,
    fontWeight: '600',
    color: AppColors.text,
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: AppColors.tealSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  paidText: {
    fontSize: 11,
    color: AppColors.green,
    fontWeight: '600',
  },
});
