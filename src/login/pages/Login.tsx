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
    InputGroup,
    InputRightElement,
    Stack,
    Text,
    IconButton,
    Center,
    FormErrorMessage
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { ShoppingBasket, LogIn } from "lucide-react";
import { motion } from "framer-motion";

const MotionButton = motion(Button);

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n } = props;

    const { realm, url, usernameHidden, login, auth, registrationDisabled, messagesPerField } = kcContext;

    const { msg, msgStr } = i18n;

    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: login.username ?? "",
        password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitted(true);

        if (formData.username && formData.password) {
            setIsLoading(true);
            try {
                // Let Keycloak handle the form submission
                const form = e.target as HTMLFormElement;
                form.submit();
            } catch (error) {
                console.error("Login failed:", error);
                setIsLoading(false);
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const isUsernameError = isSubmitted && !formData.username;
    const isPasswordError = isSubmitted && !formData.password;
    const isFormValid = formData.username && formData.password;

    return (
        <Center minH="100vh" bg="gray.50">
            <Container maxW="md" py={8}>
                <Stack spacing={8} align="center" bg="white" p={8} borderRadius="lg" boxShadow="sm">
                    {/* Logo */}
                    <Box position="relative" w="50px" h="50px">
                        <ShoppingBasket size={50} color="#5d93c7" strokeWidth={1.5} />
                        <Text fontSize="sm" color="gray.900" textAlign="center">
                            Optimal
                        </Text>
                    </Box>

                    {/* Welcome Text */}
                    <Stack spacing={2} textAlign="center" w="full">
                        <Text fontSize="2xl" fontWeight="bold" color="brand.secondary">
                            Welcome back!
                        </Text>
                        <Text fontSize="sm" color="gray.500">
                            Start saving on your food purchases today
                        </Text>
                    </Stack>

                    {/* Login Form */}
                    <form id="kc-form-login" onSubmit={handleSubmit} action={url.loginAction} method="post" style={{ width: "100%" }} noValidate>
                        <Stack spacing={4} w="full">
                            {!usernameHidden && (
                                <FormControl isInvalid={isUsernameError || messagesPerField.existsError("username", "password")}>
                                    <FormLabel htmlFor="username" fontSize="sm" color="brand.secondary">
                                        {!realm.loginWithEmailAllowed
                                            ? msg("username")
                                            : !realm.registrationEmailAsUsername
                                              ? msg("usernameOrEmail")
                                              : msg("email")}
                                    </FormLabel>
                                    <Input
                                        tabIndex={2}
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        type="text"
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
                                        aria-invalid={isUsernameError || messagesPerField.existsError("username", "password")}
                                        focusBorderColor="brand.primary"
                                        aria-required="true"
                                        disabled={isLoading}
                                        aria-describedby={isUsernameError ? "username-error" : undefined}
                                    />
                                    {isUsernameError && <FormErrorMessage id="username-error">Please enter your username</FormErrorMessage>}
                                    {messagesPerField.existsError("username", "password") && (
                                        <FormErrorMessage>{messagesPerField.getFirstError("username", "password")}</FormErrorMessage>
                                    )}
                                </FormControl>
                            )}

                            <FormControl isInvalid={isPasswordError || messagesPerField.existsError("username", "password")}>
                                <FormLabel htmlFor="password" fontSize="sm" color="brand.secondary">
                                    {msg("password")}
                                </FormLabel>
                                <InputGroup size="lg">
                                    <Input
                                        tabIndex={3}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        type={showPassword ? "text" : "password"}
                                        placeholder="********"
                                        autoComplete="current-password"
                                        aria-invalid={isPasswordError || messagesPerField.existsError("username", "password")}
                                        focusBorderColor="brand.primary"
                                        aria-required="true"
                                        disabled={isLoading}
                                        aria-describedby={isPasswordError ? "password-error" : undefined}
                                    />
                                    <InputRightElement h="full">
                                        <IconButton
                                            aria-label={showPassword ? msgStr("hidePassword") : msgStr("showPassword")}
                                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                            onClick={() => setShowPassword(!showPassword)}
                                            variant="ghost"
                                            size="sm"
                                            color="brand.secondary"
                                            disabled={isLoading}
                                        />
                                    </InputRightElement>
                                </InputGroup>
                                {isPasswordError && <FormErrorMessage id="password-error">Please enter your password</FormErrorMessage>}
                                {messagesPerField.existsError("username", "password") && (
                                    <FormErrorMessage>{messagesPerField.getFirstError("username", "password")}</FormErrorMessage>
                                )}
                            </FormControl>

                            <Box textAlign="right">
                                {realm.resetPasswordAllowed && (
                                    <Text
                                        as="a"
                                        href={url.loginResetCredentialsUrl}
                                        tabIndex={6}
                                        fontSize="sm"
                                        color="brand.primary"
                                        cursor="pointer"
                                        _hover={{ textDecoration: "underline" }}
                                        style={{ pointerEvents: isLoading ? "none" : "auto", opacity: isLoading ? 0.6 : 1 }}
                                        onClick={e => {
                                            if (isLoading) {
                                                e.preventDefault();
                                            }
                                        }}
                                    >
                                        {msg("doForgotPassword")}
                                    </Text>
                                )}
                            </Box>

                            <input type="hidden" id="id-hidden-input" name="credentialId" value={auth.selectedCredential} />
                            <MotionButton
                                type="submit"
                                variant="primary"
                                size="lg"
                                w="full"
                                name="login"
                                isLoading={isLoading}
                                loadingText={msgStr("doLogIn")}
                                disabled={isLoading || (isSubmitted && !isFormValid)}
                                leftIcon={<LogIn size={20} />}
                                whileTap={{ scale: 0.98 }}
                                _disabled={{
                                    opacity: 0.6,
                                    cursor: "not-allowed",
                                    _hover: { bg: "brand.primary" }
                                }}
                            >
                                {isLoading ? msgStr("doLogIn") : msgStr("doLogIn")}
                            </MotionButton>

                            {realm.registrationAllowed && !registrationDisabled && (
                                <Stack direction="row" justify="center" spacing={1} fontSize="sm">
                                    <Text color="brand.secondary">{msg("noAccount")}</Text>
                                    <Text
                                        as="a"
                                        href={url.registrationUrl}
                                        tabIndex={8}
                                        color="brand.primary"
                                        cursor="pointer"
                                        _hover={{ textDecoration: "underline" }}
                                        style={{ pointerEvents: isLoading ? "none" : "auto", opacity: isLoading ? 0.6 : 1 }}
                                    >
                                        {msg("doRegister")}
                                    </Text>
                                </Stack>
                            )}
                        </Stack>
                    </form>
                </Stack>
            </Container>
        </Center>
    );
}
