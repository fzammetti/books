function resetButtonLabels() {
  document.getElementById("jscript_array").value = "+";
  document.getElementById("jscript_browser").value = "+";
  document.getElementById("jscript_datetime").value = "+";
  document.getElementById("jscript_debug").value = "+";
  document.getElementById("jscript_dom").value = "+";
  document.getElementById("jscript_form").value = "+";
  document.getElementById("jscript_lang").value = "+";
  document.getElementById("jscript_math").value = "+";
  document.getElementById("jscript_page").value = "+";
  document.getElementById("jscript_storage").value = "+";
  document.getElementById("jscript_string").value = "+";
}

function collapseAll() {
  document.getElementById("jscript_array_div").style.display = "none";
  document.getElementById("jscript_browser_div").style.display = "none";
  document.getElementById("jscript_datetime_div").style.display = "none";
  document.getElementById("jscript_debug_div").style.display = "none";
  document.getElementById("jscript_dom_div").style.display = "none";
  document.getElementById("jscript_form_div").style.display = "none";
  document.getElementById("jscript_lang_div").style.display = "none";
  document.getElementById("jscript_math_div").style.display = "none";
  document.getElementById("jscript_page_div").style.display = "none";
  document.getElementById("jscript_storage_div").style.display = "none";
  document.getElementById("jscript_string_div").style.display = "none";
}

function expandCollapse(inButton) {
  collapseAll();
  if (inButton.value == "+") {
    resetButtonLabels();
    document.getElementById(inButton.id+"_div").style.display = "block";
    inButton.value = "-"
  } else {
    resetButtonLabels();
    inButton.value = "+"
  }
}
