import React, { useState } from 'react';
import { TextInput, Pressable, View, Text, StyleSheet, KeyboardAvoidingView, Platform ,  Keyboard} from 'react-native';
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
  
          // Checking if the user's email is verified
          if (user.emailVerified) {
            console.log("Login success");
            router.replace('/posts'); // Navigating to the Home Screen after successful login
          } else {
            // If email is not verified, showing an alert or perform some action
            Alert.alert("Email not verified", "Please verify your email before logging in.");
          }
        })
        .catch((err) => {
          Alert.alert("Login error", err.message);
        });
    }
  };
  
     return (
      <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -160}
    >
    <View style={styles.container}>
       <Text style={{ fontSize: 25, marginBottom: 20 }}>
        Login to <Text style={{ fontWeight: 'bold', color: 'purple', fontStyle: 'italic' }}>HearMe</Text>
      </Text>
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
      <Text style={styles.firstTimeText}>First time on <Text style={{ fontWeight: 'bold', fontStyle: 'italic' }}>HearMe?</Text></Text>

      <Link href="/register" asChild>
        <Pressable>
          <Text style={styles.createAccountText}>Create Account</Text>
        </Pressable>
      </Link>
    </View>
    </KeyboardAvoidingView>
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
    width: 250,
  },
  loginButton: {
    height: 40,
    borderRadius: 10,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    marginBottom: 10,
    fontSize: 10
  },
  loginButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  firstTimeText: {
    marginBottom: 10,
    fontSize: 20,
    color: 'gray',
    marginTop: 45,

  },
  createAccountText: {
    color: 'blue',
    fontSize: 18,
  },
});

export default LoginPage;
