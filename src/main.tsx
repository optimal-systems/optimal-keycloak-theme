import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { KcPage } from "./kc.gen";
import { theme } from './theme';

// The following block can be uncommented to test a specific page with `yarn dev`
// Don't forget to comment back or your bundle size will increase
/*
import { getKcContextMock } from "./login/KcPageStory";

if (import.meta.env.DEV) {
    window.kcContext = getKcContextMock({
        pageId: "register.ftl",
        overrides: {}
    });
}
*/

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ChakraProvider theme={theme}>
            {!window.kcContext ? (
                <h1>No Keycloak Context</h1>
            ) : (
                <KcPage kcContext={window.kcContext} />
            )}
        </ChakraProvider>
    </StrictMode>
);
