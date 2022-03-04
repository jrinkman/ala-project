import { MantineProvider } from '@mantine/core';
import Main from './Main';

function App() {
  return (
    <MantineProvider theme={{ fontFamily: 'Inter' }}>
      <Main />
    </MantineProvider>
  );
}

export default App;
