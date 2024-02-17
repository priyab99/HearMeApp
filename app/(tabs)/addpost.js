import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { firebase, database, auth } from "../../config/firebaseConfig"
import { setDoc,doc, getDoc } from "firebase/firestore";




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
  
      // Get download URL after image is successfully uploaded
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
  
      // Fix: Add a document ID for the post
      const docRef = doc(database, 'posts', `post_${Date.now()}`); // Use a timestamp for unique ID
  
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
    <View style={styles.container}>
      <Text style={styles.heading}>Add Your Post</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        onChangeText={(text) => setTitle(text)}
        value={title}
      />
      <TextInput
        style={styles.input}
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
        {/* Add more categories as needed */}
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
      <Button title='Select Image' onPress={pickImage} />
      {!uploading ? <Button title='Upload Image' onPress={uploadImage} /> : <ActivityIndicator size={'small'} color='black' />}


      <Button title="Post" onPress={handlePost} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  heading: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    marginBottom: 16,
  },
});

export default AddPost;
