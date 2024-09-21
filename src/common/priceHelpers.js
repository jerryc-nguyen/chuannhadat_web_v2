export const minPriceSell = 100000000;
export const minPriceRent = 1000000;

export function formatPrice(price) {
  return `${price}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export function readMoney(value) {
  let result = "";
  let priceUnit = buildPriceUnit(`${value}`);
  if (value.isEmpty) {
    return "";
  }
  const valueSplitted = `${value}`.split("");
  if (
    valueSplitted.length === 4 ||
    valueSplitted.length === 7 ||
    valueSplitted.length === 10 ||
    valueSplitted.length === 13
  ) {
    result = `${valueSplitted[0]}.${valueSplitted.slice(1, 3).join("")}`;
  } else if (
    valueSplitted.length === 5 ||
    valueSplitted.length === 8 ||
    valueSplitted.length === 11 ||
    valueSplitted.length === 14
  ) {
    result = `${valueSplitted.slice(0, 2).join("")}.${valueSplitted
      .slice(2, 4)
      .join("")}`;
  } else if (
    valueSplitted.length === 6 ||
    valueSplitted.length === 9 ||
    valueSplitted.length === 12 ||
    valueSplitted.length === 15
  ) {
    result = `${valueSplitted.slice(0, 3).join("")}.${valueSplitted
      .slice(3, 5)
      .join("")}`;
  } else {
    result = value;
  }

  return `${result} ${priceUnit}`;
}

function buildPriceUnit(value) {
  let result = "VNĐ";
  if (value.length >= 4 && value.length <= 6) {
    result = "nghìn VNĐ";
  } else if (value.length >= 7 && value.length <= 9) {
    result = "triệu VNĐ";
  } else if (value.length >= 10 && value.length <= 12) {
    result = "tỷ VNĐ";
  } else if (value.length >= 13 && value.length <= 15) {
    result = "nghìn tỷ VNĐ";
  }
  return result;
}

export const buildOptionsPrice = ({ searchText, businessType }) => {
  if ( !searchText ) return [];
  const regexCheckOnlyContainZero = /^0*$/;
  if ( regexCheckOnlyContainZero.test(searchText) ) return [];

  const value = parseInt(searchText);

  // Sell: min 100 triệu / Rent: min 1 triệu ------------------------------------------
  const minPrice = businessType === "sell" ? minPriceSell : minPriceRent;
  const options = [];
  if (searchText.length <= `${minPrice}`.length) {
    let valueToAdd =
      value * Math.pow(10, `${minPrice}`.length - searchText.length);
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
  const result = options.map((value) => {
    return {
      value: `${value}`,
      label: `${formatPrice(value)} (${readMoney(value)})`
    };
  });

  return result.filter(item => item.value.length <= 15);
};

export const maskNumber = (value) => {
  if ( !value ) return {
    rawValue: "0",
    formattedValue: "0",
  };

  if ( value === "Thỏa thuận" ) return {
    rawValue: "Thỏa thuận",
    formattedValue: "Thỏa thuận",
  }
  // Remove non-numeric characters and store the raw value
  const rawValue = value.replace(/\D/g, "");

  // Format the value for display
  const formattedValue = new Intl.NumberFormat("vi-VN", {
    minimumFractionDigits: 0,
  }).format(rawValue);

  return {
    rawValue,
    formattedValue: formattedValue,
  };
}
