const THRESHOLD = 1000;

function isHuman(request, map) {
    const ip = request.info.remoteAddress

    const previousCall = map.get(ip);

    const now = Date.now();
    map.set(ip, now);

    if(!previousCall) return true;

    const then = new Date(previousCall)

    console.log(now - then)
    return (now - then > THRESHOLD)
}

function isHoneyPotted(request) {
    return (
        request.query.captcha != null
        && request.query.captcha != ""
        && (!Array.isArray(request.query.captcha) || request.query.captcha.some((element) => element != ""))
    )
}

function CaptchaMiddleware(request, h) {
    if (!isHuman(request, request.server.settings.app.CaptchaMap) || isHoneyPotted(request)) {
        const response = h.response().redirect(`/captcha?redirect=${encodeURIComponent(request.url)}`)
            .temporary()
        response.takeover()
        return response
    }
    return h.continue
}

module.exports = {
    CaptchaMiddleware,
}
