import { InputHTMLAttributes, ReactElement } from 'react';
import styled from 'styled-components';
import colors from 'styles/colors';
import { InputSize, applySize } from 'styles/dimensions';

type Orientation = 'horizontal' | 'vertical';

interface Props {
  id: string;
  value: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  size?: InputSize;
  orientation?: Orientation;
  type?: string;
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
}

type SupportedElements = HTMLInputElement | HTMLLabelElement | HTMLDivElement;
interface StyledInputTypes extends InputHTMLAttributes<SupportedElements> {
  inputSize?: InputSize;
  orientation?: Orientation;
  type?: string;
}

const InputContainer = styled.div<StyledInputTypes>`
  display: flex;
  flex-direction: ${(props) => (props.orientation === 'vertical' ? 'column' : 'row')};
`;

const StyledInput = styled.input<StyledInputTypes>`
  background: ${colors.background};
  color: ${colors.textColor};
  border: none;
  border-radius: 0.25rem;
  font-family: PTMono;
  box-shadow: 3px 3px 0px ${colors.backgroundDarker};
  outline: none;

  &:focus {
    box-shadow: 3px 3px 0px ${colors.primary};
  }

  &:disabled {
    background: ${colors.backgroundDarker};
    cursor: not-allowed;
  }

  ${(props) => applySize(props.inputSize)};
`;

const StyledLabel = styled.label<StyledInputTypes>`
  color: ${colors.textColor};
  ${(props) => applySize(props.inputSize)};
  padding: 0;
  font-size: 1.6rem;

  &[for='${(props) => props.htmlFor}'] {
    margin-right: 0.5rem;
  }
`;

const Input = ({
  id,
  value,
  label,
  placeholder,
  disabled,
  size,
  orientation,
  type = 'text',
  handleChange,
}: Props): ReactElement => {
  return (
    <InputContainer orientation={orientation}>
      {label && <StyledLabel htmlFor={id} inputSize={size}>{label}</StyledLabel>}
      <StyledInput
        id={id}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={handleChange}
        inputSize={size}
        type={type}
      />
    </InputContainer>
  );
};

export default Input;
