/**
 * Updates a user's profile with proper validation and error handling
 * @param {Object} userData - User profile data to update
 * @returns {Promise<Object>} Updated user object
 * @throws {Error} If validation fails or API request fails
 */
async function updateUserProfile(userData) {
  // Input validation
  if (!userData || typeof userData !== "object") {
    throw new Error("Invalid user data provided");
  }

  const { userId, name, email, phone, dateOfBirth } = userData;

  // Required field check
  if (!userId) {
    throw new Error("User ID is required");
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  // Bangladeshi phone number validation
  const phoneRegex = /^(\+88)?01[3-9]\d{8}$/;
  if (phone && !phoneRegex.test(phone)) {
    throw new Error("Invalid Bangladeshi phone number");
  }

  try {
    const response = await fetch(`/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        name: name?.trim(),
        email: email?.toLowerCase().trim(),
        phone: phone?.trim(),
        dateOfBirth,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update profile");
    }

    const updatedUser = await response.json();

    console.log("✅ Profile updated successfully:", updatedUser);
    return updatedUser;
  } catch (error) {
    console.error("❌ Error updating user profile:", error);
    throw error;
  }
}
