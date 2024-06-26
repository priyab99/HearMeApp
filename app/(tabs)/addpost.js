import React, { useEffect, useRef, useState } from 'react';
import { Text, TextInput, Button, StyleSheet, ScrollView, Image, ActivityIndicator, TouchableOpacity, KeyboardAvoidingView, Platform, View, Pressable } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { firebase, database, auth } from "../../config/firebaseConfig"
import { setDoc, doc, getDoc } from "firebase/firestore";
import { gsap } from 'gsap-rn';
import { Back } from 'gsap';
import { useRouter } from 'expo-router';
import { ApolloClient, InMemoryCache, ApolloProvider, useQuery, gql } from '@apollo/client';

// Initializing Apollo Client
const client = new ApolloClient({
  uri: 'https://countries.trevorblades.com/graphql',
  cache: new InMemoryCache(),
});

const COUNTRY_QUERY = gql`
  query CountryQuery {
    countries {
      name
      capital
      currency
    }
  }
`;




const AddPost = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('');
  const titleRef = useRef(null);//stores animation state

  const router = useRouter();

  const { data, loading, error } = useQuery(COUNTRY_QUERY);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    if (data) {
      setCountries(data.countries);
    }
  }, [data]);

  async function fetchEmotionAnalysis(data) {
    const token = process.env.EXPO_TOKEN; // Replace this with your actual token
    const response = await fetch(
      "https://api-inference.huggingface.co/models/SamLowe/roberta-base-go_emotions",
      {
        headers: { Authorization: `Bearer ${token}` },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.json();
    return result;
  }


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

    // For Android, manually hiding the DateTimePicker after date selection
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
  };




  const [categories, setCategories] = useState({
    '': ['Select Your Post Category'],
    'Life Stages': ['Childhood', 'Teenage Years', 'Young Adulthood', 'Adulthood', 'Midlife', 'Retirement', 'Senior Years'],
  'Experiences': ['Love & Relationships', 'Family & Friends', 'Career & Work', 'Travel & Adventure', 'Personal Growth', 'Overcoming Challenges', 'Success Stories'],
  'Emotions': ['Joy', 'Sadness', 'Anger', 'Fear', 'Love', 'Hope', 'Gratitude', 'Forgiveness'],
  'Themes': ['Inspiration', 'Motivation', 'Advice', 'Humor', 'Vulnerability', 'Identity', 'Loss']
  });

  useEffect(() => {
    // Resetting subcategory when the main category changes
    setSubCategory('');
  }, [mainCategory]);


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
      const sentimentResult = await fetchEmotionAnalysis({ inputs: description });
      // Extracting dominant sentiment
      let dominantSentiment;
      let maxScore = 0;

      sentimentResult[0].forEach(sentiment => {
        if (sentiment.score > maxScore) {
          dominantSentiment = sentiment.label;
          maxScore = sentiment.score;
        }
      });

      if (imageUrl) {
        const userDoc = await getDoc(doc(database, 'users', auth.currentUser.uid));
        if (userDoc.exists()) {
          await setDoc(docRef, {
            title,
            description,
            category: `${mainCategory} - ${subCategory}`,
            date,
            image: imageUrl,
            userName: userDoc.data().username, // Include user's username in the post
            emotionScore: dominantSentiment,
            country: selectedCountry,
          });
        } else {
          console.warn('User document not found');
          await setDoc(docRef, {
            title,
            description,
            category: `${mainCategory} - ${subCategory}`,
            date,
            image: imageUrl,

            userName: 'Unknown', // Default value if user document not found
            emotionScore: dominantSentiment,
            country: selectedCountry,
          });
        }
      } else {
        console.warn('Image URL is undefined. Skipping image field in Firestore.');
        await setDoc(docRef, {
          title,
          description,
          category: `${mainCategory} - ${subCategory}`,
          date,
          userName: 'Unknown', // Default value if image is not uploaded
          emotionScore: dominantSentiment,
          country: selectedCountry,
        });
      }

      // Resetting form fields
      setTitle('');
      setDescription('');
      setMainCategory('');
      setSubCategory('');
      setDate(new Date());
      setImage(null);
      setSelectedCountry('');

      router.push('/posts');

    } catch (error) {
      console.error('Error adding post:', error);
    } finally {
      setUploading(false);
    }
  };
  const handleTitleChange = (text) => {
    setTitle(text);
    setShowDescriptionInput(text.trim() !== ''); // Show description input when title is not empty
  };

  if (loading) return <ActivityIndicator />;
  if (error) {
    console.error("GraphQL Error:", error.message);
    return <Text>Error: {error.message}</Text>;
  }
  if (!countries || countries.length === 0) return <Text>No countries found.</Text>;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? -50 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text ref={titleRef} style={styles.heading}>Add Your Post</Text>
        <TextInput
          style={styles.input}
          placeholder="Title"
          onChangeText={handleTitleChange}
          value={title}
          keyboardShouldPersistTaps="handled"
        />
        {showDescriptionInput && (
          <TextInput
            style={styles.desInput}
            placeholder="Description"
            onChangeText={(text) => setDescription(text)}
            value={description}
            multiline
            keyboardShouldPersistTaps="handled"
          />
        )}
        <Text style={styles.label}>Select Your Post Category</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.input}
            selectedValue={mainCategory}
            onValueChange={(itemValue) => setMainCategory(itemValue)}
            keyboardShouldPersistTaps="handled"
          >
            {Object.keys(categories).map((mainCat) => (
              <Picker.Item key={mainCat} label={mainCat} value={mainCat} />
            ))}
          </Picker>
        </View>
        {mainCategory !== '' && (
          <View style={styles.pickerContainer}>
            <Picker
              style={styles.input}
              selectedValue={subCategory}
              onValueChange={(itemValue) => setSubCategory(itemValue)}
              enabled={mainCategory !== ''}
              keyboardShouldPersistTaps="handled"
            >
              {categories[mainCategory].map((subCat) => (
                <Picker.Item key={subCat} label={subCat} value={subCat} />
              ))}
            </Picker>
          </View>
        )}

        <Text style={styles.label}>Select Your Country</Text>
        <View style={styles.pickerContainer}>
          <Picker
            style={styles.input}
            selectedValue={selectedCountry}
            onValueChange={(itemValue) => setSelectedCountry(itemValue)}
            keyboardShouldPersistTaps="handled"
          >
            {countries.map((country, index) => (
              <Picker.Item key={index} label={country.name} value={country.name} />
            ))}
          </Picker>
        </View>


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
            keyboardShouldPersistTaps="handled"
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
  },
});


const AddPostApp = () => (
  <ApolloProvider client={client}>
    <AddPost />
  </ApolloProvider>
);

export default AddPostApp;
