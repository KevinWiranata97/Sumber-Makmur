const {Area } = require("../models");
const { Op } = require('sequelize');
class Controller {


static async getArea(req, res, next) {
  try {
    // Get search query, page, and limit from request query parameters
    const searchQuery = req.query.search || ''; // Default search is an empty string
    const limit = parseInt(req.query.limit) || 10; // Default limit is 10
    let page = parseInt(req.query.page);
    
    // Ensure page is at least 1, handle cases where page=0 or NaN
    page = !isNaN(page) && page > 0 ? page : 1;

    const offset = (page - 1) * limit; // Calculate the offset for pagination (1-based page)

    // Find all areas with pagination and optional search query
    const { count, rows: areas } = await Area.findAndCountAll({
      where: {
        status: true, // Ensure the status is true
        [Op.or]: [
          {
            area_name: {
              [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in area_name field
            },
          },
          {
            area_code: {
              [Op.iLike]: `%${searchQuery}%`, // Case-insensitive search in area_code field (if applicable)
            },
          },
        ],
      },
      limit, // Limit the number of results returned per page
      offset, // Skip the first (page-1) * limit results
    });

    // Calculate the total number of pages
    const totalPages = Math.ceil(count / limit);

    // Return the results along with pagination metadata
    res.status(200).json({
      error: false,
      msg: 'Success',
      data: areas,
      pagination: {
        totalItems: count,
        currentPage: page,
        totalPages,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    next(error);
  }
}
  static async createArea(req, res, next) {
    try {
      const { area_name, area_code } = req.body;

      const data = {
    area_name,
        area_code,
      };

      await Area.create(data);
      res.status(201).json({
        error: false,
        msg: `Success`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }

  static async getAreaById(req, res, next) {
    try {
      const { id } = req.params;
      const area = await Area.findOne({
        where: {
          id,
          status: true,
        },
      });
      if (!area) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Area not found",
        };
      }

      res.status(200).json({
        error: false,
        msg: `Success`,
        data: area,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteArea(req, res, next) {
    try {
      const { id } = req.params;
      const area = await Area.findOne({
        where: {
          id,
        },
      });
      if (!area) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Area not found",
        };
      }
      const data = {
        status: false,
      };
      await Area.update(data, {
        where: {
          id,
        },
      });
      res.status(200).json({
        error: false,
        msg: `success delete Areas with id ${id}`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }
  static async editArea(req, res, next) {
    try {
      const { id } = req.params;
      const { area_name, area_code } = req.body;
      const area = await Area.findOne({
        where: {
          id,
        },
      });
      if (!area) {
        throw {
          name: "not_found",
          code: 404,
          msg: "Area not found",
        };
      }
      const data = {
       area_code,
       area_name
      };
      await Area.update(data, {
        where: {
          id,
        },
      });
      res.status(200).json({
        error: false,
        msg: `success`,
        data: [],
      });
    } catch (error) {
      next(error);
    }
  }

}

module.exports = Controller;
