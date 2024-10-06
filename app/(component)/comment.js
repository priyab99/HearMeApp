import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, Button, StyleSheet } from 'react-native';
import { database, auth } from '../../config/firebaseConfig';
import { collection, query as firestoreQuery, orderBy, onSnapshot, addDoc, getDoc, doc } from 'firebase/firestore';

const CommentScreen = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [user, setUser] = useState(null);

  async function fetchSentimentAnalysis(data) {
    const token = process.env.EXPO_TOKEN;
    const response = await fetch(
      "https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest",
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
      const q = firestoreQuery(commentsCollectionRef, orderBy('createdAt', 'asc'));

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

      const sentimentResult = await fetchSentimentAnalysis({ "inputs": content });

      let dominantSentiment;
      let maxScore = 0;

      sentimentResult[0].forEach(sentiment => {
        if (sentiment.score > maxScore) {
          dominantSentiment = sentiment.label;
          maxScore = sentiment.score;
        }
      });

      const commentsCollectionRef = collection(database, 'posts', postId, 'comments');
      await addDoc(commentsCollectionRef, {
        content: String(content),
        author: userId,
        name: user?.name || 'Anonymous',
        createdAt: new Date(),
        sentiment: dominantSentiment
      });

      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Give some guidelines..."
          value={newComment}
          onChangeText={(text) => setNewComment(text)}
        />
        <Button title="Submit" onPress={() => handleSubmitComment(newComment)} />
      </View>

      <ScrollView style={styles.commentsContainer}>
        {comments.map((item) => (
          <View key={item.id} style={styles.commentItem}>
            <Text style={styles.commentContent}>{item.content}</Text>
            <Text style={styles.commentMeta}>
              {item?.name || 'Anonymous'} • {item.createdAt.toDate().toLocaleString()}
            </Text>
            {item.sentiment && (
              <Text style={[
                styles.sentimentText,
                { color: item.sentiment === 'positive' ? 'green' : item.sentiment === 'negative' ? 'red' : 'black' }
              ]}>
                {item.sentiment.toUpperCase()} Sentiment
              </Text>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
    marginRight: 8,
  },
  commentsContainer: {
    flex: 1,
  },
  commentItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  commentContent: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  commentMeta: {
    fontSize: 14,
    color: 'gray',
    marginTop: 5,
  },
  sentimentText: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default CommentScreen;