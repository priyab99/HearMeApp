import React from 'react';
import { View } from 'react-native';
import {Link} from "expo-router"
const profile = () => {
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Link href="/">Log Out</Link>
        </View>
    );
};

export default profile;