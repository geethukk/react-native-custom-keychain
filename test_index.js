// @flow
import {
  ACCESS_CONTROL,
  ACCESSIBLE,
  AUTHENTICATION_TYPE,
  BIOMETRY_TYPE,
  canImplyAuthentication,
  getItem,
  getInternetCredentials,
  getSupportedBiometryType,
  hasInternetCredentials,
  requestSharedWebCredentials,
  resetGenericPassword,
  resetInternetCredentials,
  setItem,
  setInternetCredentials,
  setSharedWebCredentials,
  type Options,
  type SharedWebCredentials,
} from 'react-native-keychain';

canImplyAuthentication().then(result => {
  (result: boolean);
});

const simpleOptions2: Options = {
  // $FlowExpectedError - not valid accessible value
  accessible: 'ACCESSIBLE.ALWAYS',
};

const simpleOptions: Options = {
  accessControl: ACCESS_CONTROL.BIOMETRY_ANY,
  accessible: ACCESSIBLE.ALWAYS,
  authenticationType: AUTHENTICATION_TYPE.BIOMETRICS,
  accessGroup: 'accessGroup',
  authenticationPrompt: 'authenticationPrompt',
  service: 'service',
};

canImplyAuthentication(simpleOptions).then(result => {
  (result: boolean);
});

getSupportedBiometryType().then(result => {
  (result: ?string);
});

// $FlowExpectedError - First 3 arguments are required
setInternetCredentials();
setInternetCredentials('server', 'key', 'value');
setInternetCredentials('server', 'key', 'value', simpleOptions).then(
  result => {
    (result: void);
  }
);

// $FlowExpectedError - First argument is required
hasInternetCredentials();
hasInternetCredentials('server').then(result => {
  (result: boolean);
});

// $FlowExpectedError - First argument is required
getInternetCredentials();
getInternetCredentials('server', simpleOptions).then(credentials => {
  if (credentials) {
    (credentials.key: string);
    (credentials.value: string);
  }
});

// $FlowExpectedError - First argument is required
resetInternetCredentials();
resetInternetCredentials('server', simpleOptions).then(result => {
  (result: void);
});

// $FlowExpectedError - First two arguments are required
setItem();
setItem('key', 'value').then(result => {
  (result: boolean);
});
setItem('key', 'value', 'service');
setItem('key', 'value', simpleOptions);

getItem().then(result => {
  (result: boolean | SharedWebCredentials);
});
getItem('service');
getItem(simpleOptions);

resetGenericPassword().then(result => {
  (result: boolean);
});
resetGenericPassword('service');
resetGenericPassword(simpleOptions);

requestSharedWebCredentials().then(result => {
  if (result) {
    (result.server: string);
    (result.key: string);
    (result.value: string);
  }
});

setSharedWebCredentials('server', 'key', 'value').then(result => {
  (result: void);
});
