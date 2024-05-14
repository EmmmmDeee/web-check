import { Card, ExpandableRow } from 'components/Form';
import { Cookie } from 'utils/result-processor';

type CookieAttributes = Record<string, string>;

const parseCookieString = (cookieString: string): Cookie => {
  const [nameValuePair, ...attributePairs] = cookieString.split('; ').map(part => part.trim());
  const [name, value] = nameValuePair.split('=');
  const attributes = Object.fromEntries(attributePairs.map(pair => pair.split('=')));
  return { name, value, attributes };
};

const CookiesCard = (props: { data: { headerCookies?: string[], clientCookies?: Cookie[] }, title: string, actionButtons: JSX.Element }): JSX.Element => {
  const headerCookies = (props.data.headerCookies || []).map(parseCookieString);
  const clientCookies = (props.data.clientCookies || []).map(cookie => ({ ...cookie, attributes: Object.fromEntries(Object.entries(cookie.attributes).map(([key, value]) => [key, value.toString()])) }));
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {
        headerCookies.map((cookie: Cookie, index: number) => {
          const attributes = Object.keys(cookie.attributes).map((key: string) => ({ lbl: key, val: cookie.attributes[key] }));
          return (
            <ExpandableRow key={`cookie-${index}`} lbl={cookie.name} val={cookie.value} rowList={attributes} />
          );
        })
      }
      {
        clientCookies.map((cookie: Cookie) => {
          const nameValPairs = Object.keys(cookie).map((key: string) => ({ lbl: key, val: cookie[key] }));
          return (
            <ExpandableRow key={`cookie-${cookie.name}`} lbl={cookie.name} val="" rowList={nameValPairs} />
          );
        })
      }
    </Card>
  );
}

export default CookiesCard;
