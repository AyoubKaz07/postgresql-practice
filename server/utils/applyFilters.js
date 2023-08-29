// Utility function to handle filter options and modify the SQL query
const sortOptions = {
  price_asc: 'price ASC',
  price_desc: 'price DESC',
  date_asc: 'created_at ASC',
  date_desc: 'created_at DESC',
};

const applyFilterOptions = (sqlQuery, filterOptions, queryParams) => {
    let { sort, brand, gender, page } = filterOptions;
    let params = 2;
    if (gender) {
      sqlQuery += ` AND gender = $${params}`
      queryParams.push(gender)
      params++
    }
  
    if (brand) {
      const subquery = `SELECT id FROM brands WHERE name = $${params}`;
      sqlQuery += ` AND brand_id = (${subquery})`;
      queryParams.push(brand);
      params++
    }
  
    if (sort && sortOptions[sort]) {
      sqlQuery += ` ORDER BY ${sortOptions[sort]}`;
    }

    page = page || 1
    const limit = 10;
    const offset = (page - 1) * limit;

    sqlQuery += ` LIMIT ${limit} OFFSET ${offset}`
    return sqlQuery;
};

module.exports = applyFilterOptions;