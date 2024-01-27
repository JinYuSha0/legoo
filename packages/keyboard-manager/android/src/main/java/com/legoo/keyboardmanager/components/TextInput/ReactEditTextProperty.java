package com.legoo.keyboardmanager.components.TextInput;

import android.text.TextWatcher;

public class ReactEditTextProperty {
  public TextWatcher currWatcher;
  public String regex;
  public Integer decimal;
  public String separator;

  public ReactEditTextProperty() {
  }

  public ReactEditTextProperty(TextWatcher currWatcher, String regex, Integer decimal, String separator) {
    this.currWatcher = currWatcher;
    this.regex = regex;
    this.decimal = decimal;
    this.separator = separator;
  }

  public TextWatcher getCurrWatcher() {
    return currWatcher;
  }

  public void setCurrWatcher(TextWatcher currWatcher) {
    this.currWatcher = currWatcher;
  }

  public String getRegex() {
    return regex;
  }

  public void setRegex(String regex) {
    this.regex = regex;
  }

  public Integer getDecimal() {
    return decimal;
  }

  public void setDecimal(Integer decimal) {
    this.decimal = decimal;
  }

  public String getSeparator() {
    return separator;
  }

  public void setSeparator(String separator) {
    this.separator = separator;
  }
}
