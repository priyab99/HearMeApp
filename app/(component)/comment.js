import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, FlatList, Button } from 'react-native';

import { database, auth } from '../../config/firebaseConfig';
import { collection, query, orderBy, onSnapshot, addDoc,getDoc, doc } from 'firebase/firestore';
import { useLocalSearchParams } from 'expo-router';
import { AuthenticatedUserContext } from '../App';

const CommentScreen = () => {
  const { postId } = useLocalSearchParams();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(database, 'users', auth.currentUser.uid));

        if (userDoc.exists()) {
          setUser(userDoc.data());
        } else {
          console.error('User document not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };

    fetchUserData();
  }, []);

  

  useEffect(() => {
    const fetchComments = async () => {
      const commentsCollectionRef = collection(database, 'posts', postId, 'comments');
      const q = query(commentsCollectionRef, orderBy('createdAt', 'asc'));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedComments = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setComments(fetchedComments);
      });

      return () => unsubscribe();
    };

    fetchComments();
  }, [postId]);

  const handleSubmitComment = async (content) => {
    try {
      const userId = auth.currentUser.uid;
      if (!userId) {
        console.error('Error adding comment: User not authenticated');
        return;
      }

      const commentsCollectionRef = collection(database, 'posts', postId, 'comments');

      await addDoc(commentsCollectionRef, {
        content: String(content),
        author: userId ,
        name: user?.name || 'Anonymous',
        createdAt: new Date(),
      });
      setNewComment('');
      // Additional logic if needed
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Comment Input Field */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TextInput
          style={{ flex: 1, borderWidth: 1, borderColor: 'gray', padding: 8, marginRight: 8, marginTop: 10 , marginLeft: 5}}
          placeholder="Add a comment..."
          value={newComment}
          onChangeText={(text) => setNewComment(text)}
        />
        <Button title="Submit" onPress={() => handleSubmitComment(newComment)} />
      </View>

      {/* Display Comments */}
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 8, borderBottomWidth: 1, borderBottomColor: 'gray' }}>
            <Text>{item.content}</Text>
            <Text>By: {item?.name || 'Anonymous'} </Text>
          </View>
        )}
      />
    </View>
  );
};

export default CommentScreen;
