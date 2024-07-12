import userStore from "@/stores/UserStore";
import { UserStoreContext } from "@/stores/UserStoreContext";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <UserStoreContext.Provider value={userStore}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </UserStoreContext.Provider>
  );
}
