import AsyncStorage from "@react-native-async-storage/async-storage";

const USER_KEY = "MOVIEAPP_USER";

// SIGNUP USER
export const signupUser = async (email: string, password: string, name: string) => {
  try {
    // Validate
    if (!email || !email.includes("@")) throw new Error("Please enter a valid email");
    if (!password || password.length < 6) throw new Error("Password must be at least 6 characters");
    if (!name || name.trim().length < 2) throw new Error("Name must be at least 2 characters");

    // Check if user already exists
    const existingUserJson = await AsyncStorage.getItem(USER_KEY);
    if (existingUserJson) {
      const existingUser = JSON.parse(existingUserJson);
      if (existingUser.email === email) throw new Error("An account with this email already exists");
    }

    // Create user locally
    const newUser = {
      id: Date.now().toString(),
      email,
      name,
      password,
      createdAt: new Date().toISOString()
    };

    await AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser));

    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt
    };
  } catch (error: any) {
    console.error("Signup error:", error);
    throw new Error(error.message || "Signup failed");
  }
};

// LOGIN USER
export const loginUser = async (email: string, password: string) => {
  try {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    if (!userJson) throw new Error("No account found with this email");

    const user = JSON.parse(userJson);
    if (user.email !== email || user.password !== password) throw new Error("Invalid email or password");

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    };
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(error.message || "Login failed");
  }
};

// GET CURRENT USER
export const getCurrentUser = async () => {
  try {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    if (!userJson) return null;

    const user = JSON.parse(userJson);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt
    };
  } catch (error) {
    console.error("Get current user error:", error);
    return null;
  }
};

// LOGOUT USER
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
    return true;
  } catch (error) {
    console.error("Logout error:", error);
    return false;
  }
};

// OPTIONAL: Check if user is logged in
export const isLoggedIn = async () => {
  const user = await getCurrentUser();
  return !!user;
};
