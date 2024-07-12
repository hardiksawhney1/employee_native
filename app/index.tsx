import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Platform, StyleSheet, View, Alert } from 'react-native';
import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import Loginpage from './Loginpage';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, onAuthStateChanged, signInWithCredential, User as FirebaseUser } from 'firebase/auth';
import { firebaseAuth, db } from '@/backend/firebaseConfig'; // Adjust this import as per your Firebase setup
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { ERROR_UNKNOWN, ERROR_SAVING_USER, ERROR_REMOVING_USER, ERROR_SIGNING_IN, SIGNIN_MSG, ERROR_NO_ACCESS } from './errorMessages'; // Add new error message for no access
import { collection, getDocs, query, where } from 'firebase/firestore';

WebBrowser.maybeCompleteAuthSession();

interface UserInfo {
  displayName?: string;
  email?: string;
  photoURL?: string;
}

const Index: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const checkLocalUser = async () => {
    try {
      const userJSON = await AsyncStorage.getItem("@user");
      const userData: UserInfo | null = userJSON ? JSON.parse(userJSON) : null;
      setUserInfo(userData);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        console.error(ERROR_UNKNOWN, error);
      }
    } finally {
      setLoading(false);
    }
  };

  const saveLocalUser = async (userData: UserInfo) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error(ERROR_SAVING_USER, error);
    }
  };

  const removeLocalUser = async () => {
    try {
      await AsyncStorage.removeItem('user');
    } catch (error) {
      console.error(ERROR_REMOVING_USER, error);
    }
  };

  useEffect(() => {
    checkLocalUser();

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user: FirebaseUser | null) => {
      if (user) {
        // Check if user's email matches any email in 'roles' collection
        const empRef = collection(db, 'employees');
        const querySnapshot = await getDocs(query(empRef, where('email', '==', user.email)));
        console.log(querySnapshot);
        if (querySnapshot.empty) {
          // No matching email found in 'roles' collection
          Alert.alert(
            'Access Denied',
            'Please contact your administrator to provide access.',
            [{ text: 'OK', onPress: () => {} }]
          );
          await firebaseAuth.signOut(); // Sign out user if no access
          return;
        }

        setUserInfo({
          displayName: user.displayName || '',
          email: user.email || '',
          photoURL: user.photoURL || ''
        });
      } else {
        setUserInfo(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (Platform.OS === "ios") {
    const [request, response, promptAsync] = Google.useAuthRequest({
      iosClientId: process.env.EXPO_PUBLIC_IOS_CLIENT_ID,
      androidClientId: ""
    });

    useEffect(() => {
      if (response?.type === "success") {
        const { id_token } = response.params;
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(firebaseAuth, credential)
          .then((user) => {
            console.log(SIGNIN_MSG);
            console.log(user, "userdetails");
          })
          .catch((error) => {
            console.error(ERROR_SIGNING_IN, error);
          });
      }
    }, [response]);

    return (
      <CommonView loading={loading} userInfo={userInfo} promptAsync={promptAsync} />
    );
  } else {
    useEffect(() => {
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_WEB_CLIENT_ID,
      });

      checkLocalUser();
    }, []);

    useEffect(() => {
      const unsubscribe = auth().onAuthStateChanged(async (user) => {
        setLoading(false);
        if (user) {
          // Check if user's email matches any email in 'roles' collection
          const empRef = collection(db, 'employees');
          const querySnapshot = await getDocs(query(empRef, where('email', '==', user.email)));
          console.log(querySnapshot);
          if (querySnapshot.empty) {
            // No matching email found in 'roles' collection
            Alert.alert(
              'Access Denied',
              'Please contact your administrator to provide access.',
              [{ text: 'OK', onPress: () => {} }]
            );
            await auth().signOut(); // Sign out user if no access
            return;
          }

          setUserInfo({
            displayName: user.displayName || '',
            email: user.email || '',
            photoURL: user.photoURL || ''
          });
          saveLocalUser({
            displayName: user.displayName || '',
            email: user.email || '',
            photoURL: user.photoURL || ''
          });
        } else {
          setUserInfo(null);
          removeLocalUser();
        }
      });

      return unsubscribe;
    }, []);

    const onGoogleButtonPress = async () => {
      try {
        setLoading(true);
        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const { idToken, user } = await GoogleSignin.signIn();
        const googleCredential = auth.GoogleAuthProvider.credential(idToken);
        await auth().signInWithCredential(googleCredential);
      } catch (error) {
        console.error(ERROR_SIGNING_IN, error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <CommonView loading={loading} userInfo={userInfo} promptAsync={onGoogleButtonPress} />
    );
  }
};

interface CommonViewProps {
  loading: boolean;
  userInfo: UserInfo | null;
  promptAsync: () => void;
}

const CommonView: React.FC<CommonViewProps> = ({ loading, userInfo, promptAsync }) => {
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  }

  if (userInfo) {
    return (
      <View style={{ flex: 1 }}>
        <Redirect href="(tabs)" />
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar style="light" />
        <Loginpage promptAsync={promptAsync} />
      </View>
    );
  }
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
