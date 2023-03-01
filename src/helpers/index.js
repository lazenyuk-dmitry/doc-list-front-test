export function intersectRect(a, b) {
  const areaA = a.height * a.width;
  const areaB = b.height * b.width;

  const intersectingArea =
    Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) *
    Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));

  return intersectingArea / (areaA + areaB - intersectingArea);
}
