import { randomName } from "components/waterfall/lobby/profile-editor/ProfileEditor"
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next"
import { uuid } from "uuidv4"

export type User = {
    uuid: string
    username: string
    avatar: string,
    guest?: boolean
}

export function getUser(): User
{
    if (!hasCookie("user"))
       return createCookie()


    return JSON.parse(getCookie("user") as string);

}

export function logout():User
{
    deleteCookie("user");
    return createCookie();
}

function createCookie():User
{
    setCookie("user", {
        uuid: uuid(),
        username: randomName(),
        avatar: "https://ca.slack-edge.com/T0266FRGM-U011PLSSMA9-g7e8a6705c42-512",
        guest: true
    })
    return JSON.parse(getCookie("user") as string);
}