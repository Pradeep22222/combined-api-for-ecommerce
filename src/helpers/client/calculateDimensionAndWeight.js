export const calculateDimensionsAndWeight = (cart) => {
  let totalHeight = 0;
  let totalWeight = 0;
  let maxLength = 0;
  let maxWidth = 0;

  cart.forEach((item) => {
    const itemCount = Number(item.count) || 0;
    const itemLength = Number(item.length) || 0;
    const itemWidth = Number(item.width) || 0;
    const itemHeight = Number(item.height) || 0;
    const itemWeight = Number(item.weight) || 0;

    if (itemLength > maxLength) maxLength = itemLength;
    if (itemWidth > maxWidth) maxWidth = itemWidth;

    totalHeight += itemHeight * itemCount;
    totalWeight += itemWeight * itemCount;
  });

  return {
    length: maxLength,
    width: maxWidth,
    height: totalHeight,
    weight: totalWeight,
  };
};