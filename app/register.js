import React, { useState, useEffect } from "react";
import { Text, View, TextInput, Pressable, Alert } from "react-native";
import { useRouter } from "expo-router";
import { auth, database } from '../config/firebaseConfig';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { doc, setDoc, getDocs ,collection} from "firebase/firestore";

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);

  useEffect(() => {
    const checkUsernameAvailability = async () => {
      if (username.trim() !== "") {
        try {
          setIsUsernameAvailable(true);
          //console.log("Checking username availability for:", username);
          const querySnapshot = await getDocs(collection(database, 'users'));
          //console.log("Query Snapshot:", querySnapshot.docs.map(doc => doc.data()));
          querySnapshot.forEach((doc) => {
            if (doc.data().username === username) {
              //console.log("Username is taken");
              setIsUsernameAvailable(false);
            }
          });
          //console.log("Is Username Available:", isUsernameAvailable);
        } catch (error) {
          console.error("Error checking username availability:", error.message);
        }
      }
    };

    // Checking username availability on each change to the 'username' state
    checkUsernameAvailability();
  }, [username]);

  const handleRegister = async () => {
    try {
      // Basic form validation
      if (!email || !password || !name || !username) {
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

      await updateProfile(user, { displayName: name });

      // Sending email verification
      await sendEmailVerification(user);

      Alert.alert('A verification email has been sent. Please check your inbox.');

      // Adding Firestore code to store user information
      await setDoc(doc(database, 'users', user.uid), {
        name,
        email,
        username,
      });
      

      router.replace('/');
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
      {/* Adding a message indicating if the username is available or not */}
      {username.trim() !== "" && (
        <Text style={{ color: isUsernameAvailable ? 'green' : 'red' }}>
          {isUsernameAvailable ? 'Username is available' : 'Username is taken'}
        </Text>
      )}
      {/* ... other input fields */}
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