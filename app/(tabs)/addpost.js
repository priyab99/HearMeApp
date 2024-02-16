import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, Image, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { launchImageLibraryAsync } from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';




const AddPost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
   const [image, setImage] = useState(null);

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'andriod');
    setDate(currentDate);
  };

  
  const pickImage = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
  
    if (status !== 'granted') {
      alert('Sorry, we need permission to access your photos.');
      return;
    }
  
    try {
      const result = await launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.cancelled) {
        setImage(result.uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Failed to pick image. Please try again.');
    }
  };
  const handlePost = () => {
    // Add logic to handle the post (e.g., sending it to a server)
    console.log('Title:', title);
    console.log('Description:', description);
    console.log('Category:', category);
    console.log('Date:', date);
    console.log('Image:', image);
    // Add further logic as needed
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
       {image && (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.image} />
          <Button title="Remove Image" onPress={() => setImage(null)} />
        </View>
      )}
      <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
        <Text style={styles.imagePickerButtonText}>Choose Image</Text>
      </TouchableOpacity>
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
