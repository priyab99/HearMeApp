import React, { useState } from 'react';

import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet, Pressable } from 'react-native';


const HomeScreen = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      UserName: "Kriti",
      title: 'Feeling Sad',
      description: 'I am feeling very low today. My thougts are not okay. I dont know what to do',
      imageUrl: 'https://media.glamourmagazine.co.uk/photos/6274ec0e46a1a79c69ae3ccf/16:9/w_2560%2Cc_limit/HIGH%2520FUNCTIONING%2520DEPRESSION%2520090221%2520%2520%2520GettyImages-1301653190_SF.jpg',
      likes: 0,
      dislikes: 0,
      comments: [],
      rating: 0,
    },
    {
      id: 2,
      UserName: "Ria",
      title: 'Financial Struggle',
      description: 'I dont have enough money right now. I dont know how will i get money.',
      imageUrl: 'https://media.glamourmagazine.co.uk/photos/6274ec0e46a1a79c69ae3ccf/16:9/w_2560%2Cc_limit/HIGH%2520FUNCTIONING%2520DEPRESSION%2520090221%2520%2520%2520GettyImages-1301653190_SF.jpg',
      likes: 0,
      dislikes: 0,
      comments: [],
      rating: 0,
    },
    {
      id: 3,
      UserName: "Mamun",
      title: 'Academic Pressure',
      description: 'I am dealing with too much pressure. I dont know how to keep up with the current education process of our university.',
      imageUrl: 'https://media.glamourmagazine.co.uk/photos/6274ec0e46a1a79c69ae3ccf/16:9/w_2560%2Cc_limit/HIGH%2520FUNCTIONING%2520DEPRESSION%2520090221%2520%2520%2520GettyImages-1301653190_SF.jpg',
      likes: 0,
      dislikes: 0,
      comments: [],
      rating: 0,
    },
  
  ]);

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
            <Text style={styles.UserName}>{post.UserName}</Text>
            
            <Text style={styles.title}>{post.title}</Text>
          
         
          <Text style={styles.description}>{post.description}</Text>
          {post.imageUrl && <Image source={{ uri: post.imageUrl }} style={styles.image} />}

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