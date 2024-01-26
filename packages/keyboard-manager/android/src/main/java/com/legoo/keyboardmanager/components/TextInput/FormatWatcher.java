package com.legoo.keyboardmanager.components.TextInput;

import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.widget.EditText;

import java.text.DecimalFormat;

public class FormatWatcher implements TextWatcher {
  EditText editText;
  private String regex;
  private Boolean decimal;
  private String separator;
  private DecimalFormat decimalFormat;
  private boolean flag = false;
  private String beforeText;

  public FormatWatcher(EditText editText, String regex, Boolean decimal, String separator) {
    this.editText = editText;
    this.regex = regex;
    this.separator = separator;
    this.decimal = decimal;
    if (separator != null) this.decimalFormat = new DecimalFormat("#,###");
  }

  @Override
  public void beforeTextChanged(CharSequence s, int start, int count, int after) {
    if (this.separator != null) {
      this.beforeText = editText.getText().toString();
    }
  }

  @Override
  public void onTextChanged(CharSequence s, int start, int before, int count) {
  }

  @Override
  public void afterTextChanged(Editable s) {
    try {
      if (flag) {
        flag = false;
        return;
      }
      String currText = editText.getText().toString();
      String str = currText;
      int selectionEnd = this.editText.getSelectionEnd();
      int increased = 0;

      if (!TextUtils.isEmpty(str)) {
        if (this.decimal != null) {
          if (Boolean.TRUE.equals(this.decimal) && str.startsWith(".")) {
            str = "0.";
          } else if (str.startsWith("0") && str.length() > 1) {
            str = str.substring(1);
          }
        }
        if (this.regex != null) {
          str = str.replaceAll(regex, "");
        }
        if(this.separator != null) {
          str = this.formatWithThousandSeparator(str);
          if (str.equals(this.beforeText) && currText.length() < this.beforeText.length()) {
            StringBuilder builder = new StringBuilder(currText);
            builder.delete(selectionEnd - 1, selectionEnd);
            String modifiedString = builder.toString();
            str = this.formatWithThousandSeparator(modifiedString);
          };
          increased = str.length() - this.beforeText.length();
        }
      }

      if (currText.equals(str)) return;
      flag = true;
      this.beforeText = null;
      editText.setText(str);
      int offset = Math.abs(increased) - 1;
      offset = increased > 0 ? offset : -offset;
      editText.setSelection(Math.min(selectionEnd + offset, str.length()));
    } catch (Exception ex) {
      ex.printStackTrace();
    }
  }

  private String formatWithThousandSeparator(String input) {
    try {
      long inputValue = Long.parseLong(input.replace(this.separator, ""));
      return decimalFormat.format(inputValue);
    } catch (NumberFormatException exception) {
      exception.printStackTrace();
    }
    return input;
  }
}
