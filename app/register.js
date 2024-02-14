import React, { useState } from "react";
import { Text, View, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { auth } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification, signInWithPhoneNumber, confirm } from "firebase/auth";

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  const handleRegister = async () => {
    try {
      // Basic form validation
      if (!email || !password) {
        Alert.alert("Please enter both email and password");
        return;
      }

      // Password and confirm password matching validation
      if (password !== confirmPassword) {
        Alert.alert("Password and confirm password do not match");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);

      Alert.alert('A verification email has been sent. Please check your inbox.');

      // Optionally, you can add firestore code here if needed
      // ...

      router.replace('/posts');
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  

  const router = useRouter();

  const styles = {
    input: {
      height: 40,
      borderRadius: 10,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingHorizontal: 10,
      width: 200,
    },
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
        style={styles.input}
      />
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
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
        style={styles.input}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter image URL"
        value={imageURL}
        onChangeText={(text) => setImageURL(text)}
      />
      <TextInput
        placeholder="Phone Number"
        value={phoneNumber}
        onChangeText={(text) => setPhoneNumber(text)}
        style={styles.input}
      />

      <Pressable
        onPress={handleRegister}
        style={{
          height: 40,
          borderRadius: 10,
          backgroundColor: 'blue',
          justifyContent: 'center',
          alignItems: 'center',
          width: 80,
          marginBottom: 10
        }}>
        <Text style={{ color: 'white' }}>Register</Text>
      </Pressable>

      
    </View>
  );
};

export default RegisterPage;
