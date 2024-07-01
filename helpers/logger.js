// level - info / warn / error / fatal
const { name } = require('../package.json')

exports.logger = async function (logLevel, logName, logMessage, logStack) {
    const wrapMessage = {
        timestamp: new Date().toISOString(),
        order: name,
        logLevel,
        message: {
            logName,
            logMessage,
            logStack,
        },
    }
    // eslint-disable-next-line
    console.log(JSON.stringify(wrapMessage))
}
