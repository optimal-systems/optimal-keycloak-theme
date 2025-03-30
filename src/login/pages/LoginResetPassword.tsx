import React, { useState } from "react";
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
    Stack,
    Text,
    Center,
    FormErrorMessage,
    Image,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import forgotPasswordIllustration from "../assets/forgot-password.webp";

const MotionButton = motion(Button);
const MotionStack = motion(Stack);

export default function LoginResetPassword(props: PageProps<Extract<KcContext, { pageId: "login-reset-password.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;
    const { url, realm, auth, messagesPerField } = kcContext;
    const { msg, msgStr } = i18n;

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        username: auth.attemptedUsername ?? ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);
        
        if (formData.username) {
            setIsLoading(true);
            try {
                // Let Keycloak handle the form submission
                setIsSuccess(true);
                return true;
            } catch (error) {
                console.error('Reset password failed:', error);
                setIsLoading(false);
                return false;
            }
        }
        return false;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const isUsernameError = isSubmitted && !formData.username;

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
                    {/* Back Button */}
                    <Box alignSelf="flex-start">
                        <Button
                            leftIcon={<ArrowLeft size={20} />}
                            variant="ghost"
                            color="brand.secondary"
                            size="sm"
                            as="a"
                            href={url.loginUrl}
                            _hover={{
                                bg: 'gray.100',
                                transform: 'translateX(-4px)',
                            }}
                            transition="all 0.2s"
                        >
                            {msg("backToLogin")}
                        </Button>
                    </Box>

                    {/* Illustration */}
                    <Box position="relative" w="200px" h="200px">
                        <Image
                            src={forgotPasswordIllustration}
                            alt="Forgot Password Illustration"
                            width={200}
                            height={200}
                            style={{ objectFit: 'contain' }}
                        />
                    </Box>
                    
                    {/* Header Text */}
                    <Stack spacing={2} textAlign="center" w="full">
                        <Text fontSize="2xl" fontWeight="bold" color="brand.secondary">
                            {msg("emailForgotTitle")}
                        </Text>
                        <Text fontSize="sm" color="gray.500" px={4}>
                            {realm.duplicateEmailsAllowed ? msg("emailInstructionUsername") : msg("emailInstruction")}
                        </Text>
                    </Stack>

                    {isSuccess ? (
                        <MotionStack 
                            spacing={4} 
                            textAlign="center" 
                            w="full"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Box
                                p={6}
                                bg="green.50"
                                borderRadius="md"
                                border="1px"
                                borderColor="green.200"
                            >
                                <Text color="green.600" fontSize="sm">
                                    Reset instructions have been sent to your email address.
                                    Please check your inbox and follow the instructions.
                                </Text>
                            </Box>
                            <MotionButton
                                variant="outline"
                                color="brand.primary"
                                borderColor="brand.primary"
                                as="a"
                                href={url.loginUrl}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Return to Login
                            </MotionButton>
                        </MotionStack>
                    ) : (
                        <form 
                            id="kc-reset-password-form" 
                            onSubmit={handleSubmit}
                            action={url.loginAction} 
                            method="post"
                            style={{ width: '100%' }} 
                            noValidate
                        >
                            <Stack spacing={6} w="full">
                                <FormControl isInvalid={isUsernameError || messagesPerField.existsError("username")}>
                                    <FormLabel 
                                        htmlFor="username"
                                        fontSize="sm" 
                                        color="brand.secondary"
                                    >
                                        {!realm.loginWithEmailAllowed
                                            ? msg("username")
                                            : !realm.registrationEmailAsUsername
                                              ? msg("usernameOrEmail")
                                              : msg("email")}
                                    </FormLabel>
                                    <Input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        size="lg"
                                        autoFocus
                                        autoComplete="username"
                                        placeholder={
                                            !realm.loginWithEmailAllowed
                                                ? "test"
                                                : !realm.registrationEmailAsUsername
                                                    ? "test@test.com"
                                                    : "test@test.com"
                                        }
                                        focusBorderColor="brand.primary"
                                        disabled={isLoading}
                                        aria-describedby={isUsernameError ? "username-error" : undefined}
                                    />
                                    {isUsernameError && (
                                        <FormErrorMessage id="username-error">
                                            Please enter your email address
                                        </FormErrorMessage>
                                    )}
                                    {messagesPerField.existsError("username") && (
                                        <FormErrorMessage>
                                            {messagesPerField.get("username")}
                                        </FormErrorMessage>
                                    )}
                                </FormControl>

                                <MotionButton
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    w="full"
                                    isLoading={isLoading}
                                    loadingText={msgStr("doSubmit")}
                                    disabled={isLoading}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {msgStr("doSubmit")}
                                </MotionButton>
                            </Stack>
                        </form>
                    )}
                </MotionStack>
            </Container>
        </Center>
    );
}
