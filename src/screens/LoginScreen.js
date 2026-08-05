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
import {login} from '../api/auth';

const FIXTURE_INPUT = 'dummy-placeholder';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phase, setPhase] = useState('initial');
  const [feedback, setFeedback] = useState('Dummy fixture: not submitted');
  const isLoading = phase === 'loading';

  function updateFixtureInput(setValue, value) {
    if (value === '' || FIXTURE_INPUT.startsWith(value)) {
      setValue(value);

      if (phase === 'error') {
        setPhase('initial');
        setFeedback('Dummy fixture: not submitted');
      }

      return;
    }

    setPhase('error');
    setFeedback('Only dummy fixture input is accepted. Do not enter real credentials.');
  }

  async function handleSubmit() {
    if (!username || !password) {
      setPhase('error');
      setFeedback('Enter both dummy placeholder values before continuing.');
      return;
    }

    if (username !== FIXTURE_INPUT || password !== FIXTURE_INPUT) {
      setPhase('error');
      setFeedback('Only the dummy placeholder value may be submitted.');
      return;
    }

    setPhase('loading');
    setFeedback('Submitting placeholder login...');

    try {
      const response = await login({username, password});
      setPhase('success');
      setFeedback(
        response && response.fixture === FIXTURE_INPUT
          ? 'Fixture status: ' + response.fixture
          : 'Placeholder login completed.',
      );
    } catch (_error) {
      setPhase('error');
      setFeedback('Placeholder login failed. No production credentials were sent.');
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text accessibilityRole="header" style={styles.title}>
            Placeholder login
          </Text>
          <Text style={styles.warning}>
            Dummy fixture only. Do not enter real credentials.
          </Text>

          <Text style={styles.label}>Fixture username</Text>
          <TextInput
            accessibilityLabel="Fixture username"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            editable={!isLoading}
            onChangeText={value => updateFixtureInput(setUsername, value)}
            placeholder={FIXTURE_INPUT}
            style={styles.input}
            value={username}
          />

          <Text style={styles.label}>Fixture password</Text>
          <TextInput
            accessibilityLabel="Fixture password"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect={false}
            editable={!isLoading}
            onChangeText={value => updateFixtureInput(setPassword, value)}
            placeholder={FIXTURE_INPUT}
            secureTextEntry
            style={styles.input}
            textContentType="none"
            value={password}
          />

          <Pressable
            accessibilityLabel="Submit placeholder login"
            accessibilityRole="button"
            accessibilityState={{disabled: isLoading}}
            disabled={isLoading}
            onPress={handleSubmit}
            style={({pressed}) => [
              styles.button,
              pressed && styles.buttonPressed,
              isLoading && styles.buttonDisabled,
            ]}>
            {isLoading ? (
              <ActivityIndicator
                accessibilityLabel="Submitting placeholder login"
                color="#ffffff"
              />
            ) : (
              <Text style={styles.buttonText}>Use placeholder login</Text>
            )}
          </Pressable>

          <Text
            accessibilityLiveRegion="polite"
            style={[styles.feedback, phase === 'error' && styles.error]}>
            {feedback}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {flex: 1},
  content: {flexGrow: 1, justifyContent: 'center', padding: 24},
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
  },
  title: {color: '#172033', fontSize: 28, fontWeight: '700'},
  warning: {color: '#465268', fontSize: 15, lineHeight: 22, marginTop: 8},
  label: {color: '#172033', fontSize: 14, fontWeight: '600', marginTop: 22},
  input: {
    borderColor: '#c9d2e0',
    borderRadius: 10,
    borderWidth: 1,
    color: '#172033',
    fontSize: 16,
    marginTop: 8,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#2858d5',
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 24,
    minHeight: 48,
  },
  buttonPressed: {backgroundColor: '#204bb8'},
  buttonDisabled: {opacity: 0.7},
  buttonText: {color: '#ffffff', fontSize: 16, fontWeight: '600'},
  feedback: {color: '#465268', fontSize: 14, lineHeight: 20, marginTop: 18},
  error: {color: '#b42318'},
});
