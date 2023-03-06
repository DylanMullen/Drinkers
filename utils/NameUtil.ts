
const AVATAR_SERVICE = "https://source.boringavatars.com/beam/512/Drinkers-"

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


export function getRandomName(): string
{
    let prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    let noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    return prefix + noun;
}

export function getRandomAvatar(name: string)
{
    return AVATAR_SERVICE + name + "-" + (Math.random() * 100)
}


export { }