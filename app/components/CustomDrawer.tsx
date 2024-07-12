import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import { observer } from "mobx-react-lite";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";

import { useUserStore } from "../../stores/UserStoreContext";

import { Image } from "expo-image";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../backend/firebaseConfig";

const CustomDrawer = observer((props: DrawerContentComponentProps) => {
  const userStore = useUserStore();
  const { user } = userStore;
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [taskCount, setTaskCount] = useState(0);

  useEffect(() => {
    const fetchTaskCount = async () => {
      if (user) {
        const tasksCollection = collection(db, "tasks");
        const q = query(tasksCollection, where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        setTaskCount(querySnapshot.size);
      }
    };

    fetchTaskCount();
  }, [user]);

  const handleSignOut = async () => {
    await userStore.signOut();
    setShowModal(false); // Close modal on sign out
    router.push("/");
  };

  return (
    <View style={styles.Container}>
      <LinearGradient
        colors={["rgba(58, 0, 98, 1)", "rgba(106, 13, 173, 1)"]}
        style={styles.userInfoBox}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => setShowModal(true)}
        >
          {user && user.photoURL ? (
            <Image
              source={{ uri: user.photoURL }}
              alt="Avatar"
              style={styles.avatar}
              contentFit="contain"
            />
          ) : null}
          <Text style={styles.username}>{user?.displayName || "Guest"}</Text>
        </TouchableOpacity>
      </LinearGradient>
      <View style={styles.tabs}>
        <DrawerContentScrollView {...props}>
          {props.state.routeNames.map((route, index, drawerLabel) => (
            <TouchableOpacity
              key={route}
              onPress={() =>
                router.push(route === "index" ? "/(tabs)" : `/${route}`)
              }
              style={[
                styles.drawerItem,
                {
                  backgroundColor:
                    props.state.index === index
                      ? "rgba(82, 100, 204, 1)"
                      : "transparent",
                },
              ]}
            >
              <Text
                style={[
                  styles.drawerItemText,
                  {
                    fontSize: 20,
                    fontFamily: "RobotoRegular",
                    color: props.state.index === index ? "white" : "black",
                  },
                ]}
              >
                {route === "index" ? "Home" : route}
              </Text>
            </TouchableOpacity>
          ))}
        </DrawerContentScrollView>
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {user && user.photoURL ? (
              <Image
                source={{ uri: user.photoURL }}
                alt="Avatar"
                style={styles.modalAvatar}
                contentFit="contain"
              />
            ) : null}
            <Text style={styles.modalText}>
              Name: {user?.displayName || "Guest"}
            </Text>
            <Text style={[styles.modalText, { textAlign: "center" }]}>
              Email: {user?.email}
            </Text>
            <Text style={styles.modalText}>Number of Tasks: {taskCount}</Text>
            <TouchableOpacity
              style={styles.signOutButton}
              onPress={handleSignOut}
            >
              <Text style={styles.signOutText}>Sign Out</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  userInfoBox: {
    height: 330,
    width: "100%",
    borderBottomRightRadius: 35,
    borderBottomLeftRadius: 35,
    alignItems: "center",
    flexDirection: "column-reverse",
  },
  userInfo: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    height: 45,
    width: 45,
    borderRadius: 30,
  },
  username: {
    color: "white",
    textAlign: "center",
    fontSize: 23,
  },
  signOutButton: {
    marginTop: 10,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "red",
  },
  signOutText: {
    color: "white",
    fontSize: 18,
  },
  tabs: {
    paddingHorizontal: 30,
  },
  drawerItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
  },
  drawerItemText: {
    fontSize: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalAvatar: {
    height: 90,
    width: 90,
    borderRadius: 45,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "left", // Ensure text aligns left by default
  },
  closeButton: {
    marginTop: 15,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "gray",
  },
  closeButtonText: {
    color: "white",
    fontSize: 18,
  },
});

export default CustomDrawer;