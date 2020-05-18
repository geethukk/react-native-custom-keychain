// @flow
import { NativeModules, Platform } from 'react-native';
const { RNKeychainManager } = NativeModules;

export const SECURITY_LEVEL = Object.freeze({
  ANY: RNKeychainManager.SECURITY_LEVEL_ANY,
  SECURE_SOFTWARE: RNKeychainManager.SECURITY_LEVEL_SECURE_SOFTWARE,
  SECURE_HARDWARE: RNKeychainManager.SECURITY_LEVEL_SECURE_HARDWARE,
});

export const ACCESSIBLE = Object.freeze({
  WHEN_UNLOCKED: 'AccessibleWhenUnlocked',
  AFTER_FIRST_UNLOCK: 'AccessibleAfterFirstUnlock',
  ALWAYS: 'AccessibleAlways',
  WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: 'AccessibleWhenPasscodeSetThisDeviceOnly',
  WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'AccessibleWhenUnlockedThisDeviceOnly',
  AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY:
    'AccessibleAfterFirstUnlockThisDeviceOnly',
  ALWAYS_THIS_DEVICE_ONLY: 'AccessibleAlwaysThisDeviceOnly',
});

export const ACCESS_CONTROL = Object.freeze({
  USER_PRESENCE: 'UserPresence',
  BIOMETRY_ANY: 'BiometryAny',
  BIOMETRY_CURRENT_SET: 'BiometryCurrentSet',
  DEVICE_PASSCODE: 'DevicePasscode',
  APPLICATION_PASSWORD: 'ApplicationPassword',
  BIOMETRY_ANY_OR_DEVICE_PASSCODE: 'BiometryAnyOrDevicePasscode',
  BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE: 'BiometryCurrentSetOrDevicePasscode',
});

export const AUTHENTICATION_TYPE = Object.freeze({
  DEVICE_PASSCODE_OR_BIOMETRICS: 'AuthenticationWithBiometricsDevicePasscode',
  BIOMETRICS: 'AuthenticationWithBiometrics',
});

export const BIOMETRY_TYPE = Object.freeze({
  TOUCH_ID: 'TouchID',
  FACE_ID: 'FaceID',
  FINGERPRINT: 'Fingerprint',
});

export type SecAccessible = $Values<typeof ACCESSIBLE>;

export type SecAccessControl = $Values<typeof ACCESS_CONTROL>;

export type LAPolicy = $Values<typeof AUTHENTICATION_TYPE>;

export type SecMinimumLevel = $Values<typeof SECURITY_LEVEL>;

export type Options = {
  accessControl?: SecAccessControl,
  accessGroup?: string,
  accessible?: SecAccessible,
  authenticationPrompt?: string,
  authenticationType?: LAPolicy,
  service?: string,
  securityLevel?: SecMinimumLevel,
};

/**
 * (Android only) Returns guaranteed security level supported by this library
 * on the current device.
 * @return {Promise} Resolves to `SECURITY_LEVEL` when supported, otherwise `null`.
 */
export function getSecurityLevel(): Promise<?($Values<typeof SECURITY_LEVEL>)> {
    if (!RNKeychainManager.getSecurityLevel){
        return Promise.resolve(null);
    }
    return RNKeychainManager.getSecurityLevel();
}

/**
 * Inquire if the type of local authentication policy (LAPolicy) is supported
 * on this device with the device settings the user chose.
 * @param {object} options LAPolicy option, iOS only
 * @return {Promise} Resolves to `true` when supported, otherwise `false`
 */
export function canImplyAuthentication(options?: Options): Promise<boolean> {
  if (!RNKeychainManager.canCheckAuthentication) {
    return Promise.resolve(false);
  }
  return RNKeychainManager.canCheckAuthentication(options);
}

/**
 * Get what type of hardware biometry support the device has.
 * @return {Promise} Resolves to a `BIOMETRY_TYPE` when supported, otherwise `null`
 */
export function getSupportedBiometryType(): Promise<?($Values<typeof BIOMETRY_TYPE>)> {
  if (!RNKeychainManager.getSupportedBiometryType) {
    return Promise.resolve(null);
  }
  return RNKeychainManager.getSupportedBiometryType();
}

/**
 * Saves the `key` and `value` combination for `server`.
 * @param {string} server URL to server.
 * @param {string} key Associated key or e-mail to be saved.
 * @param {string} value Associated value to be saved.
 * @param {object} options Keychain options, iOS only
 * @return {Promise} Resolves to `true` when successful
 */

/**
 * Checks if we have a login combination for `server`.
 * @param {string} server URL to server.
 * @return {Promise} Resolves to `true` when successful
 */



/**
 * Fetches login combination for `server`.
 * @param {string} server URL to server.
 * @param {object} options Keychain options, iOS only
 * @return {Promise} Resolves to `{ server, key, value }` when successful
 */

/**
 * Deletes all internet value keychain entries for `server`.
 * @param {string} server URL to server.
 * @param {object} options Keychain options, iOS only
 * @return {Promise} Resolves to `true` when successful
 */

function getOptionsArgument(serviceOrOptions?: string | Options) {
  if (Platform.OS !== 'ios') {
    return typeof serviceOrOptions === 'object'
      ? serviceOrOptions.service
      : serviceOrOptions;
  }
  return typeof serviceOrOptions === 'string'
    ? { service: serviceOrOptions }
    : serviceOrOptions;
}

function getMinimumSecurityLevel(serviceOrOptions?: string | Options) {
  var specifiedLevel = undefined;

  if (typeof serviceOrOptions === 'object') {
    specifiedLevel = serviceOrOptions.securityLevel;
  }

  return specifiedLevel || SECURITY_LEVEL.ANY;
}

/**
 * Saves the `key` and `value` combination for `service`.
 * @param {string} key Associated key or e-mail to be saved.
 * @param {string} value Associated value to be saved.
 * @param {string|object} serviceOrOptions Reverse domain name qualifier for the service, defaults to `bundleId` or an options object.
 * @return {Promise} Resolves to `true` when successful
 */
export function setItem(
  key: string,
  value: string,
  serviceOrOptions?: string | Options
): Promise<boolean> {
  return RNKeychainManager.setItem(
    getOptionsArgument(serviceOrOptions),
    key,
    value,
    getMinimumSecurityLevel(serviceOrOptions)
  );
}


/**
 * Fetches login combination for `service`.
 * @param {string|object} serviceOrOptions Reverse domain name qualifier for the service, defaults to `bundleId` or an options object.
 * @return {Promise} Resolves to `{ service, key, value }` when successful
 */
export function getItem(
  key: string,
  serviceOrOptions?: string | Options
): Promise<false | SharedWebCredentials> {
  return RNKeychainManager.getItem(
    key,
    getOptionsArgument(serviceOrOptions)
  );
}

/**
 * Deletes all generic value keychain entries for `service`.
 * @param {string|object} serviceOrOptions Reverse domain name qualifier for the service, defaults to `bundleId` or an options object.
 * @return {Promise} Resolves to `true` when successful
 */
export function resetAll(
  serviceOrOptions?: string | Options
): Promise<boolean> {
  return RNKeychainManager.resetAll(
    getOptionsArgument(serviceOrOptions)
  );
}

export function removeItem(key: string,
  serviceOrOptions?: string | Options
  ): Promise<false | SharedWebCredentials> {
  if (isAndroid) {
    return RNKeychainManager.removeItem(key, getOptionsArgument(serviceOrOptions))
  }
  return RNKeychainManager.removeItem(key, getOptionsArgument(serviceOrOptions))
}


