import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    View,
  } from "react-native";
  import React from "react";
  import { SafeAreaView } from "react-native-safe-area-context";
  import {LinearGradient} from "expo-linear-gradient";
  import { Image } from "expo-image";
  import { useFonts } from "expo-font";
  import { useNavigation, DrawerActions } from "@react-navigation/native";
  import { searchI, bell, menu } from "../../assets";
  import { useUserStore } from "../../stores/UserStoreContext";
//   import { useSearchBool } from "../../stores/SearchContext";
  
  interface CustomHeaderProps {
    title: string;
  }
  
  const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
    // Use hooks at the top level
    const userStore = useUserStore();
    const { user } = userStore;
    // const {search, setSearch}=useSearchBool()
    // console.log(search)
  
    const [fontsLoaded] = useFonts({
      RobotoBold: require("../../assets/fonts/Roboto-Bold.ttf"),
    });
  
    const navigation = useNavigation();
  
    const handleDrawer = () => {
      navigation.dispatch(DrawerActions.openDrawer());
    };
  
    // Conditional rendering based on fontsLoaded
    if (!fontsLoaded) {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
  
    return (
    //   <LinearGradient
    //     colors={["rgba(82, 100, 204, 1)", "rgba(105,123,228,1)"]}
    //     style={styles.container}
    //     start={{ x: 0, y: 0 }}
    //     end={{ x: 1, y: 1 }}
    //   >
//     <LinearGradient
//     colors={["rgba(75, 0, 130, 1)", "rgba(48, 25, 52, 1)"]}
//     style={styles.container}
//     start={{ x: 0, y: 0 }}
//     end={{ x: 0.5, y: 0.5 }}
//   >
<LinearGradient
  colors={["rgba(58, 0, 98, 1)", "rgba(106, 13, 173, 1)"]}
  style={styles.container}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 1 }}
>
        <SafeAreaView style={styles.safecontainer}>
          <View style={styles.containerleft}>
            <Pressable onPress={handleDrawer}>
              <Image
                source={menu}
                alt="Avatar"
                style={styles.menu}
                contentFit="contain"
              />
            </Pressable>
            <Text
              style={{ color: "white", fontFamily: "RobotoBold", fontSize: 24 }}
            >
              {title}
            </Text>
          </View>
          <View style={styles.containerright}>
          {/* onPress={()=>{setSearch(!search)}} */}
            <Pressable >
            <Image
              source={searchI}
              alt="Avatar"
              style={styles.menu}
              contentFit="contain"
            />
            </Pressable>
           
            <Image
              source={bell}
              alt="Avatar"
              style={styles.menu}
              contentFit="contain"
            />
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  };
  
  export default CustomHeader;
  
  const styles = StyleSheet.create({
    container: {
      height: 130,
      padding: 10,
      borderBottomRightRadius: 35,
      borderBottomLeftRadius: 35,
    },
    safecontainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      top: 12,
    },
    containerleft: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingLeft: 30,
      gap: 20,
    },
    containerright: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      paddingRight: 30,
      gap: 30,
    },
    menu: {
      height: 30,
      width: 25,
    },
  });
  