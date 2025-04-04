class ApiFeatures {
  //query = Model.find()
  //QueryString = parameters
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  //=>
  // 1. filter is used to remove all our filter parameters and filter the query based on the condition (field[gt]=value)
  filter() {
    const queryStr = { ...this.queryString };
    const excludeFields = ['page', 'limit', 'sortBy', 'fields'];
    excludeFields.map((el) => delete queryStr[el]);

    //preparing the query
    const queryObj = JSON.parse(
      JSON.stringify(queryStr).replaceAll(
        /\bgt | lt | gte | lte\b/g,
        (match) => `$${match}`,
      ),
    );

    this.query = this.query.find(queryObj);

    return this;
  }

  //=>
  // 2. fields - Just like the select query in SQL, select the limited fields
  selectFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields;
      fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }

    return this;
  }

  //=>
  // 3. sorting the fields
  sort() {
    if (this.queryString.sortBy) {
      const sortBy = this.queryString.sortBy.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  //=>
  // 4. Pagination based on page number and limit
  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiFeatures;
