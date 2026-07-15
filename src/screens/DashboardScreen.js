import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import StatusMessage from '../components/StatusMessage';
import {
  DEFAULT_PLACEHOLDER_USER_ID,
  getUser,
} from '../api/users';

const INITIAL_STATE = {
  error: null,
  status: 'initial',
  user: null,
};

export default function DashboardScreen({
  userId = DEFAULT_PLACEHOLDER_USER_ID,
}) {
  const requestVersion = useRef(0);
  const [state, setState] = useState(INITIAL_STATE);

  const loadUser = useCallback(async () => {
    const currentRequest = requestVersion.current + 1;
    requestVersion.current = currentRequest;

    const normalizedId = typeof userId === 'string' ? userId.trim() : '';

    if (!normalizedId) {
      setState({error: null, status: 'empty', user: null});
      return;
    }

    setState({error: null, status: 'loading', user: null});

    try {
      const user = await getUser(normalizedId);

      if (requestVersion.current !== currentRequest) {
        return;
      }

      if (!user || !user.id || !user.displayName) {
        setState({error: null, status: 'empty', user: null});
        return;
      }

      setState({error: null, status: 'success', user});
    } catch (error) {
      if (requestVersion.current !== currentRequest) {
        return;
      }

      setState({
        error:
          error instanceof Error
            ? error.message
            : 'The placeholder user could not be loaded.',
        status: 'error',
        user: null,
      });
    }
  }, [userId]);

  useEffect(() => {
    loadUser();

    return () => {
      requestVersion.current += 1;
    };
  }, [loadUser]);

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.page}>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>MOBILE BUILD</Text>
        <Text accessibilityRole="header" style={styles.heading}>
          Dashboard
        </Text>
        <Text style={styles.subheading}>
          One fixture-only user summary, adapted from the web dashboard.
        </Text>
      </View>

      {state.status === 'initial' ? (
        <StatusMessage
          message="Getting the dashboard ready."
          testID="dashboard-initial-state"
          title="Preparing dashboard"
        />
      ) : null}

      {state.status === 'loading' ? (
        <StatusMessage
          loading
          message="Requesting the placeholder user summary."
          testID="dashboard-loading-state"
          title="Loading user"
        />
      ) : null}

      {state.status === 'empty' ? (
        <StatusMessage
          message="Provide a placeholder user ID to load this dashboard."
          testID="dashboard-empty-state"
          title="No placeholder user"
        />
      ) : null}

      {state.status === 'error' ? (
        <StatusMessage
          message={state.error}
          onRetry={loadUser}
          testID="dashboard-error-state"
          title="Dashboard unavailable"
        />
      ) : null}

      {state.status === 'success' ? (
        <View style={styles.card} testID="dashboard-success-state">
          <View style={styles.avatar} accessible accessibilityLabel="PU avatar">
            <Text style={styles.avatarLabel}>PU</Text>
          </View>
          <Text style={styles.cardLabel}>PLACEHOLDER ACCOUNT</Text>
          <Text style={styles.userName} testID="dashboard-user-name">
            {state.user.displayName}
          </Text>

          <View style={styles.divider} />

          <DetailRow label="User ID" value={state.user.id} />
          <DetailRow label="Fixture" value={state.user.fixture || 'placeholder'} />
          <DetailRow
            label="Note"
            value={state.user.note || 'Dummy fixture record only.'}
          />

          <Pressable
            accessibilityRole="button"
            onPress={loadUser}
            style={({pressed}) => [
              styles.refreshButton,
              pressed ? styles.refreshButtonPressed : null,
            ]}
            testID="dashboard-refresh">
            <Text style={styles.refreshLabel}>Refresh summary</Text>
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  );
}

function DetailRow({label, value}) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text selectable style={styles.detailValue}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ecfeff',
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingBottom: 40,
    paddingHorizontal: 20,
    paddingTop: 34,
  },
  hero: {
    marginBottom: 24,
  },
  eyebrow: {
    color: '#0f766e',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.8,
    marginBottom: 10,
  },
  heading: {
    color: '#0f172a',
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: -0.8,
  },
  subheading: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10,
    maxWidth: 520,
  },
  card: {
    backgroundColor: '#ffffff',
    borderColor: '#a5f3fc',
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
    shadowColor: '#164e63',
    shadowOffset: {height: 10, width: 0},
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 4,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: '#0f766e',
    borderRadius: 29,
    height: 58,
    justifyContent: 'center',
    marginBottom: 20,
    width: 58,
  },
  avatarLabel: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '800',
  },
  cardLabel: {
    color: '#0f766e',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
  },
  userName: {
    color: '#0f172a',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 7,
  },
  divider: {
    backgroundColor: '#e2e8f0',
    height: 1,
    marginVertical: 22,
  },
  detailRow: {
    marginBottom: 18,
  },
  detailLabel: {
    color: '#64748b',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  detailValue: {
    color: '#1e293b',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 5,
  },
  refreshButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#0f172a',
    borderRadius: 999,
    marginTop: 4,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  refreshButtonPressed: {
    opacity: 0.82,
  },
  refreshLabel: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
