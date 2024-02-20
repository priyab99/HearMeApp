import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Button } from 'react-native';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { database,auth } from '../../config/firebaseConfig';
import { useLocalSearchParams } from 'expo-router';


const CommentScreen = () => {
  const postId=useLocalSearchParams();
  

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const commentsRef = collection(database, 'posts', postId, 'comments');

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, 'comments'), where('postID', '==', postId)),
      (snapshot) => {
        setComments(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      }
    );
  
    return () => unsubscribe();
  }, [postId]);
  
  
  
  const handleSubmitComment = async (content) => {
    try {
      await addDoc(collection(db, 'comments'), {
        content,
        author: auth.currentUser.uid, // Assuming you have user authentication
        postId,
      });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
  

  return (
    <View style={{ flex: 1 }}>
      {/* Comment Input Field */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: 'gray', padding: 8, marginRight: 8 }}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={(text) => setNewComment(text)}
        />
        <Button title="Submit" onPress={handleSubmitComment} />
      </View>

      {/* List of Comments */}
      {comments && (
  <FlatList
    data={comments}
    // ... other FlatList props
    keyExtractor={(item) => item.id}
    renderItem={({ item }) => (
      <View style={{ borderBottomWidth: 1, borderColor: 'gray', padding: 8 }}>
        <Text>{item.text}</Text>
        {/* Display other comment details as needed */}
      </View>
    )}
  />
)}
    </View>
  );
};

export default CommentScreen;
