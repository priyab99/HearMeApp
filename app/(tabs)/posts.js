import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, updateDoc, doc, setDoc, onSnapshot, orderBy, query,getDoc } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { database, auth } from '../../config/firebaseConfig';
import RatingComponent from '../(component)/rating';
import { useRouter} from 'expo-router';


const HomeScreen = () => {


  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visiblePosts, setVisiblePosts] = useState([]); 
  const [hasMorePosts, setHasMorePosts] = useState(false);
  const router=useRouter();
  


  useEffect(() => {
    const fetchPosts = () => {
      const postsCollection = collection(database, 'posts');
      const q = query(postsCollection, orderBy('date', 'desc'));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedPosts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setPosts(fetchedPosts);
        setVisiblePosts(fetchedPosts.slice(0, 5)); // Updating visiblePosts after fetching
        setHasMorePosts(fetchedPosts.length > 5); // Checking for more posts
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchPosts();
  }, []);


  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  const handleLike = async (postId) => {
    try {
      const userId = auth.currentUser.uid;
      const postRef = doc(database, 'posts', postId);
      
      const postSnapshot = await getDoc(postRef);
      if (!postSnapshot.exists()) {
        console.error('Post not found');
        return;
      }
  
      const postData = postSnapshot.data();
      const likedByUser = postData.likesBy ? postData.likesBy.includes(userId) : false;
  
      if (likedByUser) {
        await updateDoc(postRef, {
          likes: postData.likes - 1,
          likesBy: postData.likesBy.filter(id => id !== userId),
        });
      } else {
        await updateDoc(postRef, {
          likes: postData.likes + 1,
          likesBy: [...(postData.likesBy || []), userId],
        });
      }
    } catch (error) {
      console.error('Error updating likes:', error.message);
    }
  };
  
  const handleDislike = async (postId) => {
    try {
      const userId = auth.currentUser.uid;
      const postRef = doc(database, 'posts', postId);
  
      const postSnapshot = await getDoc(postRef);
      if (!postSnapshot.exists()) {
        console.error('Post not found');
        return;
      }
  
      const postData = postSnapshot.data();
      const dislikedByUser = postData.dislikesBy ? postData.dislikesBy.includes(userId) : false;
  
      if (dislikedByUser) {
        await updateDoc(postRef, {
          dislikes: postData.dislikes - 1,
          dislikesBy: postData.dislikesBy.filter(id => id !== userId),
        });
      } else {
        await updateDoc(postRef, {
          dislikes: postData.dislikes + 1,
          dislikesBy: [...(postData.dislikesBy || []), userId],
        });
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
            
               
                <Text style={styles.text}> <Ionicons name="thumbs-up" size={17} color="gray" /> Like {post.likes}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDislike(post.id)}>
                
                 
               
                <Text style={styles.text}><Ionicons name="thumbs-down" size={17} color="gray" /> Dislike {post.dislikes}</Text>
              </TouchableOpacity>
            </View>

            {/* Comment and Rating (existing functionality) */}


            <View style={styles.actions}>
              <TouchableOpacity onPress={()=>router.push({ pathname: '/comment', params: { postId: post.id } })}>
                
                 <Text style={styles.text}>Comment</Text>
                </TouchableOpacity>


              <RatingComponent postId={post.id} onSubmitRating={handleRating} />

            </View>
          </TouchableOpacity>
        ))
      ) : (
        <Text>No posts found.</Text>
      )}
      {hasMorePosts && (
        <TouchableOpacity
          style={styles.seeMoreButton} 
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
  text:{
    fontSize: 16,

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
    backgroundColor: 'navy', 
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
    
  },
  seeMoreButtonText: {
    color: '#fff', 
    fontWeight: 'bold',
  },
});

export default HomeScreen;