class CollectionServices::FriendlyParamsParser
  attr_reader :params

  WHITELIST_PARAMS = %i[
    only_url with_title
  ]

  NORMAL_PARAMS = %i[
    district_id ward_id street_id project_id
    sort_by sort_value page per_page keyword
  ] + WHITELIST_PARAMS

  FRIENDLY_VALUES_MAPPINGS = {
    'mua_ban' => 'sell',
    'cho_thue' => 'rent',
    'huong_tay' => 'west',
    'huong_tay_nam' => 'west_south',
    'huong_tay_bac' => 'west_north',
    'huong_dong' => 'east',
    'huong_dong_nam' => 'east_south',
    'huong_dong_bac' => 'east_north',
    'huong_nam' => 'south',
    'huong_bac' => 'north',
    'noi_that_day_du' => 'full_furniture',
    'hoan_thien_co_ban' => 'basic_furniture',
    'ban_giao_tho' => 'unfinished_furniture'
  }

  def initialize(params)
    @params = params.with_indifferent_access
  end

  def self.test
    params = { 'gia' => 'den-800ty', 'dien_tich' => 'den-80m2', 'phong_ngu' => '2', 'phong_tam' => '3', 'hinh_thuc' => 'mua_ban',
               'loai_bds' => 'nha_rieng' }.with_indifferent_access
    search_options = CollectionServices::FriendlyParamsParser.new(params).parse
    puts 'OUTPUT:'
    puts '--------------------------------'
    puts search_options
    puts '--------------------------------'
  end

  def all_params
    parse.merge(params.slice(*NORMAL_PARAMS)).with_indifferent_access
  end

  def parse
    parse_business_type
      .merge(parse_category_type)
      .merge(parse_price)
      .merge(parse_area)
      .merge(parse_bedrooms_count)
      .merge(parse_bathrooms_count)
      .merge(parse_direction)
  end

  def parse_business_type
    value = params[:hinh_thuc]
    return {} if value.nil? || value.strip.empty? || FRIENDLY_VALUES_MAPPINGS[value].blank?

    { business_type: FRIENDLY_VALUES_MAPPINGS[value] }
  end

  def parse_category_type
    value = params[:loai_bds]
    return {} if value.nil? || value.strip.empty? || !Core::Product.category_types.keys.include?(value)

    { category_type: value }
  end

  def parse_price
    value = params[:gia]
    return {} if value.nil? || value.strip.empty?

    str = value.downcase.strip

    # Handle Vietnamese prefixes
    if str.start_with?('tu-')
      return { min_price: parse_vn_price(str.delete_prefix('tu-')), max_price: nil }
    elsif str.start_with?('den-')
      return { min_price: nil, max_price: parse_vn_price(str.delete_prefix('den-')) }
    end

    # Handle range "min-max" or open-ended "min-" / "-max"
    parts = str.split('-').map(&:strip)
    min_str = parts[0]
    max_str = parts[1]

    {
      min_price: parse_vn_price(min_str),
      max_price: parse_vn_price(max_str)
    }
  end

  def parse_vn_price(str)
    return nil if str.nil? || str.empty?

    # Normalize common Vietnamese units
    num = str.gsub(/[^\d.]/, '').to_f
    return nil if num.zero?

    case str
    when /ty/
      (num * 1_000_000_000).to_i
    when /tr/
      (num * 1_000_000).to_i
    else
      # For plain numbers, round to integer
      num.round.to_i
    end
  end

  def parse_area
    value = params[:dien_tich]
    return {} if value.nil? || value.strip.empty?

    str = value.downcase.strip

    # Handle Vietnamese-style "tu-" / "den-"
    if str.start_with?('tu-')
      return { min_area: parse_vn_area(str.delete_prefix('tu-')), max_area: nil }
    elsif str.start_with?('den-')
      return { min_area: nil, max_area: parse_vn_area(str.delete_prefix('den-')) }
    end

    # Handle "min-max" or open-ended "min-" / "-max"
    parts = str.split('-').map(&:strip)
    min_str = parts[0]
    max_str = parts[1]

    {
      min_area: parse_vn_area(min_str),
      max_area: parse_vn_area(max_str)
    }
  end

  def parse_vn_area(str)
    return nil if str.nil? || str.empty?

    # Normalize and remove "m2" or "m²"
    cleaned = str.gsub(/m2|m²/, '').strip

    num = cleaned.gsub(/[^\d.]/, '').to_f
    return nil if num.zero?

    # Round to integer (area parser only supports integers)
    num.round
  end

  def parse_bedrooms_count
    value = params[:phong_ngu]
    return {} if value.nil? || value.strip.empty?

    { bedrooms_count: value.to_i }
  end

  def parse_bathrooms_count
    value = params[:phong_tam]
    return {} if value.nil? || value.strip.empty?

    { bathrooms_count: value.to_i }
  end

  def parse_direction
    value = params[:huong]
    return {} if value.nil? || value.strip.empty? || FRIENDLY_VALUES_MAPPINGS[value].blank?

    { direction: FRIENDLY_VALUES_MAPPINGS[value] }
  end
end
