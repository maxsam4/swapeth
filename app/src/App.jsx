import React from 'react';
import {
  ChakraProvider,
  theme,
  CSSReset,
} from '@chakra-ui/react';
import Home from './components/Home';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <CSSReset />      
      <Home />
    </ChakraProvider>
  );
}

export default App;
