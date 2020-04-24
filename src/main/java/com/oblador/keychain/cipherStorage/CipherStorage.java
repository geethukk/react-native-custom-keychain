package com.oblador.keychain.cipherStorage;

import androidx.annotation.NonNull;

import com.oblador.keychain.SecurityLevel;
import com.oblador.keychain.exceptions.CryptoFailedException;
import com.oblador.keychain.exceptions.KeyStoreAccessException;

public interface CipherStorage {
    abstract class CipherResult<T> {
        public final String key;
        public final T value;

        public CipherResult(String key, T value) {
            this.key = key;
            this.value = value;
        }
    }

    class EncryptionResult extends CipherResult<byte[]> {
        public CipherStorage cipherStorage;

        public EncryptionResult(String key, byte[] value, CipherStorage cipherStorage) {
            super(key, value);
            this.cipherStorage = cipherStorage;
        }
    }

    class DecryptionResult extends CipherResult<String> {
      private SecurityLevel securityLevel;

      public DecryptionResult(String key, String value, SecurityLevel level) {
            super(key, value);
            securityLevel = level;
        }

      public SecurityLevel getSecurityLevel() {
        return securityLevel;
      }
    }

    EncryptionResult encrypt(@NonNull String service, @NonNull String key, @NonNull String value, SecurityLevel level) throws CryptoFailedException;

    DecryptionResult decrypt(@NonNull String service, @NonNull String key, @NonNull byte[] value) throws CryptoFailedException;

    void removeKey(@NonNull String service) throws KeyStoreAccessException;

    String getCipherStorageName();

    int getMinSupportedApiLevel();

    SecurityLevel securityLevel();

    boolean supportsSecureHardware();
}
