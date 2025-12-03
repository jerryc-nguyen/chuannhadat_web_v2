import { OptionForSelect } from "@common/types";
export const MOT_NGHIN = 1_000
export const MOT_TRIEU = 1_000_000
export const MOT_TY = 1_000_000_000
export const minPriceSell = 100_000_000;
export const minPriceRent = 1_000_000;

export function formatPrice(price: string) {
  return `${price}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export const formatPriceWithUnit = (price: number) => {
  return `${price.toLocaleString('vi-VN')} Xu`;
}

export const removeTrailingZeros = (input: string) => {
  return input.replace(/(\.\d*?[1-9])0+$/g, '$1').replace(/\.0+$/, '');
};

export function readMoney(value: string) {
  let result = 0.0;
  const priceUnit = buildPriceUnit(parseFloat(value));
  if (!value) {
    return '';
  }
  const number = parseFloat(value);
  let roundedLength = 0;

  if (number < 1000) {
    result = number
  } else if (number < MOT_TRIEU) {
    result = number / MOT_NGHIN
  } else if (number < MOT_TY) {
    result = number / MOT_TRIEU
    roundedLength = 1;
  } else if (number >= MOT_TY) {
    result = number / MOT_TY
    roundedLength = 2;
  } else {
    result = number
  }

  return `${removeTrailingZeros(result.toFixed(roundedLength))} ${priceUnit}`
}

function buildPriceUnit(value: number) {
  let result = '';
  if (value >= MOT_TY) {
    result = 'tỷ';
  } else if (value >= MOT_TRIEU) {
    result = 'triệu';
  } else if (value >= MOT_NGHIN) {
    result = 'nghìn';
  }
  return result;
}

export const buildOptionsPrice = ({ searchText, businessType }: { searchText: string, businessType: string }): OptionForSelect[] => {
  if (!searchText) return [];
  const regexCheckOnlyContainZero = /^0*$/;
  if (regexCheckOnlyContainZero.test(searchText)) return [];

  const value = parseInt(searchText);

  // Sell: min 100 triệu / Rent: min 1 triệu ------------------------------------------
  const minPrice = businessType === 'sell' ? minPriceSell : minPriceRent;
  const options = [];
  if (value > MOT_TRIEU) {
    const valueToAdd = value / 10
    options.push(valueToAdd);
  }
  if (searchText.length <= `${minPrice}`.length) {
    let valueToAdd = value * Math.pow(10, `${minPrice}`.length - searchText.length);
    if (valueToAdd < minPrice) {
      valueToAdd = valueToAdd * 10;
    }
    options.push(valueToAdd);
  } else {
    options.push(value);
  }

  for (let i = 0; i < 2; i++) {
    options.push(options[options.length - 1] * 10);
  }

  const result = options.map((value: number) => {
    return {
      value: `${value}`,
      text: formatPrice(value.toString()),
      description: readMoney(value.toString())
    };
  });

  return result.filter((item) => item.value.length <= 15);
};

export const maskNumber = (value: string) => {
  value = value + '';
  if (!value)
    return {
      rawValue: '',
      formattedValue: '',
    };

  if (value === 'Thỏa thuận')
    return {
      rawValue: 'Thỏa thuận',
      formattedValue: 'Thỏa thuận',
    };
  // Remove non-numeric characters and store the raw value
  const rawValue = value.replace(/\D/g, '');

  if (rawValue === '') {
    return {
      rawValue: '',
      formattedValue: '',
    };
  }

  // Format the value for display
  const formattedValue = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
  }).format(parseInt(rawValue));

  return {
    rawValue,
    formattedValue: formattedValue,
  };
};


/**
 * Formats price value to Vietnamese format (tr = triệu, ty = tỷ)
 */
export function formatPriceFriendly(price: number, unit: true | false = true, forDislay = false): string {
  const unitTy = forDislay ? ' tỷ' : 'ty';
  const unitTr = forDislay ? ' triệu' : 'tr';
  const unitK = forDislay ? ' k' : 'k';

  if (price >= 1_000_000_000) {
    const ty = price / 1_000_000_000;
    return ty % 1 === 0 ? `${ty}${unit ? unitTy : ''}` : `${ty.toFixed(1)}${unit ? unitTy : ''}`;
  } else if (price >= 1_000_000) {
    const tr = price / 1_000_000;
    return tr % 1 === 0 ? `${tr}${unit ? unitTr : ''}` : `${tr.toFixed(1)}${unit ? unitTr : ''}`;
  } else if (price >= 1_000) {
    const tr = price / 1_000;
    return tr % 1 === 0 ? `${tr}${unit ? unitK : ''}` : `${tr.toFixed(1)}${unit ? unitK : ''}`;
  } else {
    return `${price}`;
  }
}

// Build human-readable price range using the shared formatPrice logic (tr/ty units)
export const formatPriceRangeToDisplay = (
  min?: number,
  max?: number
): string | undefined => {
  const hasMin = typeof min === 'number' && !Number.isNaN(min as number);
  const hasMax = typeof max === 'number' && !Number.isNaN(max as number);
  const formattedMin = formatPriceFriendly(min as number, true, true);
  const formattedMax = formatPriceFriendly(max as number, true, true);

  if (!hasMin && !hasMax) return undefined;
  if (hasMin && !hasMax) return `> ${formattedMin}`;
  if (!hasMin && hasMax) return `< ${formattedMax}`;

  return `${formattedMin}-${formattedMax}`;
};
