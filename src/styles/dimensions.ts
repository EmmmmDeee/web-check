export type InputSize = 'small' | 'medium' | 'large';

const sizeSpecificStyles: Record<InputSize, React.CSSProperties> = {
  small: {
    fontSize: '1rem',
    borderRadius: '0.25rem',
    padding: '0.5rem 1rem',
    margin: '0.5rem',
  },
  medium: {
    fontSize: '1.5rem',
    borderRadius: '0.25rem',
    padding: '0.75rem 1.5rem',
    margin: '0.5rem',
  },
  large: {
    fontSize: '2rem',
    borderRadius: '0.25rem',
    padding: '1rem 1.75rem',
    margin: '0.5rem',
  },
};

export const applySize = (inputSize?: InputSize): React.CSSProperties => {
  return inputSize ? sizeSpecificStyles[inputSize] : sizeSpecificStyles.small;
};
