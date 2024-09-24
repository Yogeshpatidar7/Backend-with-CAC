//helper function for handling error througout the whole
//project we dont need to write tryCatch block in every route of anywhere 
//just use asynchandler as a middleware

const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        });
    }
};

export { asyncHandler };
