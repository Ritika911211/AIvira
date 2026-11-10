import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { useResponsive } from '../utils/responsive';

interface Props {
  onSuccess: () => void;
}

export const AuthScreen: React.FC<Props> = ({ onSuccess }) => {
  const { isSmall, rf, horizontalPadding } = useResponsive();
  const [mobileNumber, setMobileNumber] = useState('+91 98765 43210');
  const [password, setPassword] = useState('••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [authMode, setAuthMode] = useState<'signin' | 'otp'>('signin');
  const [otp, setOtp] = useState('4821');

  const handleSignIn = () => {
    onSuccess();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: horizontalPadding }]} showsVerticalScrollIndicator={false}>
        {/* Brand Header */}
        <View style={[styles.header, isSmall && { marginBottom: 20 }]}>
          <Image
            source={require('../assets/logo.png')}
            style={{ width: isSmall ? 70 : 86, height: isSmall ? 70 : 86, resizeMode: 'contain', alignSelf: 'center' }}
          />
          <Text style={[styles.welcomeTitle, { fontSize: rf(isSmall ? 19 : 22) }]}>Welcome back</Text>
          <Text style={[styles.welcomeSubtitle, { fontSize: rf(isSmall ? 12.5 : 14) }]}>Sign in to continue</Text>
        </View>

        {/* Input Form */}
        <View style={[styles.formContainer, { padding: isSmall ? 16 : 22 }]}>
          <Text style={styles.inputLabel}>Mobile number</Text>
          <View style={styles.inputWrapper}>
            <Ionicons name="call-outline" size={18} color={Colors.secondaryText} style={styles.inputIcon} />
            <TextInput
              style={styles.textInput}
              value={mobileNumber}
              onChangeText={setMobileNumber}
              keyboardType="phone-pad"
              placeholder="+91 Mobile number"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {authMode === 'signin' ? (
            <>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="lock-closed-outline" size={18} color={Colors.secondaryText} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  placeholder="Enter your password"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color={Colors.secondaryText} 
                  />
                </TouchableOpacity>
              </View>

              {/* Remember me & Forgot password */}
              <View style={styles.optionsRow}>
                <TouchableOpacity 
                  style={styles.rememberMeRow} 
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.8}
                >
                  <Ionicons 
                    name={rememberMe ? "checkbox" : "square-outline"} 
                    size={18} 
                    color={rememberMe ? Colors.primary : Colors.secondaryText} 
                  />
                  <Text style={styles.rememberMeText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setAuthMode('otp')}>
                  <Text style={styles.forgotText}>Login via OTP?</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.inputLabel}>Enter 4-Digit OTP</Text>
              <View style={styles.inputWrapper}>
                <Ionicons name="key-outline" size={18} color={Colors.secondaryText} style={styles.inputIcon} />
                <TextInput
                  style={styles.textInput}
                  value={otp}
                  onChangeText={setOtp}
                  keyboardType="number-pad"
                  placeholder="4-digit OTP"
                  maxLength={4}
                />
              </View>
              <TouchableOpacity onPress={() => setAuthMode('signin')} style={styles.switchModeRow}>
                <Text style={styles.forgotText}>Use password instead</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Primary Submit Button */}
          <TouchableOpacity 
            style={styles.signInButton} 
            onPress={handleSignIn}
            activeOpacity={0.85}
          >
            <Text style={styles.signInButtonText}>
              {authMode === 'signin' ? 'Sign In' : 'Verify & Continue'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Logins */}
          <TouchableOpacity 
            style={styles.socialButton}
            onPress={handleSignIn}
            activeOpacity={0.7}
          >
            <Ionicons name="logo-google" size={18} color="#EA4335" />
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.socialButton}
            onPress={handleSignIn}
            activeOpacity={0.7}
          >
            <Ionicons name="logo-apple" size={19} color="#000000" />
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View style={styles.signUpRow}>
            <Text style={styles.signUpPrompt}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignIn}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 30,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoSymbol: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primaryText,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primaryText,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: Colors.secondaryText,
    marginTop: 4,
  },
  formContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: '#F0EEF8',
    shadowColor: '#7652EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 16,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryText,
    marginBottom: 6,
    marginTop: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8FC',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAE7F5',
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 6,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.primaryText,
    fontWeight: '500',
  },
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  rememberMeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rememberMeText: {
    fontSize: 13,
    color: Colors.secondaryText,
  },
  forgotText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  switchModeRow: {
    marginVertical: 12,
    alignItems: 'flex-end',
  },
  signInButton: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 3,
  },
  signInButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EAE7F5',
  },
  dividerText: {
    paddingHorizontal: 12,
    fontSize: 13,
    color: Colors.secondaryText,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EAE7F5',
    backgroundColor: '#FFFFFF',
    gap: 10,
    marginBottom: 10,
  },
  socialButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryText,
  },
  signUpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },
  signUpPrompt: {
    fontSize: 13,
    color: Colors.secondaryText,
  },
  signUpLink: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
});

