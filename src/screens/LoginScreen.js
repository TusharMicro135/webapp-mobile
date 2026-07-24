import React, {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  FIXTURE_CREDENTIALS,
  login,
  validateFixtureCredentials,
} from '../api/auth';

const INITIAL_STATUS = {
  kind: 'initial',
  message: 'Dummy fixture: not submitted',
};

export default function LoginScreen() {
  // Read-only values prevent production credentials from being entered.
  const [credentials] = useState(FIXTURE_CREDENTIALS);
  const [status, setStatus] = useState(INITIAL_STATUS);

  async function handleSubmit() {
    if (status.kind === 'loading') {
      return;
    }

    const validationError = validateFixtureCredentials(credentials);
    if (validationError) {
      setStatus({kind: 'error', message: validationError});
      return;
    }

    setStatus({kind: 'loading', message: 'Submitting placeholder login…'});
    try {
      const result = await login(credentials);
      if (typeof result?.fixture !== 'string' || !result.fixture.trim()) {
        setStatus({
          kind: 'empty',
          message: 'No fixture status was returned.',
        });
        return;
      }

      // Deliberately use only the non-sensitive fixture marker.
      setStatus({kind: 'success', message: result.fixture});
    } catch (_error) {
      setStatus({
        kind: 'error',
        message: 'Placeholder login failed. No production service is configured.',
      });
    }
  }

  const isLoading = status.kind === 'loading';

  return (
    <ScrollView
      contentContainerStyle={styles.page}
      keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <Text accessibilityRole="header" style={styles.title}>
          Placeholder login
        </Text>
        <Text style={styles.description}>
          Dummy fixture login form; do not enter real credentials.
        </Text>

        <Text style={styles.label}>Placeholder username</Text>
        <TextInput
          accessibilityLabel="Placeholder username"
          editable={false}
          selectTextOnFocus={false}
          style={styles.input}
          testID="fixture-username"
          value={credentials.username}
        />

        <Text style={styles.label}>Placeholder password</Text>
        <TextInput
          accessibilityLabel="Placeholder password"
          editable={false}
          secureTextEntry
          selectTextOnFocus={false}
          style={styles.input}
          testID="fixture-password"
          value={credentials.password}
        />
        <Text style={styles.hint}>These fields are read-only fixture values.</Text>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{disabled: isLoading, busy: isLoading}}
          disabled={isLoading}
          onPress={handleSubmit}
          style={({pressed}) => [
            styles.button,
            isLoading && styles.buttonDisabled,
            pressed && !isLoading && styles.buttonPressed,
          ]}
          testID="submit-placeholder-login">
          {isLoading ? (
            <ActivityIndicator color="#ffffff" testID="login-loading" />
          ) : (
            <Text style={styles.buttonText}>Use placeholder login</Text>
          )}
        </Pressable>

        <View
          accessibilityLiveRegion="polite"
          style={[
            styles.status,
            status.kind === 'error' && styles.statusError,
            status.kind === 'success' && styles.statusSuccess,
          ]}
          testID={`login-status-${status.kind}`}>
          <Text
            style={[
              styles.statusText,
              status.kind === 'error' && styles.statusTextError,
              status.kind === 'success' && styles.statusTextSuccess,
            ]}>
            {status.message}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f4f6f8',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#172033',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {fontSize: 24, fontWeight: '700', color: '#172033', marginBottom: 8},
  description: {fontSize: 15, lineHeight: 21, color: '#526071', marginBottom: 20},
  label: {fontSize: 14, fontWeight: '600', color: '#263445', marginBottom: 6},
  input: {
    borderWidth: 1,
    borderColor: '#cbd3dc',
    borderRadius: 8,
    backgroundColor: '#f8fafb',
    color: '#263445',
    paddingHorizontal: 12,
    paddingVertical: 11,
    marginBottom: 14,
  },
  hint: {fontSize: 13, color: '#657487', marginBottom: 20},
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderRadius: 8,
    backgroundColor: '#2459a6',
  },
  buttonPressed: {backgroundColor: '#1c4785'},
  buttonDisabled: {backgroundColor: '#7894bc'},
  buttonText: {color: '#ffffff', fontSize: 16, fontWeight: '600'},
  status: {
    marginTop: 18,
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#eef2f6',
  },
  statusError: {backgroundColor: '#fcecec'},
  statusSuccess: {backgroundColor: '#e9f6ee'},
  statusText: {fontSize: 14, color: '#526071'},
  statusTextError: {color: '#a22e2e'},
  statusTextSuccess: {color: '#216a3b'},
});
