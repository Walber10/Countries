export interface CountryData {
  name: {
    common: string;
    official: string;
    nativeName: {
      eng: {
        official: string;
        common: string;
      };
    };
  };
  currencies: {
    [key: string]: {
      name: string;
      symbol: string;
    };
  };
  capital: string[];
  languages: {
    eng: string;
  };
  flag: string;
  coatOfArms?: {
    png: string;
    svg: string;
  };
  car: {
    signs: string[];
    side: string;
  };
  flags: {
    png: string;
    svg: string;
  };
}


