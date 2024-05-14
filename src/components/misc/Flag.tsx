import * as io from 'io-ts';
import * as is from 'ityped';

const NonEmptyString = io.string.is(s => s.length > 0);
const CountryAlpha2Code = is.CountryAlpha2Code;

interface Props {
  countryCode: CountryAlpha2Code,
  width: number,
};

const Flag = ({ countryCode, width }: Props): JSX.Element => {
  const getFlagUrl = (code: string, w: number = 64) => {
    const protocol = 'https';
    const cdn = 'flagcdn.com';
    const dimensions = `${w}x${w * 0.75}`;
    const country = code.toLowerCase();
    const ext = 'png';
    return `${protocol}://${cdn}/${dimensions}/${country}.${ext}`;
  };

  const flagUrl = getFlagUrl(countryCode, width);

  return (
    <img
      key={flagUrl}
      src={flagUrl}
      alt={countryCode}
    />
  );
}

export default Flag;


npm install io-ts ityped
