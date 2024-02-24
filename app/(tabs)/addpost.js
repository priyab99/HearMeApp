import React, { useState } from 'react';
import { Text, TextInput, Button, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { firebase, database, auth } from "../../config/firebaseConfig"
import { setDoc, doc, getDoc } from "firebase/firestore";




const AddPost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'andriod');
    setDate(currentDate);
  };


  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1, // 0 means compress for small size, 1 means compress for maximum quality

    });
    console.log(result);
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };
  const uploadImage = async () => {
    try {
      if (!image) {
        console.warn('No image selected for upload.');
        return null;
      }

      const response = await fetch(image);
      const blob = await response.blob();

      const ref = firebase.storage().ref().child(`Pictures/Image_${Date.now()}`);
      const snapshot = await ref.put(blob);

      // Getting download URL after image is successfully uploaded
      const downloadURL = await snapshot.ref.getDownloadURL();

      console.log('Image uploaded successfully:', downloadURL);

      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };


  const handlePost = async () => {
    try {
      setUploading(true);

      // Uploading the image and get the download URL
      const imageUrl = await uploadImage();

      // Adding a document ID for the post
      const docRef = doc(database, 'posts', `post_${Date.now()}`); // Using a timestamp for unique ID

      if (imageUrl) {
        const userDoc = await getDoc(doc(database, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          await setDoc(docRef, {
            title,
            description,
            category,
            date,
            image: imageUrl,

            userName: userDoc.data().username, // Include user's username in the post
          });
        } else {
          console.warn('User document not found');
          await setDoc(docRef, {
            title,
            description,
            category,
            date,
            image: imageUrl,

            userName: 'Unknown', // Default value if user document not found
          });
        }
      } else {
        console.warn('Image URL is undefined. Skipping image field in Firestore.');
        await setDoc(docRef, {
          title,
          description,
          category,
          date,

          userName: 'Unknown', // Default value if image is not uploaded
        });
      }

      // Reset form fields
      setTitle('');
      setDescription('');
      setCategory('');
      setDate(new Date());
      setImage(null);
    } catch (error) {
      console.error('Error adding post:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -150}
    >
    <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
      <Text style={styles.heading}>Add Your Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        onChangeText={(text) => setTitle(text)}
        value={title}
        keyboardShouldPersistTaps="handled"
      />
      <TextInput
        style={styles.desInput}
        placeholder="Description"
        onChangeText={(text) => setDescription(text)}
        value={description}
        multiline
      />
      <Text style={styles.label}>Category:</Text>
      <Picker
        style={styles.input}
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue)}
      >
        <Picker.Item label="Select Category" value="" />
        <Picker.Item label="Life Struggle" value="Life Struggle" />
        <Picker.Item label="Depression" value="Depression" />
        <Picker.Item label="Motivation" value="Motivation" />
        <Picker.Item label="Relationships" value="Relationships" />
        <Picker.Item label="Success Stories" value="Success Stories" />
        <Picker.Item label="Mental Health" value="Mental Health" />
        <Picker.Item label="Anxiety" value="Anxiety" />
        <Picker.Item label="Personal Growth" value="Personal Growth" />
      </Picker>
      <Text style={styles.label}>Date:</Text>
      {Platform.OS === 'ios' ? (
        <Button
          title="Select Date"
          onPress={() => setShowDatePicker(true)}
        />
      ) : (
        <TextInput
          style={styles.input}
          placeholder="Date"
          onFocus={() => setShowDatePicker(true)}
          value={date.toDateString()}
        />
      )}
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleDateChange}
        />
      )}

      {image && <Image source={{ uri: image }} style={{ width: 170, height: 200 }} />}
     <TouchableOpacity style={styles.button} onPress={pickImage}><Text style={styles.buttonText}>Select Image</Text></TouchableOpacity>


      {!uploading ? <Button style={styles.button} title='Upload Image' onPress={uploadImage} /> : <ActivityIndicator size={'small'} color='black' />}
      <TouchableOpacity style={styles.button} onPress={handlePost}>
        <Text style={styles.buttonText}>Post</Text>
      </TouchableOpacity>

    </ScrollView>
      </KeyboardAvoidingView >
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    paddingBottom: 50,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold', // Make heading bold
  },
  input: {
    height: 40,
    borderColor: 'gray',
    maxHeight: 40,
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    width: '100%',
    backgroundColor: '#f5f5f5', // Set background color for input
  },
  desInput:{
    height: 'auto',  // Allow dynamic height
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: 'bold', // Make label bold
  },
  image: {
    width: '100%', // Make image take full width
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius: 8, // Apply border radius to the image
  },
  button: {
    marginBottom: 20,
    backgroundColor: '#007BFF', // Set button background color
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10
  },
  buttonText: {
    color: '#fff', // Set button text color
    fontSize: 18,
    fontWeight: 'bold', // Make button text bold
  },
});


export default AddPost;
