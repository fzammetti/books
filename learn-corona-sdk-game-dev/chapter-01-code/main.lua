display.newRect(
  0, 0, display.contentWidth, display.contentHeight
):setFillColor(
  graphics.newGradient( { 255, 0, 0 }, { 0, 0, 0 } )
);

circle = display.newCircle(
  display.contentWidth / 2, display.contentHeight / 2, 32
);

function moveCircle()
  transition.to(circle, {
    x = math.random(32, display.contentWidth - 32),
    y = math.random(32, display.contentHeight - 32),
    onComplete = function()
      moveCircle();
    end
  });
end

moveCircle();
