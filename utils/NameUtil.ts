
const AVATAR_SERVICE = "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Drinkers-"

const PREFIXES: string[] = [
    "Drunk",
    "Sober",
    "Cold",
    "Warm",
    "Fruity",
    "Foaming",
    "Hard",
    "Mild",
    "Fermented",
    "Dirty",
    "Cloudy"
];

const NOUNS: string[] = [
    "Apple",
    "Grape",
    "Vodka",
    "Whiskey",
    "Brandy",
    "Rum",
    "Gin",
    "Seltzer",
    "Pear",
    "Banana",
    "Cane"
];

const pallettes: string[][] = [
    ["890FB6", "C721AD", "DA5CFA", "11B6D9", "54FFE1"],
    ["890FB6", "C721AD", "DA5CFA", "FFCB00", "E6FF54"],
    ["3A3A3A", "6BAEF0", "0079EE", "9BFF00", "FF5457"]
]


export function getRandomName(): string
{
    let prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    let noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    return prefix + noun;
}

export function getRandomAvatar(name: string)
{
    let scheme = getScheme()
    return AVATAR_SERVICE + name + "-" + (Math.random() * 35665)
}

function getScheme(): string
{
    let pallette = pallettes[Math.floor(Math.random() * pallettes.length)]
    let scheme = ""
    pallette.forEach((e, i) => scheme = scheme.concat(e + (i === pallette.length - 1 ? "" : ",")))
    return scheme
}


export { }