import { useState, useEffect } from 'react';
import { Card, Button, ExpandableRow } from 'components';

interface CipherSuite {
  title: string;
  fields: { lbl: string; val: string | string[] }[];
}

interface TlsCardProps {
  data?: any;
  title: string;
  actionButtons?: any;
}

const makeCipherSuites = (results: any): CipherSuite[] => {
  if (!results || !results.connection_info || !results.connection_info.ciphersuite?.length) {
    return [];
  }
  return results.connection_info.ciphersuite.map((ciphersuite: any) => {
    return {
      title: ciphersuite.cipher,
      fields: [
        { lbl: 'Code', val: ciphersuite.code },
        { lbl: 'Protocols', val: ciphersuite.protocols.join(', ') },
        { lbl: 'Pubkey', val: ciphersuite.pubkey },
        { lbl: 'Sigalg', val: ciphersuite.sigalg },
        { lbl: 'Ticket Hint', val: ciphersuite.ticket_hint },
        { lbl: 'OCSP Stapling', val: ciphersuite.ocsp_stapling ? '✅ Enabled' : '❌ Disabled' },
        { lbl: 'PFS', val: ciphersuite.pfs },
        ...(ciphersuite.curves ? [{ lbl: 'Curves', val: ciphersuite.curves.join(', ') }] : []),
      ],
    };
  });
};

const TlsCard = (props: TlsCardProps): JSX.Element => {
  const [cipherSuites, setCipherSuites] = useState<CipherSuite[]>(makeCipherSuites(props.data));
  const [loadState, setLoadState] = useState<'loading' | 'success' | 'error' | undefined>(undefined);

  useEffect(() => {
    setCipherSuites(makeCipherSuites(props.data));
  }, [props.data]);

  const updateData = (id: number) => {
    setCipherSuites(Array<CipherSuite>);
    setLoadState('loading');
    const fetchUrl = `https://tls-observatory.services.mozilla.com/api/v1/results?id=${id}`;
    fetch(fetchUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setCipherSuites(makeCipherSuites(data));
        setLoadState('success');
      })
      .catch((error) => {
        setLoadState('error');
      });
  };

  const scanId = props.data?.id;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {cipherSuites.length &&
        cipherSuites.map((cipherSuite: CipherSuite, index: number) => {
          return (
            <ExpandableRow
              key={index}
              lbl={cipherSuite.title}
              val=""
              rowList={cipherSuite.fields}
            />
          );
        })}
      {!cipherSuites.length && (
        <div>
          <p>
            No cipher suites found.<br />
            This sometimes happens when the report didn't finish generating in-time, you can try re-requesting it.
          </p>
          <Button loadState={loadState} onClick={() => updateData(scanId)}>
            Refetch Report
          </Button>
        </div>
      )}
    </Card>
  );
};

export default TlsCard;
