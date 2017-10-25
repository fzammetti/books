function utils:showFPSAndMem()

  local prevTime = 0;
  local curTime = 0;
  local dt = 0;
  local fps = 60;
  local mem = 0;
  local frameCount = 0;
  local avg = 0;
  local slowest = 1000;
   underlay = display.newRect(
    0, display.contentHeight - 30, display.contentWidth, 34
  );
  underlay:setReferencePoint(display.TopLeftReferencePoint);
  underlay:setFillColor(0, 0, 0, 128);
   displayInfo = display.newText(
    "FPS: ??, Avg: ?, Slowest: ?, Mem: ????mb", 0, 0, native.systemFontBold, 20
  );
  displayInfo.x = display.contentWidth / 2;
  displayInfo.y = display.contentHeight - 14;
  local function updateText()
    curTime = system.getTimer();
    dt = curTime - prevTime;
    prevTime = curTime;
    fps = math.floor(1000 / dt);
    mem = system.getInfo("textureMemoryUsed") / 1000000;
    if fps > 60 then
      fps = 60
    end
    frameCount = frameCount + 1;
    if frameCount > 150 then
      avg = avg + fps;
      if fps < slowest then
        slowest = fps;
      end
    end
    local a = math.round(avg / (frameCount - 150));
    a = math.floor(a * math.pow(10, 0) + 0.5) / math.pow(10, 0);
    collectgarbage();
    local sysMem = collectgarbage("count") * 0.001;
    sysMem = math.floor(sysMem * 1000) * 0.001;
    displayInfo.text = "FPS: " .. fps .. ", Avg: " .. a ..
      ", Slowest: " .. slowest ..
      ", T-Mem: " .. string.sub(mem, 1, string.len(mem) - 4) .. "mb" ..
      ", S-Mem: " .. sysMem .. "mb";
    underlay:toFront()
    displayInfo:toFront()
  end
  underlay.isVisible = true;
  displayInfo.isVisible = true;
  Runtime:addEventListener("enterFrame", updateText)

end
