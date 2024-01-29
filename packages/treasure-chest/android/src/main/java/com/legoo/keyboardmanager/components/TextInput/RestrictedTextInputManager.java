package com.legoo.keyboardmanager.components.TextInput;

import android.text.TextWatcher;
import android.view.View;

import androidx.annotation.Nullable;

import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.textinput.ReactEditText;
import com.facebook.react.views.textinput.ReactTextInputManager;

import java.util.HashMap;

@ReactModule(name = RestrictedTextInputManager.REACT_CLASS)
public class RestrictedTextInputManager extends ReactTextInputManager {
  final static String REACT_CLASS = "RestrictedTextInput";

  HashMap<ReactEditText, ReactEditTextProperty> map = new HashMap<>();

  @Override
  public String getName() {
    return RestrictedTextInputManager.REACT_CLASS;
  }

  public void apply(ReactEditText view) {
    ReactEditTextProperty property = getProperty(view);
    if (property.regex != null || property.separator != null || property.decimal != null) {
      addWatcher(view, new FormatWatcher(view, property.regex, property.decimal, property.separator));
    } else {
      removeCurrWatcher(view);
    }
  }

  @ReactProp(name = "regex")
  public void setExtraChar(ReactEditText view, @Nullable String regex) {
    if (regex == null) return;
    getProperty(view).setRegex(regex);
    apply(view);
  }

  @ReactProp(name = "decimal")
  public void setDecimal(ReactEditText view, @Nullable Integer decimal) {
    if (decimal == null) return;
    getProperty(view).setDecimal(decimal);
    apply(view);
  }

  @ReactProp(name = "separator")
  public void setSeparator(ReactEditText view, @Nullable String separator) {
    if (separator == null) return;
    getProperty(view).setSeparator(separator);
    apply(view);
  }

  public void removeCurrWatcher(ReactEditText view) {
    if (getProperty(view).currWatcher != null) {
      view.removeTextChangedListener(getProperty(view).currWatcher);
      getProperty(view).setCurrWatcher(null);
    }
  }

  public void addWatcher(ReactEditText view, TextWatcher watcher) {
    removeCurrWatcher(view);
    view.addTextChangedListener(watcher);
    getProperty(view).setCurrWatcher(watcher);
  }

  public ReactEditTextProperty getProperty(ReactEditText view) {
    if (map.containsKey(view)) {
      return map.get(view);
    } else {
      ReactEditTextProperty property = new ReactEditTextProperty();
      map.put(view, property);
      view.addOnAttachStateChangeListener(new View.OnAttachStateChangeListener() {
        @Override
        public void onViewAttachedToWindow(View v) {
        }

        @Override
        public void onViewDetachedFromWindow(View v) {
          map.remove(view);
        }
      });
      return property;
    }
  }
}
