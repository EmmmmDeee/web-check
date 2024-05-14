import { AnalysisResult } from '../types';

export const makeClientSupport = (results: AnalysisResult) => {
  if (!results?.analysis) return [];
  const target = results.target;
  const sslLabsClientSupport = (
    results.analysis.find((a: any) => a.analyzer === 'sslLabsClientSupport')
  ).result;

  return sslLabsClientSupport.map((sup: any) => {
    return {
      title: `${sup.name} ${sup.platform ? `(on ${sup.platform})` : sup.version}`,
      value: sup.is_supported ? '✅' : '❌',
      fields: sup.is_supported ? [
        sup.curve ? { lbl: 'Curve', val: sup.curve } : {},
        { lbl: 'Protocol', val: sup.protocol },
        { lbl: 'Cipher Suite', val: sup.ciphersuite },
        { lbl: 'Protocol Code', val: sup.protocol_code },
        { lbl: 'Cipher Suite Code', val: sup.ciphersuite_code },
        { lbl: 'Curve Code', val: sup.curve_code },
      ] : [
        { lbl: '', val: '', plaintext: `The host ${target} does not support ${sup.name} ${sup.version ? `version ${sup.version} ` : ''} ${sup.platform ? `on ${sup.platform} ` : ''}` }
      ],
    };
  });
};


import { useState, useEffect } from 'react';
import { Card, Button, ExpandableRow } from 'components/Form';
import { makeClientSupport } from './utils';

interface TlsCardProps {
  data?: any;
  title: string;
  actionButtons: any;
}

const TlsCard: React.FC<TlsCardProps> = (props) => {
  const [clientSupport, setClientSupport] = useState<any>([]);
  const [loadState, setLoadState] = useState<undefined | 'loading' | 'success' | 'error'>(undefined);

  useEffect(() => {
    if (props.data) {
      setClientSupport(makeClientSupport(props.data));
    }
  }, [props.data]);

  const updateData = (id: number) => {
    setClientSupport([]);
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
        setClientSupport(makeClientSupport(data));
        setLoadState('success');
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
        setLoadState('error');
      });
  };

  const scanId = props.data?.id;
  return (
    <Card heading={props.title} actionButtons={props.actionButtons}>
      {clientSupport.map((support: any, index: number) => (
        <ExpandableRow
          key={index}
          lbl={support.title}
          val={support.value || '?'}
          rowList={support.fields}
        />
      ))}
      {!clientSupport.length && (
        <
