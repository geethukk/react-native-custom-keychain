declare module 'react-native-custom-keychain' {

    export interface UserCredentials {
        key: string;
        value: string;
    }

    export interface SharedWebCredentials {
        server: string;
        key: string;
        value: string;
    }

    export enum ACCESSIBLE {
        WHEN_UNLOCKED = "AccessibleWhenUnlocked",
        AFTER_FIRST_UNLOCK = "AccessibleAfterFirstUnlock",
        ALWAYS = "AccessibleAlways",
        WHEN_PASSCODE_SET_THIS_DEVICE_ONLY = "AccessibleWhenPasscodeSetThisDeviceOnly",
        WHEN_UNLOCKED_THIS_DEVICE_ONLY = "AccessibleWhenUnlockedThisDeviceOnly",
        AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY = "AccessibleAfterFirstUnlockThisDeviceOnly",
        ALWAYS_THIS_DEVICE_ONLY = "AccessibleAlwaysThisDeviceOnly"
    }

    export enum ACCESS_CONTROL {
        USER_PRESENCE = "UserPresence",
        BIOMETRY_ANY = "BiometryAny",
        BIOMETRY_CURRENT_SET = "BiometryCurrentSet",
        DEVICE_PASSCODE = "DevicePasscode",
        APPLICATION_PASSWORD = "ApplicationPassword",
        BIOMETRY_ANY_OR_DEVICE_PASSCODE = "BiometryAnyOrDevicePasscode",
        BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE = "BiometryCurrentSetOrDevicePasscode"
    }

    export enum AUTHENTICATION_TYPE {
        DEVICE_PASSCODE_OR_BIOMETRICS = "AuthenticationWithBiometricsDevicePasscode",
        BIOMETRICS = "AuthenticationWithBiometrics"
    }

    export enum SECURITY_LEVEL {
        SECURE_SOFTWARE,
        SECURE_HARDWARE,
        ANY
    }
  
    export enum BIOMETRY_TYPE {
        TOUCH_ID = 'TouchID',
        FACE_ID = 'FaceID',
        FINGERPRINT = 'Fingerprint'
    }

    export interface Options {
        accessControl?: ACCESS_CONTROL;
        accessGroup?: string;
        accessible?: ACCESSIBLE;
        authenticationPrompt?: string;
        authenticationType?: AUTHENTICATION_TYPE;
        service?: string;
        securityLevel? : SECURITY_LEVEL;
    }

    function canImplyAuthentication(
        options?: Options
    ): Promise<boolean>;

    function getSupportedBiometryType(
    ): Promise<BIOMETRY_TYPE | null>;

    function setInternetCredentials(
        server: string,
        key: string,
        value: string,
        options?: Options
    ): Promise<void>;

    function getInternetCredentials(
        server: string
    ): Promise<false | UserCredentials>;

    function hasInternetCredentials(
        server: string
    ): Promise<boolean>;

    function resetInternetCredentials(
        server: string
    ): Promise<void>;

    function setItem(
        key: string,
        value: string,
        options?: Options
    ): Promise<boolean>;

    function getItem(
        options?: Options
    ): Promise<false | { service: string, key: string, value: string }>;
    function removeItem(
        key: string,
        options?: Options
    ): Promise<false | { service: string, key: string, value: string }>;
    
    function resetAll(
        options?: Options
    ): Promise<boolean>;

    function requestSharedWebCredentials(
    ): Promise<SharedWebCredentials>;

    function setSharedWebCredentials(
        server: string,
        key: string,
        value: string
    ): Promise<void>;

    function getSecurityLevel(
    ): Promise<SECURITY_LEVEL>
}
