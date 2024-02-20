import React, { useState, useEffect, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, updateDoc, doc, setDoc, onSnapshot } from 'firebase/firestore';

import Ionicons from '@expo/vector-icons/Ionicons';
import { database, auth } from '../../config/firebaseConfig';
import RatingComponent from '../component/rating';




const HomeScreen = () => {


  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [disabledPosts, setDisabledPosts] = useState([]);
  const [visiblePosts, setVisiblePosts] = useState([]); // Empty array initially
  const [hasMorePosts, setHasMorePosts] = useState(false);






  // ...

  useEffect(() => {
    const fetchPosts = () => {
      const postsCollection = collection(database, 'posts');

      const unsubscribe = onSnapshot(postsCollection, (querySnapshot) => {
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(fetchedPosts);
        setVisiblePosts(fetchedPosts.slice(0, 5)); // Update visiblePosts after fetching
        setHasMorePosts(fetchedPosts.length > 5); // Check for more posts
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchPosts();
  }, []);

  // ...


  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  const handleLike = async (postId) => {
    try {
      if (!disabledPosts.find((item) => item.postId === postId && item.action === 'like')) {
        // Incrementing the likes
        const updatedLikes = posts.find((post) => post.id === postId)?.likes + 1 || 1;

        // Updating Firebase document
        await updateDoc(doc(database, 'posts', postId), {
          likes: updatedLikes,
        });

        // Updating state
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

        // Adding postId to disabledPosts with action 'like'
        setDisabledPosts((prevDisabledPosts) => [...prevDisabledPosts, { postId, action: 'like' }]);

      }
    } catch (error) {
      console.error('Error updating likes:', error.message);
    }
  };

  const handleDislike = async (postId) => {
    try {
      if (!disabledPosts.find((item) => item.postId === postId && item.action === 'dislike')) {
        // Incrementing the dislikes
        const updatedDislikes = posts.find((post) => post.id === postId)?.dislikes + 1 || 1;

        // Updating Firebase document
        await updateDoc(doc(database, 'posts', postId), {
          dislikes: updatedDislikes,
        });

        // Updating state
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

        // Adding postId to disabledPosts with action 'dislike'
        setDisabledPosts((prevDisabledPosts) => [...prevDisabledPosts, { postId, action: 'dislike' }]);
      }
    } catch (error) {
      console.error('Error updating dislikes:', error.message);
    }
  };
  const handleRating = async (postId, rating) => {
    try {
      const userId = auth.currentUser.uid;
      const ratingDocRef = doc(collection(database, 'ratings', postId, 'userRatings'), userId);

      // Checking if rating is defined
      if (typeof rating !== 'undefined') {
        // creating new rating document for the user
        await setDoc(ratingDocRef, { rating });

        // Updating local state with the new rating
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId ? { ...post, userRating: rating } : post
          )
        );
      } else {
        console.error('Error updating rating: Rating is undefined');
      }
    } catch (error) {
      console.error('Error updating rating:', error.message);
    }
  };

  const loadMorePosts = () => {
    const newVisiblePosts = visiblePosts.concat(posts.slice(visiblePosts.length, visiblePosts.length + 5));
    setVisiblePosts(newVisiblePosts);
    setHasMorePosts(newVisiblePosts.length < posts.length);
  };


  return (
     <ScrollView style={styles.container}>
      {visiblePosts.length > 0 ? (
        visiblePosts.map((post) => (
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
            <RatingComponent postId={post.id} onSubmitRating={handleRating} />

          </View>
        </TouchableOpacity>
        ))
      ) : (
        <Text>No posts found.</Text>
      )}
      {hasMorePosts && (
       <TouchableOpacity
       style={styles.seeMoreButton} // Added style for the button
       onPress={() => loadMorePosts()}
     >
       <Text style={styles.seeMoreButtonText}>See More</Text>
     </TouchableOpacity>
      )}
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
  seeMoreButton: {
    padding: 10,
    backgroundColor: '#3498db', // Example color (feel free to change)
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  seeMoreButtonText: {
    color: '#fff', // Example color (feel free to change)
    fontWeight: 'bold',
  },
});

export default HomeScreen;