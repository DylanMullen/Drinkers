
type CookiePolicy = {
    accepted: boolean,
    asked: number | undefined,
    askAgain: number | undefined
}

const ASK_DELAY = (1 * 1000) * 60 * 60 * 24 * 30


export function init()
{
    if (localStorage.getItem("cookies") !== undefined) return;

    let policy: CookiePolicy = {
        accepted: false,
        asked: undefined,
        askAgain: undefined
    }


    localStorage.setItem("cookies", JSON.stringify(policy))
}

export function handleCookieResponse(accepted: boolean)
{
    let policy: CookiePolicy = {
        accepted: accepted,
        asked: new Date().getTime(),
        askAgain: new Date().getTime() + ASK_DELAY
    }

    localStorage.setItem("cookies", JSON.stringify(policy))
}