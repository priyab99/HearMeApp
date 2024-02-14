import React, { useState } from "react";
import { Text, View, TextInput, Pressable, Button } from "react-native";
import { useRouter } from "expo-router";

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = () => {
    // handling registration logic here

  
  };

  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
        style={{
            height: 40,
            borderRadius: 10, 
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 10,
            paddingHorizontal: 10,
            width: 200,
        }}
      />
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={(text) => setEmail(text)}
        style={{
            height: 40,
            borderRadius: 10, 
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 10,
            paddingHorizontal: 10,
            width: 200,
        }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        style={{
            height: 40,
            borderRadius: 10, 
            borderColor: 'gray',
            borderWidth: 1,
            marginBottom: 10,
            paddingHorizontal: 10,
            width: 200,
        }}
      />
      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
        style={{
          height: 40,
          borderRadius: 10, 
          borderColor: 'gray',
          borderWidth: 1,
          marginBottom: 10,
          paddingHorizontal: 10,
          width: 200,
        }}
      />

      <Pressable onPress={handleRegister}   style={{
          height: 40,
          borderRadius: 10,
          backgroundColor: 'blue',
          justifyContent: 'center',
          alignItems: 'center',
         
          width: 80,
          marginBottom: 10
        }}>
       <Text style={{ color: 'white'}}>Register</Text>
      </Pressable>
    </View>
  );
};

export default RegisterPage;
