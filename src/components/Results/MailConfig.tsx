import React from 'react';
import { Card, Row } from 'components';
import Heading from 'components/Form/Heading';
import colors from 'styles/colors';
import { any } from 'typescript';
import { JSX } from 'react/jsx-runtime';

interface MailConfigCardProps {
  data: any;
  title: string;
  actionButtons?: any;
}

const MailConfigCard: React.FC<MailConfigCardProps> = (props: MailConfigCardProps): JSX.Element => {
  const mailServer = props.data || {};
  const txtRecords = (mailServer.txtRecords || []).join('').toLowerCase() || '';
  const mxRecords = mailServer.mxRecords || [];
  const mailServices = mailServer.mailServices || [];

  return (
    <Card heading={props.title} actionButtons={props.actionButtons} styles={cardStyles}>
      <Heading as="h3" color={colors.primary} size="small">Mail Security Checklist</Heading>
      <Row lbl="SPF" val={txtRecords.includes('spf')} />
      <Row lbl="DKIM" val={txtRecords.includes('dkim')} />
      <Row lbl="DMARC" val={txtRecords.includes('dmarc')} />
      <Row lbl="BIMI" val={txtRecords.includes('bimi')} />

      { mxRecords.length > 0 && <Heading as="h3" color={colors.primary} size="small">MX Records</Heading>}
      { mxRecords.map((record: any, index: number) => (
          <Row lbl="" val="" key={index}>
            <span>{record.exchange}</span>
            <span>{record.priority ? `Priority: ${record.priority}` : ''}</span>
          </Row>
        ))
      }
      { mailServices.length > 0 && <Heading as="h3" color={colors.primary} size="small">External Mail Services</Heading>}
      { mailServices.map((service: any, index: number) => (
        <Row lbl={service.provider} title={service.value} val="" key={index} />
        ))
      }

      { mailServer.txtRecords && <Heading as="h3" color={colors.primary} size="small">Mail-related TXT Records</Heading>}
      { mailServer.txtRecords && mailServer.txtRecords.map((record: any, index: number) => (
          <Row lbl="" val="" key={index}>
            <span>{record}</span>
          </Row>
        ))
      }
    </Card>
  );
}

const cardStyles = ``;

export default MailConfigCard;
