import { RowProps } from 'components/Form/Row';

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type ServerLocation = {
  city: string;
  region: string;
  country: string;
  postCode: string;
  regionCode: string;
  countryCode: string;
  coords: Coordinates;
  isp: string;
  timezone: string;
  languages: string;
  currency: string;
  currencyCode: string;
  countryDomain: string;
  countryAreaSize: number;
  countryPopulation: number;
};

export type Whois = {
  created: string;
  expires: string;
  updated: string;
  nameservers: string[];
};

export type ServerInfo = {
  org: string;
  asn: string;
  isp: string;
  os?: string;
  ip?: string;
  ports?: string;
  loc?: string;
  type?: string;
};

export type HostNames = {
  domains: string[];
  hostnames: string[];
};

export type ShodanResults = {
  hostnames: HostNames | null;
  serverInfo: ServerInfo;
};

export type Technology = {
  Categories?: string[];
  Parent?: string;
  Name: string;
  Description: string;
  Link: string;
  Tag: string;
  FirstDetected: number;
  LastDetected: number;
  IsPremium: string;
};

export type TechnologyGroup = {
  tag: string;
  technologies: Technology[];
};

export type Cookie = {
  name: string;
  value: string;
  attributes: Record<string, string>;
};

export const getLocation = (response: any): ServerLocation => {
  // ...
};

export const getServerInfo = (response: any): ServerInfo => {
  // ...
};

export const getHostNames = (response: any): HostNames | null => {
  // ...
};

export const parseShodanResults = (response: any): ShodanResults => {
  // ...
};

export const makeTechnologies = (response: any): TechnologyGroup[] => {
  // ...
};

export const parseRobotsTxt = (content: string): { robots: RowProps[] } => {
  // ...
};

export const applyWhoIsResults = (response: any): Whois | { error: string } => {
  // ...
};
