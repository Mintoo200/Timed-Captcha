const crypto = require("crypto")

const THRESHOLD = 1000;

async function hash(ip) {
    const encoder = new TextEncoder();
    const data = encoder.encode(ip);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    return hashHex;
}

async function isHuman(request, map) {
    const ip = request.info.remoteAddress;
    const ipHash = await hash(ip)

    const previousCall = map.get(ipHash);

    const now = Date.now();
    map.set(ipHash, now);

    if(!previousCall) return true;

    const then = new Date(previousCall)
    return (now - then > THRESHOLD)
}

function isHoneyPotted(request) {
    return (
        request.query.captcha != null
        && request.query.captcha != ""
        && (!Array.isArray(request.query.captcha) || request.query.captcha.some((element) => element != ""))
    )
}

async function CaptchaMiddleware(request, h) {
    const human = await isHuman(request, request.server.settings.app.CaptchaMap);
    if (!human || isHoneyPotted(request)) {
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
