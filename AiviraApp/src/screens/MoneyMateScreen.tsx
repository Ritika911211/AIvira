import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert 
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';

interface Props {
  onBack: () => void;
  onOpenVoice: (prompt: string) => void;
}

export const MoneyMateScreen: React.FC<Props> = ({ onBack, onOpenVoice }) => {
  const { isSmall, rf, horizontalPadding } = useResponsive();
  const [bills, setBills] = useState([
    { id: 'b1', title: "Rohan's School Fee", amount: '₹8,000', due: '15 Dec (in 5 days)', category: 'Education', status: 'Pending' },
    { id: 'b2', title: 'Apartment Monthly Rent', amount: '₹22,000', due: '5th of Every Month', category: 'Housing', status: 'Pending' },
    { id: 'b3', title: 'Electricity & BESCOM Utility', amount: '₹2,450', due: '18 Apr', category: 'Utilities', status: 'Pending' },
    { id: 'b4', title: 'Home Loan EMI (HDFC)', amount: '₹34,500', due: '10th of Every Month', category: 'EMI', status: 'Paid' },
  ]);

  const handleConfirmPayment = (id: string, title: string, amount: string) => {
    Alert.alert(
      "Confirm Payment Action",
      `Are you sure you want to mark ${title} of ${amount} as completed? Explicit confirmation is required.`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm Paid", 
          onPress: () => {
            setBills(bills.map(b => b.id === id ? { ...b, status: 'Paid' } : b));
            Alert.alert("Payment Recorded", `${title} marked as paid.`);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={[styles.header, { paddingHorizontal: horizontalPadding }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.primaryText} />
        </TouchableOpacity>
        <View style={styles.headerTitleCol}>
          <Text style={[styles.title, { fontSize: rf(isSmall ? 17 : 20) }]}>MoneyMate</Text>
          <Text style={[styles.subtitle, { fontSize: rf(11) }]}>Smart Bills, Dues, EMI & Payment Reminders</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]} showsVerticalScrollIndicator={false}>
        {/* Total Dues Summary Card */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Upcoming Dues this Month</Text>
          <Text style={[styles.summaryTotal, { fontSize: rf(isSmall ? 26 : 32) }]}>₹32,450</Text>
          <Text style={styles.summarySub}>3 pending payments requiring attention</Text>
        </View>

        {/* Bills List */}
        <Text style={styles.sectionTitle}>Payment Commitments</Text>
        <View style={styles.billsList}>
          {bills.map(bill => {
            const isPaid = bill.status === 'Paid';
            return (
              <View key={bill.id} style={styles.billCard}>
                <View style={[styles.billIconCircle, { backgroundColor: isPaid ? '#ECFDF5' : '#FFF7ED' }]}>
                  <Ionicons 
                    name={isPaid ? "checkmark-done" : "card-outline"} 
                    size={20} 
                    color={isPaid ? '#10B981' : '#F59E0B'} 
                  />
                </View>

                <View style={styles.billInfoCol}>
                  <Text style={[styles.billTitle, isPaid && styles.paidText]}>{bill.title}</Text>
                  <Text style={styles.billDue}>Due: {bill.due}</Text>
                </View>

                <View style={styles.billRightCol}>
                  <Text style={styles.billAmount}>{bill.amount}</Text>
                  <TouchableOpacity
                    style={[styles.payActionBtn, isPaid && styles.paidBadge]}
                    onPress={() => !isPaid && handleConfirmPayment(bill.id, bill.title, bill.amount)}
                  >
                    <Text style={[styles.payActionBtnText, isPaid && styles.paidBadgeText]}>
                      {isPaid ? "Paid" : "Pay / Confirm"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Voice Trigger Banner */}
        <TouchableOpacity 
          style={styles.voicePromptCard}
          onPress={() => onOpenVoice("Har mahine 5 tareekh ko house rent dene ka reminder laga do")}
          activeOpacity={0.8}
        >
          <Ionicons name="mic-circle" size={32} color={Colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.voiceHeading}>Set Recurring Bill by Voice</Text>
            <Text style={styles.voiceSub}>"Har mahine 5 tareekh ko house rent dene ka reminder laga do"</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEF8',
  },
  backBtn: {
    paddingRight: 14,
  },
  headerTitleCol: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 32,
  },
  summaryCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  summaryLabel: {
    color: '#E0D7FE',
    fontSize: 12,
    fontWeight: '600',
  },
  summaryTotal: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '800',
    marginVertical: 4,
  },
  summarySub: {
    color: '#F3EEFF',
    fontSize: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 12,
  },
  billsList: {
    gap: 12,
    marginBottom: 20,
  },
  billCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#F0EEF8',
  },
  billIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  billInfoCol: {
    flex: 1,
  },
  billTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  paidText: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  billDue: {
    fontSize: 11,
    color: Colors.secondaryText,
    marginTop: 2,
  },
  billRightCol: {
    alignItems: 'flex-end',
  },
  billAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryText,
    marginBottom: 4,
  },
  payActionBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  payActionBtnText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  paidBadge: {
    backgroundColor: '#ECFDF5',
  },
  paidBadgeText: {
    color: '#065F46',
  },
  voicePromptCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3EEFF',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E6DEFC',
    gap: 12,
  },
  voiceHeading: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  voiceSub: {
    fontSize: 11,
    color: Colors.primaryText,
    marginTop: 2,
  },
});

