import React, { useContext, useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  Avatar,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { AuthContext } from "../utility/authContext";
import { updateUser } from "../utility/apiservice";

const ProfilePage: React.FC = () => {
  const { user, setUser, token } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();

  // Redirect if not logged in
  if (!token) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Box textAlign="center">
          <Heading size="lg" mb={4}>
            You need to log in to view your profile
          </Heading>
        </Box>
      </Flex>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    try {
      const form = new FormData();

      // Tilføj kun ændrede felter
      if (formData.firstName && formData.firstName !== user?.firstName) {
        form.append("firstName", formData.firstName);
      }
      if (formData.lastName && formData.lastName !== user?.lastName) {
        form.append("lastName", formData.lastName);
      }
      if (formData.email && formData.email !== user?.email) {
        form.append("email", formData.email);
      }
      if (profileImage) {
        form.append("profileImage", profileImage);
      }

      // Send opdaterede felter, hvis der er ændringer
      if (form.has("firstName") || form.has("lastName") || form.has("email") || form.has("profileImage")) {
        if (token) {
          const updatedUser = await updateUser(form, token);
          setUser(updatedUser);

          toast({
            title: "Profile updated.",
            description: "Your profile has been successfully updated.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        }
      } else {
        toast({
          title: "No changes detected.",
          description: "You didn't make any changes to your profile.",
          status: "info",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error.",
        description: "There was an error updating your profile.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Flex justify="center" align="center" h="100vh">
      <Box
        w="400px"
        bg="gray.900"
        p={6}
        borderRadius="lg"
        boxShadow="lg"
        color="white"
      >
        <VStack spacing={4} align="center">
          <Avatar
            size="xl"
            src={user?.profileImage}
            name={user?.firstName}
            bg="teal.500"
          />
          <Heading size="lg">Profile</Heading>
          <Text fontSize="lg">Welcome, {user?.firstName}</Text>

          <form onSubmit={handleSubmit} style={{ width: "100%" }}>
            <FormControl id="firstName" isRequired>
              <FormLabel>First Name</FormLabel>
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl id="lastName" isRequired mt={4}>
              <FormLabel>Last Name</FormLabel>
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl id="email" isRequired mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </FormControl>

            <FormControl id="profileImage" mt={4}>
              <FormLabel>Profile Image</FormLabel>
              <Input type="file" onChange={handleFileChange} />
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              mt={6}
              isLoading={isUpdating}
              w="100%"
            >
              Update Profile
            </Button>
          </form>
        </VStack>
      </Box>
    </Flex>
  );
};

export default ProfilePage;