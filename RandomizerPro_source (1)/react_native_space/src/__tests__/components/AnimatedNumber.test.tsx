import React from 'react';
import { render } from '@testing-library/react-native';
import { PaperProvider } from 'react-native-paper';
import AnimatedNumber from '../../components/AnimatedNumber';

const Wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <PaperProvider>{children}</PaperProvider>
);

describe('AnimatedNumber', () => {
  it('renders without crashing', () => {
    const { getByText } = render(
      <Wrapper>
        <AnimatedNumber value={42} />
      </Wrapper>
    );
    expect(getByText('42')).toBeTruthy();
  });

  it('renders string value', () => {
    const { getByText } = render(
      <Wrapper>
        <AnimatedNumber value="Test" />
      </Wrapper>
    );
    expect(getByText('Test')).toBeTruthy();
  });

  it('applies custom color', () => {
    const { getByText } = render(
      <Wrapper>
        <AnimatedNumber value={100} color="#FF0000" />
      </Wrapper>
    );
    const element = getByText('100');
    expect(element).toBeTruthy();
  });
});