import { Card } from 'components/Form/Card';
import Row, { ExpandableRow, RowProps } from 'components/Form/Row';
import Heading from 'components/Form/Heading';
import colors from 'styles/colors';

const DNS_KEY_TYPES = {
  FLAGS: 0,
  PROTOCOL: 1,
  ALGORITHM: 2,
};

const DNS_KEY_TYPE_NAMES = {
  [DNS_KEY_TYPES.FLAGS]: 'flags',
  [DNS_KEY_TYPES.PROTOCOL]: 'protocol',
  [DNS_KEY_TYPES.ALGORITHM]: 'algorithm',
};

const DNS_KEY_FLAG_MEANINGS = {
  256: 'Zone Signing Key (ZSK)',
  257: 'Key Signing Key (KSK)',
};

const DNS_KEY_PROTOCOL_MEANINGS = {
  3: 'DNSSEC',
};

const DNS_KEY_ALGORITHM_MEANINGS = {
  5: 'RSA/SHA-1',
  7: 'RSASHA1-NSEC3-SHA1',
  8: 'RSA/SHA-256',
  10: 'RSA/SHA-512',
  13: 'ECDSA Curve P-256 with SHA-256',
  14: 'ECDSA Curve P-384 with SHA-384',
  15: 'Ed25519',
  16: 'Ed448',
};

const DNS_RECORD_TYPES = {
  A: 1,
  NS: 2,
  CNAME: 5,
  SOA: 6,
  PTR: 12,
  HINFO: 13,
  MX: 15,
  TXT: 16,
  AAAA: 28,
  SRV: 33,
  NAPTR: 35,
  DNAME: 39,
  OPT: 41,
  DS: 43,
  RRSIG: 46,
  NSEC: 47,
  DNSKEY: 48,
  NSEC3: 50,
  NSEC3PARAM: 51,
  TLSA: 52,
  SMIMEA: 53,
  HIP: 55,
  NINFO: 56,
  RKEY: 57,
  TALINK: 58,
  CDS: 59,
  CDNSKEY: 60,
  OPENPGPKEY: 61,
  CSYNC: 62,
  ZONEMD: 63,
};

const parseDNSKeyData = (data: string): DNSKeyData => {
  const dnsKey = data.split(' ');

  const keyTypes: DNSKeyType = dnsKey.map((value) => parseInt(value, 10));
  const keyTypeNames = keyTypes.map((keyType) => DNS_KEY_TYPE_NAMES[keyType]);
  const keyTypeMeanings = keyTypes.map((keyType) => {
    switch (keyType) {
      case DNS_KEY_TYPES.FLAGS:
        return DNS_KEY_FLAG_MEANINGS[keyType];
      case DNS_KEY_TYPES.PROTOCOL:
        return DNS_KEY_PROTOCOL_MEANINGS[keyType];
      case DNS_KEY_TYPES.ALGORITHM:
        return DNS_KEY_ALGORITHM_MEANINGS[keyType];
      default:
        return 'Unknown';
    }
  });

  return {
    keyTypes,
    keyTypeNames,
    keyTypeMeanings,
    publicKey: dnsKey[3],
  };
};

const getRecordTypeName = (typeCode: number): string => {
  const recordType = DNS_RECORD_TYPES[typeCode];
  if (recordType) {
    return recordType;
  }
  return 'Unknown';
};

const parseDSData = (dsData: string): DSData => {
  const parts = dsData.split(' ');

  const keyTag = parseInt(parts[0], 10);
  const algorithm = parseInt(parts[1], 10);
  const digestType = parseInt(parts[2], 10);
  const digest = parts[3];

  return {
    keyTag,
    algorithm,
    digestType,
    digest,
  };
};

const getAlgorithmName = (code: number): string => {
  switch (code) {
    case 1:
    case 5:
      return 'RSA/MD5';
    case 2:
      return 'Diffie-Hellman';
    case 3:
      return 'DSA/SHA1';
    case 7:
    case 8:
    case 10:
      return 'RSA/SHA1';
    case 12:
      return 'ECC/GOST';
    case 13:
    case 14:
      return 'ECDSA/CurveP256/SHA256';
    case 15:
      return 'Ed25519';
    case 16:
      return 'Ed448';
    default:
      return 'Unknown';
  }
};

const getDigestTypeName = (code: number): string => {
  switch (code) {
    case 1:
      return 'SHA1';
    case 2:
      return 'SHA256';
    case 3:
      return 'GOST R 34.11-94';
    case 4:
      return 'SHA384';
    default:
      return 'Unknown';
  }
};

const makeResponseList = (response: Response): RowProps[] => {
  const result: RowProps[] = [];

  if (response.RD !== undefined) {
    result.push({ lbl: 'Recursion Desired (RD)', val: response.RD });
  }
  if (response.RA !== undefined) {
    result.push({ lbl: 'Recursion Available (RA)', val: response.RA });
  }
  if (response.TC !== undefined) {
    result.push({ lbl: 'TrunCation (TC)', val: response.TC });
  }
  if (response.AD !== undefined) {
    result.push({ lbl: 'Authentic Data (AD)', val: response.AD });
  }
  if (response.CD !== undefined) {
    result.push({ lbl: 'Checking Disabled (CD)', val: response.CD });
  }

  return result;
};

const makeAnswerList = (recordData: Answer): RowProps[] => {
  const { name, type, TTL, algorithm, flags, protocol, data } = recordData;

  const label = getRecordTypeName(type);

  return [
    { lbl: 'Domain', val: name },
    { lbl: 'Type', val: `${label} (${type})` },
    { lbl: 'TTL', val: TTL },
    { lbl: 'Algorithm', val: algorithm },
    { lbl: 'Flags', val: flags },
    { lbl: 'Protocol', val: protocol },
    { lbl: 'Public Key', val: data },
  ].filter((rowData) => rowData.val && rowData.val !== 'Unknown');
};

type DNSKeyType = 0 | 1 | 2;

interface DNSKeyData {
  keyTypes: DNSKeyType[];
  keyTypeNames: string[];
  keyTypeMeanings: string[];
  publicKey: string;
}

interface DSData {
  keyTag: number;
  algorithm: number;
  digestType: number;
  digest: string;
}

interface Response {
  RD?: boolean;
  RA?: boolean;
  TC?: boolean;
  AD?: boolean;
  CD?: boolean;
}

interface Answer {
  name: string;
  type: number;
  TTL: number;
  algorithm: number;
  flags: number;
  protocol: number;
  data: string;
}

interface Props {
  data: {
    DNSKEY: {
      isFound: boolean;
      response?: Response;
      answer?: Answer[];
    };
    DS: {
      isFound: boolean;
      response?: Response;
      answer?: Answer[];
    };
    RRSIG: {
      isFound: boolean;
      response?: Response;
      answer?: Answer[];
    };
  };
  title: string;
  actionButtons: any;
}

const DnsSecCard: React.FC<Props> = (props) => {
  const { data, title, actionButtons } = props;

  return (
    <Card heading={title} actionButtons={actionButtons}>
      {Object.entries(data).map(([key, record]) => {
        const isFound = record.isFound;
        const response = record.response;
        const answer = record.answer;

        return (
          <div key={key}>
            <Heading as="h3" size="small" color={colors.primary}>
              {key}
            </Heading>
            {isFound && answer && answer.length > 0 ? (
              answer.map((answerData, index) => {
                const keyData = parseDNSKeyData(answerData.data);
                const dsData = parseDSData(answerData.data);
                const label =
                  keyData.keyTypeMeanings[DNS_KEY_TYPES.FLAGS] &&
                  keyData.keyTypeMeanings[DNS_KEY_TYPES.FLAGS] !== 'Unknown'
                    ? keyData.keyTypeMeanings[DNS_KEY_TYPES.FLAGS]
                    : key;

                return (
                  <ExpandableRow
                    key={`${key}-${index}`}
                    lbl={`Record #${index + 1}`}
                    val={label}
                    rowList={makeAnswerList({
                      ...answerData,
                      ...keyData,
                      ...dsData,
                    })}
                    open
                  />
                );
              })
            ) : (
              <ExpandableRow
                lbl={`${key} - Present?`}
                val={isFound ? '✅ Yes' : '❌ No'}
                rowList={makeResponseList(response || {})}
              />
            )}
          </div>
        );
      })}
    </Card>
  );
};

export default DnsSecCard;
