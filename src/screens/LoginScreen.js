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
import {FIXTURE_LOGIN_INPUTS, login} from '../api';

const INITIAL_STATUS = {
  kind: 'initial',
  message: 'Dummy fixture: not submitted',
};

export default function LoginScreen() {
  const [username, setUsername] = useState(FIXTURE_LOGIN_INPUTS.username);
  const [password, setPassword] = useState(FIXTURE_LOGIN_INPUTS.password);
  const [status, setStatus] = useState(INITIAL_STATUS);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    if (isLoading) {
      return;
    }

    if (!username.trim() || !password.trim()) {
      setStatus({
        kind: 'empty',
        message: 'Both fixture-only fields are required before the placeholder request can run.',
      });
      return;
    }

    if (
      username !== FIXTURE_LOGIN_INPUTS.username ||
      password !== FIXTURE_LOGIN_INPUTS.password
    ) {
      setStatus({
        kind: 'error',
        message: 'Only the displayed fixture values are accepted. Nothing was sent.',
      });
      return;
    }

    setIsLoading(true);
    setStatus({kind: 'loading', message: 'Using placeholder login…'});

    try {
      // Deliberately do not forward values typed into the fields. The API module
      // owns the fixed fixture payload so real credentials cannot leave the screen.
      const result = await login();

      if (!result || !result.fixture) {
        setStatus({
          kind: 'empty',
          message: 'No fixture response was returned. No session information was stored.',
        });
        return;
      }

      setStatus({
        kind: 'success',
        message: result.note
          ? 'Fixture login complete: ' + result.fixture + '. ' + result.note
          : 'Fixture login complete: ' + result.fixture + '.',
      });
    } catch (_error) {
      setStatus({
        kind: 'error',
        message: 'The placeholder request failed. No production service was contacted.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const statusStyle =
    status.kind === 'success'
      ? styles.statusSuccess
      : status.kind === 'error'
        ? styles.statusError
        : status.kind === 'loading'
          ? styles.statusLoading
          : styles.statusNeutral;

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.screen}>
            <View style={styles.brandRow}>
              <View style={styles.logo}>
                <Text style={styles.logoText}>MB</Text>
              </View>
              <Text style={styles.brand}>Mobile Build</Text>
            </View>

            <View style={styles.fixtureBadge}>
              <Text style={styles.fixtureBadgeText}>FIXTURE ONLY</Text>
            </View>
            <Text accessibilityRole="header" style={styles.title}>
              Login
            </Text>
            <Text style={styles.subtitle}>
              Use the prefilled placeholder values. Never enter real credentials.
            </Text>

            <View style={styles.formCard}>
              <Text style={styles.label}>Placeholder username</Text>
              <TextInput
                accessibilityLabel="Placeholder username"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                importantForAutofill="no"
                onChangeText={setUsername}
                placeholder="Fixture username"
                placeholderTextColor="#8A8297"
                style={styles.input}
                textContentType="none"
                value={username}
              />

              <Text style={[styles.label, styles.passwordLabel]}>
                Placeholder password
              </Text>
              <TextInput
                accessibilityLabel="Placeholder password"
                autoCapitalize="none"
                autoComplete="off"
                autoCorrect={false}
                importantForAutofill="no"
                onChangeText={setPassword}
                placeholder="Fixture password"
                placeholderTextColor="#8A8297"
                secureTextEntry
                style={styles.input}
                textContentType="none"
                value={password}
              />

              <Text style={styles.helperText}>
                Submitted requests always use fixed dummy data from the API module;
                edited field values are blocked locally.
              </Text>

              <Pressable
                accessibilityLabel="Submit fixture login"
                accessibilityRole="button"
                disabled={isLoading}
                onPress={handleSubmit}
                style={({pressed}) => [
                  styles.button,
                  pressed && !isLoading ? styles.buttonPressed : null,
                  isLoading ? styles.buttonDisabled : null,
                ]}>
                {isLoading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Use placeholder login</Text>
                )}
              </Pressable>
            </View>

            <View
              accessibilityLiveRegion="polite"
              style={[styles.statusCard, statusStyle]}>
              <Text style={styles.statusEyebrow}>STATUS</Text>
              <Text style={styles.statusText}>{status.message}</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {backgroundColor: '#F7F3FC', flex: 1},
  keyboardView: {flex: 1},
  scrollContent: {flexGrow: 1},
  screen: {flex: 1, paddingHorizontal: 24, paddingVertical: 28},
  brandRow: {alignItems: 'center', flexDirection: 'row', marginBottom: 48},
  logo: {
    alignItems: 'center',
    backgroundColor: '#5C2D91',
    borderRadius: 12,
    height: 40,
    justifyContent: 'center',
    marginRight: 12,
    width: 40,
  },
  logoText: {color: '#FFFFFF', fontSize: 14, fontWeight: '800'},
  brand: {color: '#211A2B', fontSize: 17, fontWeight: '700'},
  fixtureBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDE0FB',
    borderRadius: 999,
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  fixtureBadgeText: {
    color: '#5C2D91',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  title: {color: '#211A2B', fontSize: 36, fontWeight: '800', letterSpacing: -0.6},
  subtitle: {
    color: '#6B6276',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 26,
    marginTop: 10,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E8E0EF',
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    shadowColor: '#35184E',
    shadowOffset: {height: 8, width: 0},
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 3,
  },
  label: {color: '#332A3D', fontSize: 13, fontWeight: '700', marginBottom: 8},
  passwordLabel: {marginTop: 18},
  input: {
    backgroundColor: '#FAF8FC',
    borderColor: '#D9CFE2',
    borderRadius: 14,
    borderWidth: 1,
    color: '#211A2B',
    fontSize: 16,
    minHeight: 52,
    paddingHorizontal: 15,
  },
  helperText: {color: '#786F81', fontSize: 12, lineHeight: 18, marginTop: 14},
  button: {
    alignItems: 'center',
    backgroundColor: '#5C2D91',
    borderRadius: 14,
    justifyContent: 'center',
    marginTop: 22,
    minHeight: 54,
    paddingHorizontal: 18,
  },
  buttonPressed: {backgroundColor: '#48216F'},
  buttonDisabled: {opacity: 0.7},
  buttonText: {color: '#FFFFFF', fontSize: 16, fontWeight: '800'},
  statusCard: {
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 18,
    padding: 17,
  },
  statusNeutral: {backgroundColor: '#F0ECF4', borderColor: '#DED4E7'},
  statusLoading: {backgroundColor: '#EFE7F8', borderColor: '#D2BDE9'},
  statusSuccess: {backgroundColor: '#E8F6EC', borderColor: '#B9DEC3'},
  statusError: {backgroundColor: '#FCEBEC', borderColor: '#F3C6C9'},
  statusEyebrow: {
    color: '#665D70',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 7,
  },
  statusText: {color: '#322B3A', fontSize: 14, lineHeight: 21},
});
