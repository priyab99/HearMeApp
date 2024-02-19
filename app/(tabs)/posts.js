import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs, updateDoc, doc} from 'firebase/firestore'; 


import Ionicons from '@expo/vector-icons/Ionicons';


//import { firebase } from '../../config/firebaseConfig';
//import { useRouter , useNavigation} from 'expo-router';
//import {  } from 'firebase/firestore';



import { database } from '../../config/firebaseConfig';



const HomeScreen = () => {
  

  //const navigation=useNavigation();
 // const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(database, 'posts');
        const querySnapshot = await getDocs(postsCollection);

        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),

        }));

        setPosts(fetchedPosts);
      } catch (error) {
        console.error('Error fetching posts:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  const handleLike = async (postId) => {
    try {
      // Increment the likes in your JavaScript code
      const updatedLikes = posts.find((post) => post.id === postId)?.likes + 1 || 1;
  
      // Update Firebase document
      await updateDoc(doc(database, 'posts', postId), {
        likes: updatedLikes,
      });
  
      // Update state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: updatedLikes,
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error updating likes:', error.message);
    }
  };
  
  const handleDislike = async (postId) => {
    try {
      // Increment the dislikes in your JavaScript code
      const updatedDislikes = posts.find((post) => post.id === postId)?.dislikes + 1 || 1;
  
      // Update Firebase document
      await updateDoc(doc(database, 'posts', postId), {
        dislikes: updatedDislikes,
      });
  
      // Update state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                dislikes: updatedDislikes,
              }
            : post
        )
      );
    } catch (error) {
      console.error('Error updating dislikes:', error.message);
    }
  };
  



const handleComment = (postId) => {
  //router.push('/component/comment', { postId });
};




  const handleRating = (postId, rating) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, rating } : post
      )
    );
  };


  return (
    <ScrollView style={styles.container}>
      {posts.map((post) => (

        <TouchableOpacity key={post.id} style={styles.card}>
          <Text style={styles.userName}>{post.userName}</Text>
          <Text style={styles.date}>{new Date(post.date.seconds * 1000).toLocaleDateString()}</Text>
          <Text style={styles.category}>{post.category}</Text>


          <Text style={styles.title}>{post.title}</Text>



          <Text style={styles.description}>{post.description}</Text>
          {post.image && <Image source={{ uri: post.image }} style={styles.image} />}

          {/* Like, Dislike, Comment, and Rating UI */}

          {/* Like and Dislike Buttons and Counts */}
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => handleLike(post.id)}>
              <Ionicons name="thumbs-up" size={24} color="blue" />
              <Text> {post.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDislike(post.id)}>
              <Ionicons name="thumbs-down" size={24} color="red" />
              <Text> {post.dislikes}</Text>
            </TouchableOpacity>
          </View>

          {/* Comment and Rating (existing functionality) */}
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => handleComment(post.id)}>
              <Text>Comment</Text>
            </TouchableOpacity>


            <TouchableOpacity onPress={() => handleRating(post.id, 5)}>
              <Text>Rate: {post.rating}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
});

export default HomeScreen;