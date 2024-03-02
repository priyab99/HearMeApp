import React, { useState, useEffect } from "react";
import { Text, View, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, StyleSheet,  Keyboard } from "react-native";
import { useRouter } from "expo-router";
import { auth, database } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');

  const router = useRouter();

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (username.trim() !== "") {
        try {
          setIsUsernameAvailable(true);
          //console.log("Checking username availability for:", username);
          const querySnapshot = await getDocs(collection(database, 'users'));
          querySnapshot.forEach((doc) => {
            if (doc.data().username === username) {
              //console.log("Username is taken");
              setIsUsernameAvailable(false);
            }
          });
        } catch (error) {
          console.error("Error checking username availability:", error.message);
        }
      }
    };

    // Checking username availability on each change to the 'username' state
    checkUsernameAvailability();
  }, [username]);

  const isValidPhoneNumber = () => {
    if (phoneNumber.trim() === '') {
      return true; // Optional: Phone number is not required
    }
    
    const phoneNumberRegex = /^\d{11}$/; // a valid phone number has 11 digits
    return phoneNumberRegex.test(phoneNumber);
  };

  const handleRegister = async () => {
    try {
      // Basic form validation
      if (!email || !password || !name || !username || !isValidPhoneNumber()) {
        Alert.alert("Please fill in all fields");
        return;
      }

      // Password and confirm password matching validation
      if (password !== confirmPassword) {
        Alert.alert("Password and confirm password do not match");
        return;
      }

      // Checking if the username is available
      if (!isUsernameAvailable) {
        Alert.alert("Username is already taken. Please choose another.");
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      //await updateProfile(user, { displayName: name });
      updateProfile(auth.currentUser, {
        displayName: name
      }).then(() => {
        // Profile updated!
        // ...
      }).catch((error) => {
        // An error occurred
        // ...
      });

      // Sending email verification
      await sendEmailVerification(user);

      Alert.alert('A verification email has been sent. Please check your inbox.');

      // Adding Firestore code to store user information
      await setDoc(doc(database, 'users', user.uid), {
        name,
        email,
        username,
      });
      //redirecting to login
      router.replace('/');
    } catch (error) {
      Alert.alert(error.message);
    }
  };



  const styles =StyleSheet.create( {
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
    }
  });
  
  return (
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}>
      
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        {/* Displaying the message */}
        <Text style={{ fontSize: 25, marginBottom: 20 }}>
          Sign up to <Text style={{ fontWeight: 'bold', color: 'purple', fontStyle: 'italic' }}>HearMe</Text>
        </Text>
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
          placeholder="Username"
          value={username}
          onChangeText={(text) => setUsername(text)}
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
          placeholder="Phone Number"
          value={phoneNumber}
          onChangeText={(text) => setPhoneNumber(text)}
          keyboardType="phone-pad"
          style={styles.input}
        />

        {/* Adding a message indicating if the username is available or not */}
        {username.trim() !== "" && (
          <Text style={{ color: isUsernameAvailable ? 'green' : 'red' }}>
            {isUsernameAvailable ? 'Username is available' : 'Username is taken'}
          </Text>
        )}
        <Pressable
          onPress={handleRegister}
          style={{
            height: 40,
            borderRadius: 10,
            backgroundColor: 'blue',
            justifyContent: 'center',
            alignItems: 'center',
            width: 250,
            marginBottom: 10,
          }}>
          <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', }}>Register</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterPage;