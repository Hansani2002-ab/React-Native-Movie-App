import { images } from '@/constants/images';
import { loginUser } from "@/services/auth";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";


const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await loginUser(email, password);

      router.replace({
        pathname: "/Profile",
        params: { successMessage: `Welcome ${result.user.name}! Login successful!` }
      });
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-5 bg-primary">
      {/* Top Logo Image */}
      <View className="items-center mb-10">
        <Image
          source={images.pop2} // just the image/logo
          className="w-25 h-23 mb-4"
          resizeMode="contain"
        />
        <Text className="text-white text-3xl font-bold text-center">
          Welcome Back
        </Text>
        <Text className="text-gray-300 text-center mt-1">
          Sign in to your MovieApp account
        </Text>
      </View>

      {/* Email Input */}
      <TextInput
        placeholder="Email Address"
        placeholderTextColor="#94a3b8"
        value={email}
        onChangeText={setEmail}
        className="bg-dark-100 text-white px-4 py-3 rounded-2xl mb-4"
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />

      {/* Password Input */}
      <TextInput
        placeholder="Password"
        placeholderTextColor="#94a3b8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="bg-dark-100 text-white px-4 py-3 rounded-2xl mb-4"
        editable={!loading}
        onSubmitEditing={handleLogin}
      />

      {/* Error Message */}
      {error ? (
        <View className="mb-4 bg-red-500/20 border border-red-500/40 rounded-xl p-3">
          <Text className="text-red-300 text-center">{error}</Text>
        </View>
      ) : null}

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        className={`py-4 rounded-2xl ${
          loading ? "bg-darkAccent/50" : "bg-darkAccent"
        }`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-bold text-lg">
            Sign In
          </Text>
        )}
      </TouchableOpacity>

      {/* Signup Link */}
      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-300">Don't have an account? </Text>
        <TouchableOpacity
          onPress={() => router.push("/Signup")}
          disabled={loading}
        >
          <Text className="text-white font-semibold">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

// Hide header for this page
export const unstable_settings = {
  headerShown: false,
};
