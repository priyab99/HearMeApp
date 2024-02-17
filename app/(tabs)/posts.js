import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { database } from '../../config/firebaseConfig';



const HomeScreen = () => {
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

  const handleLike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const handleDislike = (postId) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, dislikes: post.dislikes + 1 } : post
      )
    );
  };

  const handleComment = (postId, comment) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, comments: [...post.comments, comment] } : post
      )
    );
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

            
            <Text style={styles.title}>{post.title}</Text>
          
         
          <Text style={styles.description}>{post.description}</Text>
          {post.image && <Image source={{ uri: post.image }} style={styles.image} />}

          {/* Like, Dislike, Comment, and Rating UI */}
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => handleLike(post.id)}>
              <Text>Like: {post.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDislike(post.id)}>
              <Text>Dislike: {post.dislikes}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleComment(post.id, 'A new comment')}>
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