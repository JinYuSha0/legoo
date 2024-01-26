package com.legoo.keyboardmanager.components.TextInput;

import android.text.TextWatcher;

import androidx.annotation.Nullable;

import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.textinput.ReactEditText;
import com.facebook.react.views.textinput.ReactTextInputManager;

@ReactModule(name = RestrictedTextInput.REACT_CLASS)
public class RestrictedTextInput extends ReactTextInputManager {
  final static String REACT_CLASS = "RestrictedTextInput";
  private TextWatcher currWatcher;
  private String regex;
  private Boolean decimal;
  private String separator;

  @Override
  public String getName() {
    return RestrictedTextInput.REACT_CLASS;
  }

  public void apply(ReactEditText view) {
    if (regex != null || separator != null || decimal != null) {
      addWatcher(view, new FormatWatcher(view, regex, decimal, separator));
    } else {
      removeCurrWatcher(view);
    }
  }

  @ReactProp(name = "regex")
  public void setExtraChar(ReactEditText view, @Nullable String regex) {
    if (regex == null) return;
    this.regex = regex;
    apply(view);
  }

  @ReactProp(name = "decimal")
  public void setDecimal(ReactEditText view, @Nullable Boolean decimal) {
    if (decimal == null) return;
    this.decimal = decimal;
    apply(view);
  }

  @ReactProp(name = "separator")
  public void setThousands(ReactEditText view, @Nullable String separator) {
    if (separator == null) return;
    this.separator = separator;
    apply(view);
  }

  public void removeCurrWatcher(ReactEditText view) {
    if (this.currWatcher != null) {
      view.removeTextChangedListener(this.currWatcher);
      this.currWatcher = null;
    }
  }

  public void addWatcher(ReactEditText view, TextWatcher watcher) {
    removeCurrWatcher(view);
    this.currWatcher = watcher;
    view.addTextChangedListener(watcher);
  }
}
