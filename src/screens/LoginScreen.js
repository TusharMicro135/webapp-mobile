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
import {login} from '../api/auth';

const INITIAL_STATE = 'initial';
const PLACEHOLDER_INPUT = 'placeholder';

export function validateFixtureCredentials({username, password}) {
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedPassword = password.trim().toLowerCase();

  if (!normalizedUsername || !normalizedPassword) {
    return 'Enter both placeholder fields before continuing.';
  }

  if (
    normalizedUsername !== PLACEHOLDER_INPUT ||
    normalizedPassword !== PLACEHOLDER_INPUT
  ) {
    return 'Only fixture placeholder values are accepted. Never enter real credentials.';
  }

  return null;
}

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [requestState, setRequestState] = useState(INITIAL_STATE);
  const [message, setMessage] = useState(
    'Use dummy placeholder values only. Do not enter real credentials.',
  );

  async function handleLogin() {
    const validationMessage = validateFixtureCredentials({username, password});

    if (validationMessage) {
      setRequestState('error');
      setMessage(validationMessage);
      return;
    }

    setRequestState('loading');
    setMessage('Submitting fixture login…');

    try {
      const result = await login({
        username: username.trim().toLowerCase(),
        password: password.trim().toLowerCase(),
      });

      if (!result || result.fixture !== 'dummy-placeholder') {
        setRequestState('error');
        setMessage('The placeholder response was empty or invalid.');
        return;
      }

      setRequestState('success');
      setMessage('Fixture login confirmed. No session value was stored.');
    } catch (_error) {
      setRequestState('error');
      setMessage('Placeholder login failed. Try again with fixture values.');
    }
  }

  const isLoading = requestState === 'loading';
  const isSuccess = requestState === 'success';
  const isError = requestState === 'error';

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.page}
          keyboardShouldPersistTaps="handled">
          <View style={styles.brandRow}>
            <View style={styles.brandMark} />
            <Text style={styles.brand}>Mobile Build</Text>
          </View>

          <View style={styles.card}>
            <Text accessibilityRole="header" style={styles.title}>
              Welcome back
            </Text>
            <Text style={styles.subtitle}>
              Sign in to the dummy fixture with placeholder-only values.
            </Text>

            <Text style={styles.label}>Placeholder username</Text>
            <TextInput
              accessibilityLabel="Placeholder username"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              onChangeText={setUsername}
              placeholder="Type placeholder"
              placeholderTextColor="#64748B"
              style={styles.input}
              testID="username-input"
              value={username}
            />

            <Text style={styles.label}>Placeholder password</Text>
            <TextInput
              accessibilityLabel="Placeholder password"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
              onChangeText={setPassword}
              placeholder="Type placeholder"
              placeholderTextColor="#64748B"
              secureTextEntry
              style={styles.input}
              testID="password-input"
              value={password}
            />

            <Pressable
              accessibilityRole="button"
              disabled={isLoading}
              onPress={handleLogin}
              style={({pressed}) => [
                styles.button,
                pressed && !isLoading && styles.buttonPressed,
                isLoading && styles.buttonDisabled,
              ]}
              testID="login-button">
              {isLoading ? (
                <ActivityIndicator color="#06252A" testID="login-spinner" />
              ) : (
                <Text style={styles.buttonText}>Use placeholder login</Text>
              )}
            </Pressable>

            <View
              accessibilityLiveRegion="polite"
              style={[
                styles.status,
                isError && styles.statusError,
                isSuccess && styles.statusSuccess,
              ]}
              testID="login-status">
              <Text
                style={[
                  styles.statusText,
                  isError && styles.statusTextError,
                  isSuccess && styles.statusTextSuccess,
                ]}>
                {message}
              </Text>
            </View>
          </View>

          <Text style={styles.footer}>
            Fixture environment · No production service is connected
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#07141D',
  },
  keyboardView: {
    flex: 1,
  },
  page: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 22,
    paddingVertical: 32,
  },
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 24,
  },
  brandMark: {
    backgroundColor: '#35D9E8',
    borderRadius: 6,
    height: 18,
    marginRight: 10,
    transform: [{rotate: '45deg'}],
    width: 18,
  },
  brand: {
    color: '#DFFBFF',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  card: {
    backgroundColor: '#0F2633',
    borderColor: '#1E4655',
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 16},
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 8,
  },
  title: {
    color: '#F3FCFD',
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.6,
  },
  subtitle: {
    color: '#9FC0CA',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 26,
    marginTop: 8,
  },
  label: {
    color: '#D3E8ED',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 14,
  },
  input: {
    backgroundColor: '#091B25',
    borderColor: '#2A5361',
    borderRadius: 12,
    borderWidth: 1,
    color: '#F3FCFD',
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: 16,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#35D9E8',
    borderRadius: 12,
    justifyContent: 'center',
    marginTop: 24,
    minHeight: 52,
  },
  buttonPressed: {
    backgroundColor: '#7BEAF3',
    transform: [{scale: 0.99}],
  },
  buttonDisabled: {
    opacity: 0.72,
  },
  buttonText: {
    color: '#06252A',
    fontSize: 16,
    fontWeight: '800',
  },
  status: {
    backgroundColor: '#112F3C',
    borderColor: '#255364',
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 18,
    padding: 14,
  },
  statusError: {
    backgroundColor: '#351D26',
    borderColor: '#7D3547',
  },
  statusSuccess: {
    backgroundColor: '#10352E',
    borderColor: '#26725F',
  },
  statusText: {
    color: '#B8D8DF',
    fontSize: 14,
    lineHeight: 20,
  },
  statusTextError: {
    color: '#FFC7D3',
  },
  statusTextSuccess: {
    color: '#B6F4DF',
  },
  footer: {
    color: '#7095A1',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 22,
    textAlign: 'center',
  },
});
