class ApiFueatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }
  //
  filter() {
    // 1- filtering
    const queryStingObject = { ...this.queryString }; //copying the query string object
    const excludeFilds = ["page", "sort", "limit", "fields"];
    excludeFilds.forEach((field) => delete queryStingObject[field]);

    let querryStr = JSON.stringify(queryStingObject);
    querryStr = querryStr.replace(
      /\b(gte|gt|lt|lte)\b/g,
      (match) => `$${match}`
    ); // reguler expression => (/\b(gte|gt|lt|lte)\b/g)
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(querryStr));
    return this;
  }

  sort() {
    // apply sorting by price and  sold
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join("");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v"); //Excloude the __v field
    }
    return this;
  }

  search() {
    if (this.queryString.keyword) {
      const query = {
        $or: [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ],
      };

      this.mongooseQuery = this.mongooseQuery.find(query);
    }

    return this;
  }
  paginate(countDecuoments) {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit;
    // Pagination Results
    const pagination = {};
    pagination.currentPage = page;
    pagination.limit = limit;
    pagination.numberOfPage = Math.ceil(countDecuoments / limit);

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.paginateResult = pagination;
    return this;
  }
}
module.exports = ApiFueatures;
