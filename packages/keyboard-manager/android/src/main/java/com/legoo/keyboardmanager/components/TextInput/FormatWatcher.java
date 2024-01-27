package com.legoo.keyboardmanager.components.TextInput;

import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.widget.EditText;

import java.text.DecimalFormat;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class FormatWatcher implements TextWatcher {
  EditText editText;
  private String regex;
  private Integer decimal;
  private String separator;
  private boolean flag = false;
  private String beforeText;

  public FormatWatcher(EditText editText, String regex, Integer decimal, String separator) {
    this.editText = editText;
    this.regex = regex;
    this.separator = separator;
    this.decimal = decimal;
  }

  @Override
  public void beforeTextChanged(CharSequence s, int start, int count, int after) {
    this.beforeText = editText.getText().toString();
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
        if (this.regex != null) {
          str = str.replaceAll(regex, "");
        }
        if (!TextUtils.isEmpty(str) && this.decimal != null) {
          if (decimal > 0) {
            if (str.startsWith(".")) str = "0.";
            if (!this.isNumeric(str) || this.countDecimalPlaces(str) > this.decimal) str = this.removeLastCharacter(str);
          } else {
            if (str.startsWith("0") && str.length() > 1) str = str.substring(1);
          }
        }
        if(!TextUtils.isEmpty(str) && this.separator != null) {
          boolean endWithsDot = str.endsWith(".");
          str = this.formatWithThousandSeparator(endWithsDot ? removeLastCharacter(str) : str);
          if (str.equals(this.beforeText) && currText.length() < this.beforeText.length()) {
            StringBuilder builder = new StringBuilder(currText);
            builder.delete(selectionEnd - 1, selectionEnd);
            String modifiedString = builder.toString();
            str = this.formatWithThousandSeparator(modifiedString);
          };
          if (endWithsDot) str += ".";
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
      return input.replaceAll("\\B(?=(\\d{3})+(?!\\d))",this.separator);
    } catch (NumberFormatException exception) {
      exception.printStackTrace();
    }
    return input;
  }

  public boolean isNumeric(String str) {
    Pattern pattern = Pattern.compile("-?\\d+(\\.\\d*)?");
    return pattern.matcher(str).matches();
  }

  public String removeLastCharacter(String str) {
    return str.substring(0, str.length() - 1);
  }

  public int countDecimalPlaces(String str) {
    if (!TextUtils.isEmpty(str)) {
      Pattern pattern = Pattern.compile("\\.\\d+");
      Matcher matcher = pattern.matcher(str);
      if (matcher.find()) {
        return matcher.group().length() - 1;
      }
    }
    return 0;
  }
}
