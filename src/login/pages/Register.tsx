import React, { useState, useEffect } from "react";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Stack,
    Text,
    IconButton,
    Center,
    FormErrorMessage,
    HStack,
    List,
    ListItem,
    ListIcon,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { ShoppingBasket, UserPlus, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionButton = motion(Button);
const MotionStack = motion(Stack);

export default function Register(props: PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;
    const { url } = kcContext;
    const { msg, msgStr } = i18n;

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
    });

    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        notContainsUsername: true,
        specialCharacters: false,
        uppercaseCharacters: false,
        lowercaseCharacters: false,
        digits: false,
    });

    useEffect(() => {
        const password = formData.password;
        const username = formData.email.split('@')[0].toLowerCase();
        const passwordLower = password.toLowerCase();
        
        setPasswordRequirements({
            minLength: password.length >= 8,
            notContainsUsername: username ? !passwordLower.includes(username) : true,
            specialCharacters: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            uppercaseCharacters: /[A-Z]/.test(password),
            lowercaseCharacters: /[a-z]/.test(password),
            digits: /\d/.test(password),
        });
    }, [formData.password, formData.email]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        
        if (isFormValid) {
            setIsLoading(true);
            try {
                const form = e.target as HTMLFormElement;
                form.submit();
            } catch (error) {
                console.error('Registration failed:', error);
                setIsLoading(false);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        // Map form field names to state keys
        const fieldNameMap: Record<string, string> = {
            'first-name': 'firstName',
            'last-name': 'lastName',
            'password-confirm': 'confirmPassword'
        };
        
        const stateKey = fieldNameMap[name] || name;
        
        setFormData(prev => ({
            ...prev,
            [stateKey]: value
        }));
    };

    const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
    const isFormValid = 
        formData.firstName &&
        formData.lastName &&
        formData.email &&
        formData.username &&
        formData.password &&
        formData.confirmPassword &&
        formData.password === formData.confirmPassword &&
        isPasswordValid;

    const passwordMatchColor = formData.confirmPassword
        ? formData.password === formData.confirmPassword
            ? 'green.500'
            : 'red.500'
        : 'gray.300';

    return (
        <Center minH="100vh" bg="gray.50">
            <Container maxW="md" py={8}>
                <MotionStack
                    spacing={8}
                    align="center"
                    bg="white"
                    p={8}
                    borderRadius="lg"
                    boxShadow="sm"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Logo */}
                    <Box position="relative" w="50px" h="50px">
                        <ShoppingBasket size={50} color="#5d93c7" strokeWidth={1.5} />
                        <Text fontSize="sm" color="gray.900" textAlign="center">Optimal</Text>
                    </Box>
                    
                    {/* Welcome Text */}
                    <Stack spacing={2} textAlign="center" w="full">
                        <Text fontSize="2xl" fontWeight="bold" color="brand.secondary">CREATE AN ACCOUNT</Text>
                        <Text fontSize="sm" color="gray.500">Join Optimal and start saving today</Text>
                    </Stack>

                    {/* Registration Form */}
                    <form
                        id="kc-register-form"
                        onSubmit={handleSubmit}
                        action={url.registrationAction}
                        method="post"
                        style={{ width: '100%' }}
                        noValidate
                    >
                        <input type="hidden" id="client_id" name="client_id" value={kcContext.client?.clientId ?? ""} />
                        <Stack spacing={4} w="full">
                            <HStack spacing={4}>
                                <FormControl isInvalid={isSubmitted && !formData.firstName}>
                                    <FormLabel fontSize="sm" color="brand.secondary">First Name</FormLabel>
                                    <Input
                                        name="first-name"
                                        id="firstName"
                                        placeholder="Test"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        size="lg"
                                        focusBorderColor="brand.primary"
                                        disabled={isLoading}
                                    />
                                    <FormErrorMessage>First name is required</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={isSubmitted && !formData.lastName}>
                                    <FormLabel fontSize="sm" color="brand.secondary">Last Name</FormLabel>
                                    <Input
                                        name="last-name"
                                        id="lastName"
                                        placeholder="Test"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        size="lg"
                                        focusBorderColor="brand.primary"
                                        disabled={isLoading}
                                    />
                                    <FormErrorMessage>Last name is required</FormErrorMessage>
                                </FormControl>
                            </HStack>

                            <FormControl isInvalid={isSubmitted && (!formData.email || !/\S+@\S+\.\S+/.test(formData.email))}>
                                <FormLabel fontSize="sm" color="brand.secondary">Email</FormLabel>
                                <Input
                                    name="email"
                                    id="email"
                                    type="email"
                                    placeholder="test@test.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    size="lg"
                                    focusBorderColor="brand.primary"
                                    disabled={isLoading}
                                />
                                <FormErrorMessage>Please enter a valid email address</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={isSubmitted && !formData.username}>
                                <FormLabel fontSize="sm" color="brand.secondary">Username</FormLabel>
                                <Input
                                    name="username"
                                    id="username"
                                    placeholder="TestUsername"
                                    value={formData.username}
                                    onChange={handleChange}
                                    size="lg"
                                    focusBorderColor="brand.primary"
                                    disabled={isLoading}
                                />
                                <FormErrorMessage>Username is required</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={isSubmitted && (!formData.password || !isPasswordValid)}>
                                <FormLabel fontSize="sm" color="brand.secondary">Password</FormLabel>
                                <InputGroup size="lg">
                                    <Input
                                        name="password"
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="********"
                                        value={formData.password}
                                        onChange={handleChange}
                                        focusBorderColor="brand.primary"
                                        disabled={isLoading}
                                    />
                                    <InputRightElement h="full">
                                        <IconButton
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                            onClick={() => setShowPassword(!showPassword)}
                                            variant="ghost"
                                            size="sm"
                                            color="brand.secondary"
                                            disabled={isLoading}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                <Box mt={2}>
                                    <List spacing={1} fontSize="xs" color="gray.600">
                                        <ListItem display="flex" alignItems="center">
                                            <ListIcon
                                                as={passwordRequirements.minLength ? Check : X}
                                                color={passwordRequirements.minLength ? 'green.500' : 'red.500'}
                                                boxSize={4}
                                            />
                                            Minimum length of 8 characters
                                        </ListItem>
                                        <ListItem display="flex" alignItems="center">
                                            <ListIcon
                                                as={passwordRequirements.notContainsUsername ? Check : X}
                                                color={passwordRequirements.notContainsUsername ? 'green.500' : 'red.500'}
                                                boxSize={4}
                                            />
                                            Does not contain username
                                        </ListItem>
                                        <ListItem display="flex" alignItems="center">
                                            <ListIcon
                                                as={passwordRequirements.specialCharacters ? Check : X}
                                                color={passwordRequirements.specialCharacters ? 'green.500' : 'red.500'}
                                                boxSize={4}
                                            />
                                            At least 1 special character
                                        </ListItem>
                                        <ListItem display="flex" alignItems="center">
                                            <ListIcon
                                                as={passwordRequirements.uppercaseCharacters ? Check : X}
                                                color={passwordRequirements.uppercaseCharacters ? 'green.500' : 'red.500'}
                                                boxSize={4}
                                            />
                                            At least 1 uppercase character
                                        </ListItem>
                                        <ListItem display="flex" alignItems="center">
                                            <ListIcon
                                                as={passwordRequirements.lowercaseCharacters ? Check : X}
                                                color={passwordRequirements.lowercaseCharacters ? 'green.500' : 'red.500'}
                                                boxSize={4}
                                            />
                                            At least 1 lowercase character
                                        </ListItem>
                                        <ListItem display="flex" alignItems="center">
                                            <ListIcon
                                                as={passwordRequirements.digits ? Check : X}
                                                color={passwordRequirements.digits ? 'green.500' : 'red.500'}
                                                boxSize={4}
                                            />
                                            At least 1 digit
                                        </ListItem>
                                    </List>
                                </Box>
                            </FormControl>

                            <FormControl isInvalid={isSubmitted && (!formData.confirmPassword || formData.password !== formData.confirmPassword)}>
                                <FormLabel fontSize="sm" color="brand.secondary">Confirm Password</FormLabel>
                                <InputGroup size="lg">
                                    <Input
                                        name="password-confirm"
                                        id="password-confirm"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="********"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        focusBorderColor="brand.primary"
                                        disabled={isLoading}
                                        borderColor={passwordMatchColor}
                                        _hover={{ borderColor: passwordMatchColor }}
                                    />
                                    <InputRightElement h="full">
                                        <IconButton
                                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                            icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            variant="ghost"
                                            size="sm"
                                            color="brand.secondary"
                                            disabled={isLoading}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                {formData.confirmPassword && (
                                    <Text
                                        fontSize="xs"
                                        color={passwordMatchColor}
                                        mt={1}
                                        display="flex"
                                        alignItems="center"
                                    >
                                        <Box as={formData.password === formData.confirmPassword ? Check : X} mr={1} />
                                        {formData.password === formData.confirmPassword
                                            ? 'Passwords match'
                                            : 'Passwords do not match'}
                                    </Text>
                                )}
                            </FormControl>

                            <MotionButton
                                type="submit"
                                variant="primary"
                                size="lg"
                                w="full"
                                mt={2}
                                isLoading={isLoading}
                                loadingText={msgStr("doRegister")}
                                disabled={isLoading || !isFormValid}
                                leftIcon={<UserPlus size={20} />}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                {msgStr("doRegister")}
                            </MotionButton>

                            <Stack direction="row" justify="center" spacing={1} fontSize="sm" pt={2}>
                                <Text color="brand.secondary">Already have an account?</Text>
                                <Text
                                    as="a"
                                    href={url.loginUrl}
                                    color="brand.primary"
                                    cursor="pointer"
                                    _hover={{ textDecoration: 'underline' }}
                                    style={{ pointerEvents: isLoading ? 'none' : 'auto', opacity: isLoading ? 0.6 : 1 }}
                                >
                                    {msg("doLogIn")}
                                </Text>
                            </Stack>
                        </Stack>
                    </form>
                </MotionStack>
            </Container>
        </Center>
    );
}
