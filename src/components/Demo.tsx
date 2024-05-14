import React from 'react';
import { JSX } from 'react/jsx-runtime';

interface Props {
  message: string;
}

const Demo: React.FC<Props> = ({ message }): JSX.Element => <div>{message}</div>;

export default Demo;
