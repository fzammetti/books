function utils:dump(inT)

  local print_r_cache = {};

  local function sub_print_r(inT, indent)

    if (print_r_cache[tostring(inT)]) then
      print(indent .. "*" .. tostring(inT));
    else
      print_r_cache[tostring(inT)] = true;
      if (type(inT) == "table") then
        for pos, val in pairs(inT) do
          if (type(val) == "table") then
            print(indent .. "[" .. pos .. "] => " .. tostring(inT) .. " {");
            sub_print_r(val, indent .. string.rep(" ", string.len(pos) + 8));
            print(indent .. string.rep(" ", string.len(pos) + 6) .. "}");
          elseif (type(val) == "string") then
            print(indent .. "[" .. pos .. '] => "' .. val .. '"');
          else
            print(indent .. "[" .. pos .. "] => " .. tostring(val));
          end
        end
      else
        print(indent .. tostring(inT));
      end
    end
  end

  if (type(inT) == "table") then
      print(tostring(inT) .. " {");
    sub_print_r(inT, "  ");
    print("}");
  else
    sub_print_r(inT, "  ");
  end

  print();

end
