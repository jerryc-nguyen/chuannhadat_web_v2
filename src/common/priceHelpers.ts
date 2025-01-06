import { OptionForSelect } from "@models";
export const MOT_NGHIN = 1_000
export const MOT_TRIEU = 1_000_000
export const MOT_TY = 1_000_000_000
export const minPriceSell = 100_000_000;
export const minPriceRent = 1_000_000;

export function formatPrice(price: string) {
  return `${price}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function readMoney(value: string) {
  let result: number = 0.0;
  const priceUnit = buildPriceUnit(parseFloat(value));
  if (!value) {
    return '';
  }
  const number = parseFloat(value);
  let roundedLength = 0;

  if (number < MOT_TRIEU) {
    result = number / MOT_NGHIN
  } else if (number < MOT_TY) {
    result = number / MOT_TRIEU
    roundedLength = 1;
  } else if (number >= MOT_TY) {
    result = number / MOT_TY
    roundedLength = 2;
  }

  return `${result.toFixed(roundedLength)} ${priceUnit}`.replace('.00', '').replace('.0', '');
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
  if (businessType == 'sell' && value > MOT_TY) {
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
      rawValue: '0',
      formattedValue: '0',
    };

  if (value === 'Thỏa thuận')
    return {
      rawValue: 'Thỏa thuận',
      formattedValue: 'Thỏa thuận',
    };
  // Remove non-numeric characters and store the raw value
  const rawValue = value.replace(/\D/g, '');

  // Format the value for display
  const formattedValue = new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
  }).format(parseInt(rawValue));

  return {
    rawValue,
    formattedValue: formattedValue,
  };
};
