package pirate

import (
	"encoding/json"
	"io/ioutil"
	"os"

	"drinkers.beer/waterfall/gamemodes/pirate/errors"
	"drinkers.beer/waterfall/gamemodes/pirate/models"
)

var (
	packs           map[string]models.PiratePack
	loadedPacksJSON []models.PiratePackSettings
)

func LoadAllPacks() {
	packs = make(map[string]models.PiratePack)
	loadedPacksJSON = make([]models.PiratePackSettings, 0)

	packFiles, err := ioutil.ReadDir("./gamemodes/pirate/packs")
	if err != nil {
		return
	}

	for _, v := range packFiles {
		loadPack(v.Name())
	}
}

func GetPack(uuid string) (pack models.PiratePack, err error) {
	if packs != nil {
		temp, found := packs[uuid]
		if !found {
			err = errors.PackNotFound{UUID: uuid}
			return
		}
		pack = temp
		return
	}
	err = errors.PackNotFound{UUID: uuid}
	return
}

func LoadedPacksJSON() []models.PiratePackSettings {

	return loadedPacksJSON
}

func loadPack(fileName string) {
	jsonFile, err := os.Open("./gamemodes/pirate/packs/" + fileName)

	if err != nil {
		return
	}

	defer jsonFile.Close()

	contents, err := ioutil.ReadAll(jsonFile)

	if err != nil {
		return
	}

	pack, err := unmarshalPack(contents)

	if err != nil {
		return
	}

	packs[pack.Settings.UUID] = pack
	if pack.Settings.Disabled {
		return
	}
	loadedPacksJSON = append(loadedPacksJSON, pack.Settings)
}

func unmarshalPack(contents []byte) (pack models.PiratePack, err error) {
	err = json.Unmarshal(contents, &pack)
	return
}
