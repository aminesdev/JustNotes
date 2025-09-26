export function errorHandler(err, req, res, next) {
    console.error(err.stack);

    if (err.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            msg: "Validation Error",
            errors: err.errors,
        });
    }

    if (err.code === "P2025") {
        return res.status(404).json({
            success: false,
            msg: "Record not found",
        });
    }

    res.status(500).json({
        success: false,
        msg: "Internal server error",
    });
}
