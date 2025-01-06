import { OptionForSelect } from "@models";

export const minPriceSell = 100000000;
export const minPriceRent = 1000000;

export function formatPrice(price: string) {
  return `${price}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export function readMoney(value: string) {
  let result: number = 0.0;
  const priceUnit = buildPriceUnit(`${value}`);
  if (!value) {
    return '';
  }
  const number = parseFloat(value);
  let roundedLength = 0;

  if (number < 1_000_000) {
    result = number / 1000
  } else if (number < 1000_000_000) {
    result = number / 1_000_000
    roundedLength = 1;
  } else if (number > 1000_000_000) {
    result = number / 1000_000_000
    roundedLength = 2;
  }

  return `${result.toFixed(roundedLength)} ${priceUnit}`.replace('.00', '').replace('.0', '');
}

function buildPriceUnit(value: string) {
  let result = '';
  if (value.length >= 4 && value.length <= 6) {
    result = 'nghìn';
  } else if (value.length >= 7 && value.length <= 9) {
    result = 'triệu';
  } else if (value.length >= 10) {
    result = 'tỷ';
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
  if (searchText.length <= `${minPrice}`.length) {
    let valueToAdd = value * Math.pow(10, `${minPrice}`.length - searchText.length);
    if (valueToAdd < minPrice) {
      valueToAdd = valueToAdd * 10;
    }
    options.push(valueToAdd);
  } else {
    options.push(value);
  }

  for (let i = 0; i <= 2; i++) {
    options.push(options[i] * 10);
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
