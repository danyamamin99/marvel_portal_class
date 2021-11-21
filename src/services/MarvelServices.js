class MarvelServices {
  _apiKey = 'apikey=ce45878989d72c7c636e784f9702cd28';
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _offsetBase = 210;

  getResourse = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }

    return res.json();
  }

  getAllCharacters = async (offset = this._offsetBase) => {
    const res = await this.getResourse(`${this._apiBase}characters?limit=9&offset=${offset}&${this._apiKey}`);
    return res.data.results.map(this._transformChar);
  }

  getCharacter = async (id) => {
    const res = await this.getResourse(`${this._apiBase}characters/${id}?${this._apiKey}`);
    return this._transformChar(res.data.results[0]);
  }

  _transformChar = (char) => {
    return {
      id: char.id,
      name: char.name,
      description: char.description ? `${char.description.slice(0, 210)}...` : 'There is no description for this character',
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      comics: char.comics.items,
    }
  }
}

export default MarvelServices;