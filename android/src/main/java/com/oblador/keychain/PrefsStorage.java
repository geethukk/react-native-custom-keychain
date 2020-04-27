package com.oblador.keychain;

import android.content.Context;
import android.content.SharedPreferences;
import androidx.annotation.NonNull;
import android.util.Base64;

import com.facebook.react.bridge.ReactApplicationContext;
import com.oblador.keychain.cipherStorage.CipherStorage.EncryptionResult;
import com.oblador.keychain.cipherStorage.CipherStorageFacebookConceal;

public class PrefsStorage {
    public static final String KEYCHAIN_DATA = "RN_KEYCHAIN";

    static public class ResultSet {
        public final String cipherStorageName;
        public final byte[] valueBytes;

        public ResultSet(String cipherStorageName, byte[] valueBytes) {
            this.cipherStorageName = cipherStorageName;
            this.valueBytes = valueBytes;
        }
    }

    private final SharedPreferences prefs;

    public PrefsStorage(ReactApplicationContext reactContext) {
        this.prefs = reactContext.getSharedPreferences(KEYCHAIN_DATA, Context.MODE_PRIVATE);
    }

    public ResultSet getEncryptedEntry(@NonNull String key) {
      String value = prefs.getString(key, null);
      if (value == null) {
        return null;
      }

      String[] split = value.split(":", 2);
      if (split.length < 2) {
        return null;
      }
      String cipherStorageName = split[0];
      byte[] valueBytes = getBytesForValue(split[1]);

      if (cipherStorageName == null || cipherStorageName.isEmpty()) {
        // If the CipherStorage name is not found, we assume it is because the entry was written by an older version of this library. The older version used Facebook Conceal, so we default to that.
        cipherStorageName = CipherStorageFacebookConceal.CIPHER_STORAGE_NAME;
      }
      return new ResultSet(cipherStorageName, valueBytes);
    }

  private byte[] getBytesForValue(String b64) {
    return Base64.decode(b64, Base64.DEFAULT);
  }

  public void removeEntry(@NonNull String key) {
    prefs.edit().remove(key).apply();
  }

    public void storeEncryptedEntry(@NonNull String service, @NonNull EncryptionResult encryptionResult) {
        String key = encryptionResult.key;
      String cipherStorageName = encryptionResult.cipherStorage.getCipherStorageName();
      prefs.edit()
        .putString(key, cipherStorageName + ":" + Base64.encodeToString(encryptionResult.value, Base64.DEFAULT))
        .apply();
    }

}
