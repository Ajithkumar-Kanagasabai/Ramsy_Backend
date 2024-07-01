const unprotectedPaths = [
    'POST-/contactUs',
    'GET-/events/:variable',
    'POST-/getEvents',
    'POST-/users',
    'POST-/users/login',
    'POST-/users/forgotPassword',
    'POST-/users/resetPassword',
    'GET-/'
]

const enumValues = {
    SERVICE_PROVIDER: 'provider',
    CLIENT: 'client',
    INVALID_BOOKING_STATUSES: [
        'new',
        'rejected',
        'productProviderCancelled',
        'clientCancelled',
    ],
}
module.exports = {
    unprotectedPaths,
    enumValues,
}
