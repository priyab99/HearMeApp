import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { collection, onSnapshot, orderBy, query, doc, updateDoc } from 'firebase/firestore';
import Ionicons from '@expo/vector-icons/Ionicons';
import { database, auth } from '../../config/firebaseConfig';
//import { useRouter } from 'expo-router';
import CommentScreen from '../(component)/comment';

const HomeScreen = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [showComments, setShowComments] = useState({});
  const postsPerPage = 6;
 // const router = useRouter();

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
        setLoading(false);
      });

      return () => unsubscribe();
    };

    fetchPosts();
  }, []);

  const toggleComments = (postId) => {
    setShowComments((prevState) => ({
      ...prevState,
      [postId]: !prevState[postId],
    }));
  };

  const totalPages = Math.ceil(posts.length / postsPerPage);

  const handleLike = async (postId) => {
    try {
      const userId = auth.currentUser.uid;
      const postIndex = posts.findIndex((post) => post.id === postId);
      const updatedPosts = [...posts];

      if (postIndex > -1) {
        const postData = { ...updatedPosts[postIndex] };
        const likedByUser = postData.likesBy ? postData.likesBy.includes(userId) : false;
        let likes = postData.likes || 0;
        let dislikes = postData.dislikes || 0;

        if (likedByUser) {
          likes -= 1;
          postData.likesBy = postData.likesBy.filter((id) => id !== userId);
        } else {
          likes += 1;
          postData.likesBy = [...(postData.likesBy || []), userId];
          if (postData.dislikesBy && postData.dislikesBy.includes(userId)) {
            dislikes -= 1;
            postData.dislikesBy = postData.dislikesBy.filter((id) => id !== userId);
          }
        }

        postData.likes = likes;
        postData.dislikes = dislikes;
        updatedPosts[postIndex] = postData;
        setPosts(updatedPosts);

        // Update Firestore
        const postDoc = doc(database, 'posts', postId);
        await updateDoc(postDoc, {
          likes: postData.likes,
          likesBy: postData.likesBy || [],
          dislikes: postData.dislikes,
          dislikesBy: postData.dislikesBy || [],
        });
      }
    } catch (error) {
      console.error('Error updating likes:', error.message);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const userId = auth.currentUser.uid;
      const postIndex = posts.findIndex((post) => post.id === postId);
      const updatedPosts = [...posts];

      if (postIndex > -1) {
        const postData = { ...updatedPosts[postIndex] };
        const dislikedByUser = postData.dislikesBy ? postData.dislikesBy.includes(userId) : false;
        let dislikes = postData.dislikes || 0;
        let likes = postData.likes || 0;

        if (dislikedByUser) {
          dislikes -= 1;
          postData.dislikesBy = postData.dislikesBy.filter((id) => id !== userId);
        } else {
          dislikes += 1;
          postData.dislikesBy = [...(postData.dislikesBy || []), userId];
          if (postData.likesBy && postData.likesBy.includes(userId)) {
            likes -= 1;
            postData.likesBy = postData.likesBy.filter((id) => id !== userId);
          }
        }

        postData.dislikes = dislikes;
        postData.likes = likes;
        updatedPosts[postIndex] = postData;
        setPosts(updatedPosts);

        // Update Firestore
        const postDoc = doc(database, 'posts', postId);
        await updateDoc(postDoc, {
          dislikes: postData.dislikes,
          dislikesBy: postData.dislikesBy || [],
          likes: postData.likes,
          likesBy: postData.likesBy || [],
        });
      }
    } catch (error) {
      console.error('Error updating dislikes:', error.message);
    }
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
  };

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const visiblePosts = posts.slice(currentPage * postsPerPage, (currentPage + 1) * postsPerPage);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  return (
    <ScrollView style={styles.container}>
      {visiblePosts.length > 0 ? (
        visiblePosts.map((post) => (
          <TouchableOpacity key={post.id} style={styles.card}>
          <Text style={styles.userName}>{post.userName}</Text>
          <Text style={styles.date}>{new Date(post.date.seconds * 1000).toLocaleDateString()}</Text>
          <Text style={styles.category}>{post.category}</Text>
          <Text style={styles.country}>{post.country},{post.state}</Text>
          <Text style={styles.title}>{post.title}</Text>
          <Text style={styles.description}>{post.description}</Text>
          {post.image && <Image source={{ uri: post.image }} style={styles.image} />}
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => handleLike(post.id)}>
              <Text style={styles.text}><Ionicons name="thumbs-up" size={17} color="gray" /> Like {post.likes ? post.likes : 0}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDislike(post.id)}>
              <Text style={styles.text}><Ionicons name="thumbs-down" size={17} color="gray" /> Dislike {post.dislikes ? post.dislikes : 0}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actions}>
            <TouchableOpacity onPress={() => toggleComments(post.id)}>
              <Text style={styles.text}>
                <Ionicons name="chatbubble-outline" size={16} color="gray" /> {showComments[post.id] ? 'Hide Comments' : 'Comments'}
              </Text>
            </TouchableOpacity>
          </View>
          {showComments[post.id] && <CommentScreen postId={post.id} />}
        </TouchableOpacity>
        
        ))
      ) : (
        <Text>No posts found.</Text>
      )}
      <View style={styles.pagination}>
        <TouchableOpacity onPress={goToPreviousPage} disabled={currentPage === 0}>
          <Text style={[styles.paginationButton, currentPage === 0 && styles.disabledButton]}>{'<'}</Text>
        </TouchableOpacity>
        {Array.from({ length: totalPages }).map((_, index) => (
          <TouchableOpacity key={index} onPress={() => goToPage(index)}>
            <Text style={[styles.pageNumber, currentPage === index && styles.activePageNumber]}>{index + 1}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={goToNextPage} disabled={currentPage === totalPages - 1}>
          <Text style={[styles.paginationButton, currentPage === totalPages - 1 && styles.disabledButton]}>{'>'}</Text>
        </TouchableOpacity>
      </View>
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
  text: {
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
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  paginationButton: {
    padding: 10,
    color: 'navy',
  },
  disabledButton: {
    color: 'gray',
  },
  pageNumber: {
    padding: 10,
    color: 'navy',
  },
  emotionScore: {
    fontSize: 16,
    marginBottom: 5,
    color: 'navy',
  },
  activePageNumber: {
    fontWeight: 'bold',
  },
});

export default HomeScreen;