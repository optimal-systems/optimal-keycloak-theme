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
    Collapse,
} from '@chakra-ui/react';
import { ShoppingBasket, UserPlus, Check, X, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionButton = motion(Button);
const MotionStack = motion(Stack);

export default function Register(props: PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;
    const { url } = kcContext;
    const { msg, msgStr } = i18n;

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
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
        const emailUsername = formData.email.split('@')[0].toLowerCase();
        const username = formData.username.toLowerCase();
        const passwordLower = password.toLowerCase();
        
        // Only trigger username validation if 3 or more consecutive characters match
        const MIN_SUBSTRING_LENGTH = 3;
        
        // Check if password contains a substring of username with minimum length
        const containsUsernameSubstring = (username: string, password: string): boolean => {
            if (!username || username.length < MIN_SUBSTRING_LENGTH) return false;
            
            for (let i = 0; i <= username.length - MIN_SUBSTRING_LENGTH; i++) {
                const substring = username.substring(i, i + MIN_SUBSTRING_LENGTH);
                if (password.includes(substring)) return true;
            }
            return false;
        };
        
        const doesNotContainEmailUsername = !containsUsernameSubstring(emailUsername, passwordLower);
        const doesNotContainUsername = !containsUsernameSubstring(username, passwordLower);
        
        setPasswordRequirements({
            minLength: password.length >= 8,
            notContainsUsername: doesNotContainEmailUsername && doesNotContainUsername,
            specialCharacters: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            uppercaseCharacters: /[A-Z]/.test(password),
            lowercaseCharacters: /[a-z]/.test(password),
            digits: /\d/.test(password),
        });
    }, [formData.password, formData.email, formData.username]);

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
            'password-confirm': 'confirmPassword'
        };
        
        const stateKey = fieldNameMap[name] || name;
        
        setFormData(prev => ({
            ...prev,
            [stateKey]: value
        }));
    };

    const getErrorMessage = (field: string) => {
        if (!formData[field as keyof typeof formData]) {
            // Format camelCase field names with spaces before capital letters
            const formattedField = field.replace(/([A-Z])/g, ' $1').trim();
            return `${formattedField.charAt(0).toUpperCase() + formattedField.slice(1)} is required`;
        }
        if (field === 'confirmPassword' && formData.password !== formData.confirmPassword) {
            return 'Passwords do not match';
        }
        if (field === 'email' && !/\S+@\S+\.\S+/.test(formData.email)) {
            return 'Please enter a valid email address';
        }
        return '';
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
                                        name="firstName"
                                        id="firstName"
                                        placeholder="Test"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        size="lg"
                                        focusBorderColor="brand.primary"
                                        disabled={isLoading}
                                    />
                                    <FormErrorMessage>{getErrorMessage('firstName')}</FormErrorMessage>
                                </FormControl>

                                <FormControl isInvalid={isSubmitted && !formData.lastName}>
                                    <FormLabel fontSize="sm" color="brand.secondary">Last Name</FormLabel>
                                    <Input
                                        name="lastName"
                                        id="lastName"
                                        placeholder="Test"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        size="lg"
                                        focusBorderColor="brand.primary"
                                        disabled={isLoading}
                                    />
                                    <FormErrorMessage>{getErrorMessage('lastName')}</FormErrorMessage>
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
                                <FormErrorMessage>{getErrorMessage('email')}</FormErrorMessage>
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
                                <FormErrorMessage>{getErrorMessage('username')}</FormErrorMessage>
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
                                        onFocus={() => setIsPasswordFocused(true)}
                                        onBlur={() => {
                                            // Only hide requirements if password is empty or valid
                                            if (!formData.password || isPasswordValid) {
                                                setIsPasswordFocused(false);
                                            }
                                        }}
                                    />
                                    <InputRightElement h="full">
                                        <IconButton
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            icon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                            onClick={() => setShowPassword(!showPassword)}
                                            variant="ghost"
                                            size="sm"
                                            color="brand.secondary"
                                            disabled={isLoading}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                <Collapse in={!!(isPasswordFocused || (formData.password && !isPasswordValid))} animateOpacity>
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
                                </Collapse>
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
                                            icon={showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
