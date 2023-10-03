import React, { useEffect, useState } from "react";
import classNames from "classnames";

interface SizeButtonsProps {
  sizes: number[];
  prices: number[];
  productId: number;
  onSizeSelected: (
    size: number,
    productId: number,
    selectedPrice: number,
  ) => void;
}

const SizeButtons: React.FC<SizeButtonsProps> = ({
  sizes,
  prices,
  productId,
  onSizeSelected,
}) => {
  const [activeSizeIndex, setActiveSizeIndex] = useState<number>(0);

  const handleButtonClick = (size: number, index: number) => {
    setActiveSizeIndex(index);
    onSizeSelected(size, productId, prices[index]);
  };

  useEffect(() => {
    if (sizes && sizes.length > 0 && onSizeSelected) {
      const firstSize: number = sizes[0];
      const firstPrice: number = prices[0];
      onSizeSelected(firstSize, productId, firstPrice);
    }
  }, []);

  return (
    <>
      {sizes
        ?.filter((size: number) => size !== 0)
        .map((size: number, index) => (
          <button
            type="button"
            className={classNames("btn bg-warning position-relative me-3", {
              active: index === activeSizeIndex,
            })}
            key={size}
            onClick={() => handleButtonClick(size, index)}
          >
            {size}
          </button>
        ))}
    </>
  );
};

export default SizeButtons;
