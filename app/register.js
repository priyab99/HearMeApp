import React, { useState, useEffect } from "react";
import { Text, TextInput, Pressable, Alert, KeyboardAvoidingView, Platform, StyleSheet, ScrollView } from "react-native";
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
      return true; 
    }

    const phoneNumberRegex = /^\d{11}$/; // a valid phone number has 11 digits
    return phoneNumberRegex.test(phoneNumber);//Checking if a string matches the regular expression pattern
  };

  const handleRegister = async () => {
    try {
      // Basic form validation
      if (!email || !password || !name || !username || !phoneNumber) {
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

      //checking if the phone number has 11 digits
      if (!isValidPhoneNumber()) {
        Alert.alert("Phone number has to be of 11 digits");
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
        phoneNumber
      });
      //redirecting to login
      router.replace('/');
    } catch (error) {
      Alert.alert(error.message);
    }
  };


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Adding a message indicating if the username is available or not */}
      <Text
        style={{ color: isUsernameAvailable ? 'green' : 'red', textAlign: 'center', marginBottom: 10 }}>
        {username.trim() !== "" && (
          isUsernameAvailable ? 'Username is available' : 'Username is taken'
        )}
      </Text>
      <ScrollView contentContainerStyle={styles.scollCotainer}>
        <Text style={{ fontSize: 25, marginBottom: 30,  textAlign: "center" }}>
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
        <Pressable
          onPress={handleRegister}
          style={styles.registerButton}>
          <Text style={styles.registerText}>Register</Text>
        </Pressable>
      </ScrollView>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    marginTop: 50
  },

  scollCotainer: {


    padding: 20,
    paddingTop: 40,
    paddingBottom: 50,
   // backgroundColor: '#fff',
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
  registerButton: {
    height: 40,
    borderRadius: 10,
    backgroundColor: 'navy',
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    marginBottom: 10,
  },
  registerText: {
    color: 'white', fontSize: 20, fontWeight: 'bold',
  }
});

export default RegisterPage;