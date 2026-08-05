import React, {useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  login,
  MOBILE_FIXTURE_CREDENTIALS,
} from '../api/auth';

const INITIAL_MESSAGE = 'Dummy fixture: not submitted';

export default function LoginScreen({loginRequest = login}) {
  const [username, setUsername] = useState(
    MOBILE_FIXTURE_CREDENTIALS.username,
  );
  const [password, setPassword] = useState(
    MOBILE_FIXTURE_CREDENTIALS.password,
  );
  const [phase, setPhase] = useState('idle');
  const [message, setMessage] = useState(INITIAL_MESSAGE);

  const isLoading = phase === 'loading';

  async function handleSubmit() {
    if (!username.trim() || !password.trim()) {
      setPhase('error');
      setMessage(
        'Enter both fixture-only placeholder values before continuing.',
      );
      return;
    }

    if (
      username !== MOBILE_FIXTURE_CREDENTIALS.username ||
      password !== MOBILE_FIXTURE_CREDENTIALS.password
    ) {
      setPhase('error');
      setMessage(
        'Only the displayed fixture values are accepted. Do not enter real credentials.',
      );
      return;
    }

    setPhase('loading');
    setMessage('Submitting fixture login…');

    try {
      const result = await loginRequest({username, password});

      if (!result || result.fixture !== 'dummy-placeholder') {
        setPhase('error');
        setMessage('The fixture API returned an unexpected response.');
        return;
      }

      setPhase('success');
      setMessage('Fixture login completed successfully.');
    } catch (_error) {
      setPhase('error');
      setMessage(
        'Fixture login failed. No production service or credentials were used.',
      );
    }
  }

  const statusStyle =
    phase === 'error'
      ? styles.statusError
      : phase === 'success'
        ? styles.statusSuccess
        : styles.statusNeutral;

  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.page}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text accessibilityRole="header" style={styles.title}>
              Placeholder login
            </Text>
            <Text style={styles.intro}>
              Dummy fixture login form. Use only the values shown below and
              never enter real credentials.
            </Text>

            <View style={styles.field}>
              <Text style={styles.label}>Fixture username</Text>
              <TextInput
                accessibilityLabel="Fixture username"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                onChangeText={setUsername}
                placeholder={MOBILE_FIXTURE_CREDENTIALS.username}
                style={styles.input}
                testID="username-input"
                value={username}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Fixture password</Text>
              <TextInput
                accessibilityLabel="Fixture password"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                onChangeText={setPassword}
                placeholder={MOBILE_FIXTURE_CREDENTIALS.password}
                secureTextEntry
                style={styles.input}
                testID="password-input"
                value={password}
              />
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityState={{disabled: isLoading}}
              disabled={isLoading}
              onPress={handleSubmit}
              style={({pressed}) => [
                styles.button,
                pressed && !isLoading && styles.buttonPressed,
                isLoading && styles.buttonDisabled,
              ]}
              testID="submit-login">
              {isLoading ? (
                <ActivityIndicator color="#ffffff" testID="login-spinner" />
              ) : (
                <Text style={styles.buttonLabel}>Use placeholder login</Text>
              )}
            </Pressable>

            <View
              accessibilityLiveRegion="polite"
              style={[styles.status, statusStyle]}>
              <Text style={styles.statusText} testID="status-message">
                {message}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: '#f4f7fb',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#d9e1ec',
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#12233f',
    shadowOffset: {width: 0, height: 8},
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  title: {
    color: '#12233f',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 10,
  },
  intro: {
    color: '#4d5f78',
    fontSize: 16,
    lineHeight: 23,
    marginBottom: 24,
  },
  field: {
    marginBottom: 18,
  },
  label: {
    color: '#263b57',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderColor: '#aab8ca',
    borderRadius: 10,
    borderWidth: 1,
    color: '#12233f',
    fontSize: 16,
    minHeight: 50,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#1769e0',
    borderRadius: 10,
    justifyContent: 'center',
    minHeight: 50,
    paddingHorizontal: 18,
  },
  buttonPressed: {
    backgroundColor: '#0f55bb',
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonLabel: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  status: {
    borderRadius: 10,
    marginTop: 18,
    padding: 14,
  },
  statusNeutral: {
    backgroundColor: '#edf3fb',
  },
  statusError: {
    backgroundColor: '#fdecec',
  },
  statusSuccess: {
    backgroundColor: '#e7f7ee',
  },
  statusText: {
    color: '#263b57',
    fontSize: 14,
    lineHeight: 20,
  },
});
