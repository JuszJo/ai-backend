//@ts-ignore
import actualCountries from "./countries.json" with {type: "json"}

type CountryArgs = {
  name: string,
  code: string,
  flag: any
}

export function getCountriesForNumberInput() {
  const arr = actualCountries;

  const data = arr.map((country) => {
    return {
      //@ts-ignore
      code: country.callingCodes[0],
      flag: country.flag,
      name: country.name.common
    } satisfies CountryArgs
  })

  return data;
}