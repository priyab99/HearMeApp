import React, { useEffect, useRef, useState } from 'react';
import { Text, TextInput, Button, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { firebase, database, auth } from "../../config/firebaseConfig"
import { setDoc, doc, getDoc } from "firebase/firestore";
import { gsap } from 'gsap-rn';
import {Back} from 'gsap';

import { useRouter } from 'expo-router';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://countries.trevorblades.com/graphql',
  cache: new InMemoryCache(),
});

const COUNTRY_QUERY = gql`
  query CountryQuery {
    countries {
      name
      states {
        code
        name
      }
    }
  }
`;

const AddPost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [states, setStates] = useState([]);
  const titleRef = useRef(null);//stores animation state


  const router = useRouter();

  const { data, loading, error } = useQuery(COUNTRY_QUERY);
  const [countries, setCountries] = useState([]);


  useEffect(() => {
    if (data) {
      setCountries(data.countries);
    }
  }, [data]);

 
  useEffect(() => {
    gsap.from(titleRef.current, {
      duration: 1,
      delay: 0.2,
      transform: { rotate: 360, scale: 0.5 },
      ease: Back.easeInOut
    });
  }, [])

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  };

  const handleCountryChange = (countryName) => {
    setSelectedCountry(countryName);
    const country = countries.find((c) => c.name === countryName);
    setStates(country ? country.states : []);
    setSelectedState('');
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
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
      const downloadURL = await snapshot.ref.getDownloadURL();
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handlePost = async () => {
    try {
      setUploading(true);
      const imageUrl = await uploadImage();
      const docRef = doc(database, 'posts', `post_${Date.now()}`);
      if (imageUrl) {
        const userDoc = await getDoc(doc(database, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          await setDoc(docRef, {
            title,
            description,
            category,
            date,
            image: imageUrl,
            userName: userDoc.data().username,
            country: selectedCountry,
            state: selectedState,
          });
        } else {
          await setDoc(docRef, {
            title,
            description,
            category,
            date,
            image: imageUrl,
            userName: 'Unknown',
            country: selectedCountry,
            state: selectedState,
          });
        }
      } else {
        await setDoc(docRef, {
          title,
          description,
          category,
          date,
          userName: 'Unknown',
          country: selectedCountry,
          state: selectedState,
        });
      }
      setTitle('');
      setDescription('');
      setCategory('');
      setDate(new Date());
      setImage(null);
      setSelectedCountry('');
      setSelectedState('');
      router.push('/posts');
    } catch (error) {
      console.error('Error adding post:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleTitleChange = (text) => {
    setTitle(text);
    setShowDescriptionInput(text.trim() !== '');
  };

  if (loading) return <ActivityIndicator />;
  if (error) {
    console.error("GraphQL Error:", error.message);
    return <Text>Error: {error.message}</Text>;
  }
  if (!countries || countries.length === 0) return <Text>No countries found.</Text>;

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Text ref={titleRef} style={styles.heading}>Add Your Post</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          onChangeText={handleTitleChange}
          value={title}
        />
        {showDescriptionInput && (
          <TextInput
            style={styles.desInput}
            placeholder="Description"
            onChangeText={(text) => setDescription(text)}
            value={description}
            multiline
          />
        )}
        <Text style={styles.label}>Category/Tags</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.input}
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="Select Category" value="" />
            <Picker.Item label="Relationships" value="Relationships" />
            <Picker.Item label="Anxiety" value="Anxiety" />
            <Picker.Item label="Self-Esteem" value="Self-Esteem" />
            <Picker.Item label="Depression" value="Depression" />
            <Picker.Item label="Stress" value="Stress" />
            <Picker.Item label="Anger" value="Anger" />
            <Picker.Item label="Grief and Loss" value="Grief" />
            <Picker.Item label="Loneliness" value="Loneliness" />
            <Picker.Item label="Family Issues" value="Family" />
            <Picker.Item label="Romantic Relationships" value="Romance" />
            <Picker.Item label="Friendships" value="Friendships" />
            <Picker.Item label="Breakup/Divorce" value="Breakup" />
            <Picker.Item label="Communication Issues" value="Communication" />
            <Picker.Item label="Life Transitions" value="Transitions" />
            <Picker.Item label="Work/Career" value="Work" />
            <Picker.Item label="Finances" value="Finances" />
            <Picker.Item label="School/Education" value="Education" />
            <Picker.Item label="Addiction" value="Addiction" />
            <Picker.Item label="Health Issues" value="Health" />
            <Picker.Item label="Legal Issues" value="Legal" />
            <Picker.Item label="Identity" value="Identity" />
            <Picker.Item label="Personal Growth" value="Growth" />
            <Picker.Item label="Self-Discovery" value="Self-Discovery" />
            <Picker.Item label="Setting Goals" value="Goals" />
            <Picker.Item label="Decision Making" value="Decision Making" />
            <Picker.Item label="Building Confidence" value="Confidence" />
            <Picker.Item label="Eating Disorders" value="Eating Disorders" />
            <Picker.Item label="Obsessive-Compulsive Disorder (OCD)" value="OCD" />
            <Picker.Item label="Post-Traumatic Stress Disorder (PTSD)" value="PTSD" />
          </Picker>
        </View>
        <Text style={styles.label}>Select your country</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.input}
            selectedValue={selectedCountry}
            onValueChange={handleCountryChange}
          >
            {countries.map((country, index) => (
              <Picker.Item key={index} label={country.name} value={country.name} />
            ))}
          </Picker>
        </View>
        {states.length > 0 && (
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.input}
              selectedValue={selectedState}
              onValueChange={(itemValue) => setSelectedState(itemValue)}
            >
              {states.map((state, index) => (
                <Picker.Item key={index} label={state.name} value={state.name} />
              ))}
            </Picker>
          </View>
        )}
        <Text style={styles.label}>Date:</Text>
        {Platform.OS === 'ios' ? (
          <Button title="Select Date" onPress={() => setShowDatePicker(true)} />
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
    </KeyboardAvoidingView>
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
    fontWeight: 'bold',
    
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
    backgroundColor: '#f5f5f5',
  },
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  desInput: {
    height: 'auto',
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
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 20,
    borderRadius: 8,
  },
  button: {
    marginBottom: 20,
    backgroundColor: 'navy',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});

const AddPostApp = () => (
  <ApolloProvider client={client}>
    <AddPost />
  </ApolloProvider>
);

export default AddPostApp;
