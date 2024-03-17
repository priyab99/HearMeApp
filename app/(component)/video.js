import { Stack } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import WebView from 'react-native-webview';

const VideoScreen = () => {
    return (
        <View style={styles.container}>
             <Stack.Screen options={{ headerTitle: `Intro Video` }} />
            <WebView
                style={styles.videoContainer}
                javaScriptEnabled={true}
                source={{ uri: 'https://www.youtube.com/watch?v=yg8lwoGx_mM' }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    videoContainer: {
        height: 250,
        width: 300,
        marginTop: 15,
        flex: 0.3
    },
});

export default VideoScreen;
