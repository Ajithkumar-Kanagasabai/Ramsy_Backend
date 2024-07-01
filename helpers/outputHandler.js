const log = require('./logger')
const errorHandler = (err, req, res) => {
    console.log(err);
    let userFriendlyMessagesMap = new Map()
    userFriendlyMessagesMap.set('SequelizeUniqueConstraintError', err?.message)
    userFriendlyMessagesMap.set('SequelizeValidationError', err?.message)
    userFriendlyMessagesMap.set('JsonWebTokenError', 'Invalid token')

    if (userFriendlyMessagesMap.has(err.name)) {
        return res.status(400).json({
            error: {
                code: 400,
                message: userFriendlyMessagesMap.get(err.name),
            },
        })
    }
    if (!err || !err.code) {
        log.logger('error', err.name, err.message, err.stack)
        return res.status(500).json({
            error: {
                code: 500,
                message: 'Some error occured on our side',
            },
        })
    }
    if ((err.code && err.code < 100) || err.code > 500) {
        return res.status(200).json({
            error: {
                code: err.code,
                message: err.message,
            },
        })
    }
    if (err.code && err.code >= 100 && err.code < 500) {
        return res.status(err.code).json({
            error: {
                code: -32063,
                message: err.message,
            },
        })
    }
    log.logger('error', err, err.name, err.message, err.stack)
    return res.status(500).json({
        error: {
            code: 500,
            message: 'Some error occured on our side',
        },
    })
}

const successHandler = (data, req, res) => {
    res.status(200).json({
        result: data,
        // id: isNaN(req.body.id) ? '1' : req.body.id,
        // jsonrpc: req.body.jsonrpc || '2.0',
    })
}

module.exports = {
    errorHandler,
    successHandler,
}
