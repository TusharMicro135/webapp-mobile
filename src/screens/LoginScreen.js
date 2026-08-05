import React, {useState} from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {FIXTURE_INPUT, isFixtureLoginInput, login} from '../api/auth';

const INITIAL_MESSAGE = 'Dummy fixture: not submitted';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phase, setPhase] = useState('initial');
  const [feedback, setFeedback] = useState(INITIAL_MESSAGE);
  const isLoading = phase === 'loading';

  function updateFixtureInput(setValue, nextValue) {
    // Reject pasted or typed production-looking values before retaining them.
    if (nextValue === '' || FIXTURE_INPUT.startsWith(nextValue)) {
      setValue(nextValue);
      if (phase !== 'initial') {
        setPhase('initial');
        setFeedback(INITIAL_MESSAGE);
      }
      return;
    }

    setValue('');
    setPhase('error');
    setFeedback('Only the displayed fixture marker is accepted. Do not enter real credentials.');
  }

  async function handleSubmit() {
    if (isLoading) {
      return;
    }

    if (!username.trim() || !password.trim()) {
      setPhase('error');
      setFeedback('Enter both fixture-only values before submitting.');
      return;
    }

    if (!isFixtureLoginInput(username) || !isFixtureLoginInput(password)) {
      setPassword('');
      setPhase('error');
      setFeedback('Only the displayed fixture marker is accepted. Real credentials are not sent.');
      return;
    }

    setPhase('loading');
    setFeedback('Submitting placeholder login…');

    try {
      const result = await login({username, password});
      if (!result || result.fixture !== 'dummy-placeholder') {
        throw new Error('Unexpected fixture response.');
      }
      setPassword('');
      setPhase('success');
      setFeedback('Dummy fixture response received.');
    } catch {
      setPhase('error');
      setFeedback('Placeholder login failed. No production service is configured.');
    }
  }

  return (
    <SafeAreaView style={styles.page}>
      <KeyboardAvoidingView
        style={styles.page}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled">
          <View style={styles.card}>
            <Text accessibilityRole="header" style={styles.title}>Login</Text>
            <Text style={styles.description}>
              Dummy fixture login form; do not enter real credentials.
            </Text>
            <Text style={styles.instructions}>
              Type {FIXTURE_INPUT} in both placeholder fields.
            </Text>

            <Text style={styles.label}>Placeholder username</Text>
            <TextInput
              testID="username-input"
              accessibilityLabel="Placeholder username"
              style={styles.input}
              value={username}
              onChangeText={value => updateFixtureInput(setUsername, value)}
              placeholder={FIXTURE_INPUT}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
              importantForAutofill="no"
              textContentType="none"
              editable={!isLoading}
              maxLength={64}
              returnKeyType="next"
            />

            <Text style={styles.label}>Placeholder password</Text>
            <TextInput
              testID="password-input"
              accessibilityLabel="Placeholder password"
              style={styles.input}
              value={password}
              onChangeText={value => updateFixtureInput(setPassword, value)}
              placeholder={FIXTURE_INPUT}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
              importantForAutofill="no"
              textContentType="none"
              secureTextEntry
              editable={!isLoading}
              maxLength={64}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
            />

            <Pressable
              testID="submit-login"
              accessibilityRole="button"
              accessibilityState={{disabled: isLoading}}
              disabled={isLoading}
              onPress={handleSubmit}
              style={({pressed}) => [
                styles.button,
                (pressed || isLoading) && styles.buttonMuted,
              ]}>
              <Text style={styles.buttonText}>
                {isLoading ? 'Submitting…' : 'Use placeholder login'}
              </Text>
            </Pressable>

            <View style={styles.statusRow}>
              {isLoading && <ActivityIndicator size="small" color="#2457C5" />}
              <Text
                testID="login-status"
                accessibilityLiveRegion="polite"
                style={[
                  styles.status,
                  phase === 'error' && styles.error,
                  phase === 'success' && styles.success,
                ]}>
                {feedback}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1, backgroundColor: '#F5F7FB'},
  content: {flexGrow: 1, justifyContent: 'center', padding: 24},
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#16233D',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  title: {color: '#16233D', fontSize: 28, fontWeight: '700', marginBottom: 8},
  description: {color: '#42526E', fontSize: 16, lineHeight: 23, marginBottom: 10},
  instructions: {color: '#5C6B84', fontSize: 14, lineHeight: 20, marginBottom: 20},
  label: {color: '#253858', fontSize: 14, fontWeight: '600', marginBottom: 6},
  input: {
    borderColor: '#C7D0DE',
    borderWidth: 1,
    borderRadius: 8,
    color: '#16233D',
    fontSize: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2457C5',
    borderRadius: 8,
    marginTop: 4,
    paddingVertical: 13,
  },
  buttonMuted: {opacity: 0.65},
  buttonText: {color: '#FFFFFF', fontSize: 16, fontWeight: '600'},
  statusRow: {alignItems: 'center', flexDirection: 'row', marginTop: 18, minHeight: 22},
  status: {color: '#42526E', flex: 1, fontSize: 14, lineHeight: 20, marginLeft: 8},
  error: {color: '#B42318'},
  success: {color: '#18794E'},
});
