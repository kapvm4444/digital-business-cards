const querystring = require('node:querystring');

class ApiFeatures {
  //query = Model.find()
  //QueryString = parameters
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  //filter is used to remove all our filter parameters and filter the query based on the condition (field[gt]=value)
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

  //fields - Just like the select query in SQL, select the limited fields
  selectFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields;
      fields.split(',').join(' ');
      this.query = this.query.select(fields);
    }

    return this;
  }

  //sorting the fields
  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sortBy.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    }
  }
}

module.exports = ApiFeatures;
