package com.legoo.keyboardmanager;

import android.app.Activity;
import android.os.Build;
import android.view.View;
import android.view.Window;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.module.annotations.ReactModule;

@ReactModule(name = KeyboardManagerModule.NAME)
public class KeyboardManagerModule extends ReactContextBaseJavaModule {
  public static final String NAME = "TreasureChest";

  public KeyboardManagerModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  private Activity getActivity() {
    Activity currActivity = this.getReactApplicationContext().getCurrentActivity();
    if (currActivity == null || currActivity.isFinishing()) return null;
    return currActivity;
  }
}
