import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomHeader from "../../components/CustomHeader";
import CustomDrawer from "../../components/CustomDrawer";
import {
  DrawerContentComponentProps,
  DrawerHeaderProps,
} from "@react-navigation/drawer";
import { getHeaderTitle } from "@react-navigation/elements";
import { StatusBar } from "expo-status-bar";
export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Drawer
        screenOptions={{
          headerShown: true,
          headerTransparent: true,
          header: ({ navigation, route, options }) => (
            <CustomHeader title={getHeaderTitle(options, route.name)} />
          ),
        }}
        drawerContent={(props: DrawerContentComponentProps) => (
          <CustomDrawer {...props} />
        )}
      >
        <Drawer.Screen
          name="index"
          options={{
            drawerLabel: "Home",
            title: "Home",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}