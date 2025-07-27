import { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import {
  useAuthRequest,
  makeRedirectUri,
  ResponseType,
  exchangeCodeAsync,
} from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
};

const clientId = 'GOOGLE_CLIENT_ID'; // replace with your client ID

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId,
      responseType: ResponseType.Code,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: makeRedirectUri({ useProxy: true }),
      usePKCE: true,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      (async () => {
        const { code } = response.params;
        const tokenResult = await exchangeCodeAsync(
          {
            clientId,
            code,
            redirectUri: makeRedirectUri({ useProxy: true }),
            extraParams: { code_verifier: request?.codeVerifier || '' },
          },
          discovery
        );
        const idToken = tokenResult.id_token;
        await fetch('http://localhost:3001/login/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id_token: idToken }),
        });
      })();
    }
  }, [response]);

  async function handleEmailLogin() {
    const res = await fetch('http://localhost:3001/login/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      Alert.alert('Login failed');
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title="Login" onPress={handleEmailLogin} />
      <View style={styles.spacer} />
      <Button
        title="Login with Google"
        onPress={() => promptAsync({ useProxy: true })}
        disabled={!request}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 12,
    padding: 8,
    borderRadius: 4,
  },
  spacer: { height: 20 },
});
