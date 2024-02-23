import React, { useState } from 'react';
import { TextInput, Pressable, View, Text, StyleSheet } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {auth} from '../config/firebaseConfig'
import { Alert } from 'react-native';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Handling login logic here
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
  
          // Check if the user's email is verified
          if (user.emailVerified) {
            console.log("Login success");
            router.replace('/posts'); // Navigate to the Posts page after successful login
          } else {
            // If email is not verified, show an alert or perform some action
            Alert.alert("Email not verified", "Please verify your email before logging in.");
          }
        })
        .catch((err) => {
          Alert.alert("Login error", err.message);
        });
    }
  };
  
     return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={styles.input}
      />

      <Pressable
        onPress={handleLogin}
        style={styles.loginButton}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </Pressable>
      <Text style={styles.firstTimeText}>First time on HearMe?</Text>

      <Link href="/register" asChild>
        <Pressable>
          <Text style={styles.createAccountText}>Create Account</Text>
        </Pressable>
      </Link>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderRadius: 10,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 200,
  },
  loginButton: {
    height: 40,
    borderRadius: 10,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    marginBottom: 10,
  },
  loginButtonText: {
    color: 'white',
  },
  firstTimeText: {
    marginBottom: 10,
    fontSize: 14,
    color: 'gray',
  },
  createAccountText: {
    color: 'blue',
  },
});

export default LoginPage;
