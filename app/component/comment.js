import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Button } from 'react-native';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { database } from '../../config/firebaseConfig';


const CommentScreen = ({postId}) => {

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const commentsRef = collection(database, 'posts', postId, 'comments');

  useEffect(() => {
    // Check if postId is defined before fetching comments
    if (postId) {
      const unsubscribe = onSnapshot(commentsRef, (snapshot) => {
        if (snapshot && snapshot.docs) {
          const commentsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
  
          setComments(commentsData);
        } else {
          // Handle the case when snapshot or snapshot.docs is undefined
          setComments([]);
        }
      });
  
      return unsubscribe;
    }
  
    // Handle the case when postId is not defined
    setComments([]);
  }, [postId]);
  
  
  
  const handleSubmitComment = async () => {
    try {
      // Add comment to Firestore
      await addDoc(commentsRef, {
        text: newComment,
        // Add other fields like timestamp, author, etc.
      });

      // Clear input field
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error.message);
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
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ borderBottomWidth: 1, borderColor: 'gray', padding: 8 }}>
            <Text>{item.text}</Text>
            {/* Display other comment details as needed */}
          </View>
        )}
      />
    </View>
  );
};

export default CommentScreen;
