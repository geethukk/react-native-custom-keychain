package com.oblador.keychain.cipherStorage;

import android.os.Build;
import androidx.annotation.NonNull;

import com.facebook.android.crypto.keychain.AndroidConceal;
import com.facebook.android.crypto.keychain.SharedPrefsBackedKeyChain;
import com.facebook.crypto.Crypto;
import com.facebook.crypto.CryptoConfig;
import com.facebook.crypto.Entity;
import com.facebook.crypto.keychain.KeyChain;
import com.facebook.react.bridge.ReactApplicationContext;
import com.oblador.keychain.SecurityLevel;
import com.oblador.keychain.exceptions.CryptoFailedException;

import java.nio.charset.Charset;

public class CipherStorageFacebookConceal implements CipherStorage {
    public static final String CIPHER_STORAGE_NAME = "FacebookConceal";
    public static final String KEYCHAIN_DATA = "RN_KEYCHAIN";
    private final Crypto crypto;

    public CipherStorageFacebookConceal(ReactApplicationContext reactContext) {
        KeyChain keyChain = new SharedPrefsBackedKeyChain(reactContext, CryptoConfig.KEY_256);
        this.crypto = AndroidConceal.get().createDefaultCrypto(keyChain);
    }

    @Override
    public String getCipherStorageName() {
        return CIPHER_STORAGE_NAME;
    }

    @Override
    public int getMinSupportedApiLevel() {
        return Build.VERSION_CODES.JELLY_BEAN;
    }

    @Override
    public SecurityLevel securityLevel() {
        return SecurityLevel.ANY;
    }

    @Override
    public boolean supportsSecureHardware() {
        return false;
    }

    @Override
    public EncryptionResult encrypt(@NonNull String service, @NonNull String key, @NonNull String value, SecurityLevel level) throws CryptoFailedException {

        if (!this.securityLevel().satisfiesSafetyThreshold(level)) {
            throw new CryptoFailedException(String.format("Insufficient security level (wants %s; got %s)", level, this.securityLevel()));
        }

        if (!crypto.isAvailable()) {
            throw new CryptoFailedException("Crypto is missing");
        }
        Entity valueEntity = createEntity(service,key);
        try {
            byte[] encryptedValue = crypto.encrypt(key.getBytes(Charset.forName("UTF-8")), valueEntity);

            return new EncryptionResult(key, encryptedValue, this);
        } catch (Exception e) {
            throw new CryptoFailedException("Encryption failed for service " + service, e);
        }
    }

    @Override
    public DecryptionResult decrypt(@NonNull String service, @NonNull String key, @NonNull byte[] value) throws CryptoFailedException {
        if (!crypto.isAvailable()) {
            throw new CryptoFailedException("Crypto is missing");
        }
        Entity valueEntity = createEntity(service,key);

        try {
            byte[] decryptedValue = crypto.decrypt(value, valueEntity);

            return new DecryptionResult(key,
                    new String(decryptedValue, Charset.forName("UTF-8")),
                    SecurityLevel.ANY);
        } catch (Exception e) {
            throw new CryptoFailedException("Decryption failed for service " + service, e);
        }
    }

    @Override
    public void removeKey(@NonNull String service) {
        // Facebook Conceal stores only one key across all services, so we cannot delete the key (otherwise decryption will fail for encrypted data of other services).
    }
    
    private Entity createEntity(String service, String key) {
        String prefix = getEntityPrefix(service);
        return Entity.create(prefix + ":" + key);
    }    

    private String getEntityPrefix(String service) {
        return KEYCHAIN_DATA + ":" + service;
    }
}
