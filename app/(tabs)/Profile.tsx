import { getCurrentUser, logoutUser } from "@/services/auth";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const Profile = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load user profile from local storage
  const loadUserProfile = async () => {
    try {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);

        // Show success banner if coming from login/signup
        if (params.successMessage) {
          setShowSuccess(true);
        }
      } else {
        router.replace("/login");
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      router.replace("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserProfile();
  }, []);

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logoutUser();
            setUser(null);
            router.replace("/login");
          }
        }
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#fff" />
        <Text className="text-white mt-4">Loading profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <Text className="text-white">No user found</Text>
        <TouchableOpacity
          className="mt-4 bg-darkAccent px-6 py-3 rounded-xl"
          onPress={() => router.replace("/login")}
        >
          <Text className="text-white font-semibold">Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-primary">
      <View className="p-5">
        {/* Success Banner */}
        {showSuccess && (
          <View className="bg-green-500/20 border border-green-500/40 rounded-xl p-4 mb-6">
            <Text className="text-green-300 text-center font-semibold">
              🎉 {params.successMessage}
            </Text>
          </View>
        )}

        {/* Header */}
        <Text className="text-white text-3xl font-bold mb-2">Your Profile</Text>
        <Text className="text-gray-300 mb-6">Welcome back, {user.name}! 👋</Text>

        {/* Profile Card */}
        <View className="bg-dark-100 rounded-2xl p-5 shadow-lg mb-6">
          {/* Avatar */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 bg-darkAccent rounded-full items-center justify-center mb-3 shadow-md">
              <Text className="text-white text-3xl font-bold">
                {user.name?.charAt(0).toUpperCase() || "U"}
              </Text>
            </View>
            <Text className="text-white text-2xl font-bold">{user.name}</Text>
            <Text className="text-gray-300 mt-1">{user.email}</Text>
          </View>

          {/* User Details */}
          <View className="space-y-4">
            <View className="flex-row justify-between border-b border-gray-700 pb-3">
              <Text className="text-gray-300">Account ID</Text>
              <Text className="text-white text-sm">{user.id}</Text>
            </View>

            <View className="flex-row justify-between border-b border-gray-700 pb-3">
              <Text className="text-gray-300">Email</Text>
              <Text className="text-white">{user.email}</Text>
            </View>

            <View className="flex-row justify-between border-b border-gray-700 pb-3">
              <Text className="text-gray-300">Member Since</Text>
              <Text className="text-white">
                {new Date(user.createdAt).toLocaleDateString()}
              </Text>
            </View>

            <View className="flex-row justify-between pt-3">
              <Text className="text-gray-300">Account Status</Text>
              <View className="bg-green-500/20 px-3 py-1 rounded-full">
                <Text className="text-green-300 text-sm">Active</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="mt-8 bg-red-500/20 border border-red-500/40 py-4 rounded-xl"
          onPress={handleLogout}
        >
          <Text className="text-red-300 text-center font-semibold text-lg">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;
