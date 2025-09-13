export type AdsTypeOption = {
    formatted_amount: string;
    text: string;
    value: string;
}

export type NumberOfDayOption = {
    formatted_discount: string;
    text: string;
    value: number;
}

export type UpVipProductOptions = {
    ads_type_options: AdsTypeOption[],
    number_of_day_options: NumberOfDayOption[],
}

export type ProductActionSetting = {
    total_refreshs_count: number;
    up_vip: UpVipProductOptions;
}