import { images } from "@/constants/images";
import { signupUser } from "@/services/auth";
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

const Signup = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError("Please fill all fields");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await signupUser(email, password, name);

      router.replace({
        pathname: "/Profile",
        params: { successMessage: `Welcome ${result.name}! Account created successfully!` }
      });
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center px-5 bg-primary">

      {/* 🔥 Top Image  */}
      <View className="items-center mb-6 mt-4">
        <Image
          source={images.person}
          className="w-28 h-28"
          resizeMode="contain"
        />
      </View>

      <Text className="text-white text-3xl font-bold mb-2 text-center">
        Create Account
      </Text>

      <Text className="text-gray-300 text-center mb-6">
        Sign up to start using MovieApp
      </Text>

      <TextInput
        placeholder="Full Name"
        placeholderTextColor="#94a3b8"
        value={name}
        onChangeText={setName}
        className="bg-dark-100 text-white px-4 py-3 rounded-xl mb-4"
        editable={!loading}
      />

      <TextInput
        placeholder="Email Address"
        placeholderTextColor="#94a3b8"
        value={email}
        onChangeText={setEmail}
        className="bg-dark-100 text-white px-4 py-3 rounded-xl mb-4"
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#94a3b8"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="bg-dark-100 text-white px-4 py-3 rounded-xl mb-4"
        editable={!loading}
        onSubmitEditing={handleSignup}
      />

      {error ? (
        <View className="mb-4 bg-red-500/20 border border-red-500/40 rounded-xl p-3">
          <Text className="text-red-300 text-center">{error}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        onPress={handleSignup}
        disabled={loading}
        className={`py-4 rounded-xl ${loading ? "bg-darkAccent/50" : "bg-darkAccent"}`}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-center font-bold text-lg">Sign Up</Text>
        )}
      </TouchableOpacity>

      <View className="flex-row justify-center mt-6">
        <Text className="text-gray-300">Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/Login")} disabled={loading}>
          <Text className="text-white font-semibold">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Signup;
