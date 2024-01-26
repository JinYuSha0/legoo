package com.legoo.keyboardmanager;

import androidx.annotation.NonNull;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.legoo.keyboardmanager.components.TextInput.RestrictedTextInput;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class KeyboardManagerPackage implements ReactPackage {
  @NonNull
  @Override
  public List<NativeModule> createNativeModules(@NonNull ReactApplicationContext reactContext) {
    List<NativeModule> modules = new ArrayList<>();
    modules.add(new KeyboardManagerModule(reactContext));
    return modules;
  }

  @NonNull
  @Override
  public List<ViewManager> createViewManagers(@NonNull ReactApplicationContext reactContext) {
    return Arrays.<ViewManager>asList(
      new RestrictedTextInput()
    );
  }
}
