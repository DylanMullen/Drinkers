import { randomName } from "components/waterfall/lobby/profile-editor/ProfileEditor"
import { deleteCookie, getCookie, hasCookie, setCookie } from "cookies-next"
import { v4 } from "uuid"
import { getRandomAvatar } from "./NameUtil"

export type User = {
    uuid: string
    username: string
    avatar: string,
    bot?: boolean,
    guest?: boolean
}

export function getUser(): User
{
    if (!hasCookie("user"))
        return createCookie()

    return JSON.parse(getCookie("user") as string);
}

export function saveUser(user: User)
{
    setCookie("user", user)
}

export function logout(): User
{
    deleteCookie("user");
    return createCookie();
}

export function getDefaultUser(): User
{
    return {
        uuid: "",
        avatar: "",
        username: ""
    }
}

export function createServerSideCookie(req:any, res:any)
{
    setCookie("user", {
        uuid: v4(),
        username: randomName(),
        avatar: getRandomAvatar(randomName()),
        guest: true
    }, {
        req,
        res
    })
}

function createCookie(): User
{
    setCookie("user", {
        uuid: v4(),
        username: randomName(),
        avatar: getRandomAvatar(randomName()),
        guest: true
    })
    return JSON.parse(getCookie("user") as string);
}