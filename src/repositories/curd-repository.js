const { StatusCodes } = require("http-status-codes");
const { Logger } = require("../config");
const AppError = require("../utils/errors/app-error");

class CrudRepository {
    constructor(model) {
        this.model = model;
    }

    async create(data) {
        try {
            const response = await this.model.create(data);
            return response;
        } catch (error) {
            // Detailed error logging
            console.error('Error in CrudRepository.create:', error);

            // Log validation or unique constraint messages if present
            if (error.errors) {
                error.errors.forEach(e => {
                    console.error('Validation error:', e.message);
                });
            }

            Logger.error("Something went wrong in the crud repo: create");

            // Optional: Wrap Sequelize errors into AppError with better message
            if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
                const explanation = error.errors.map(err => err.message);
                throw new AppError(
                    'Validation error while creating resource',
                    StatusCodes.BAD_REQUEST,
                    explanation
                );
            }

            // Throw original error if not validation related
            throw error;
        }
    }

    async destroy(data) {
        try {
            const response = await this.model.destroy({
                where: {
                    id: data
                }
            });
            if (!response) {
                throw new AppError(
                    'Unable to delete the requested resource',
                    StatusCodes.NOT_FOUND, ['No record found in the database for the given ID'],
                    'Cannot delete data of the resource '
                );
            }
            return response;
        } catch (error) {
            Logger.error("Something went wrong in the crud repo : destroy");
            throw error;
        }
    }

    async getById(data) {
        try {
            const response = await this.model.findByPk(data);
            if (!response) {
                throw new AppError(
                    'Unable to find the requested resource',
                    StatusCodes.NOT_FOUND, ['No record found in the database for the given ID'],
                    'Cannot fetch data the resource '
                );
            }
            return response;
        } catch (error) {
            Logger.error("Something went wrong in the crud repo : getById");
            throw error;
        }
    }

    async getAll() {
        try {
            const response = await this.model.findAll();
            return response;
        } catch (error) {
            Logger.error("Something went wrong in the crud repo : getAll");
            throw error;
        }
    }

    async update(id, data) {
        try {
            const response = await this.model.update(data, {
                where: {
                    id: id
                }
            });
            return response;
        } catch (error) {
            Logger.error("Something went wrong in the crud repo : update");
            throw error;
        }
    }
}

module.exports = CrudRepository;