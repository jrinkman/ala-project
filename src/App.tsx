import { MantineProvider } from '@mantine/core';
import Search from './Search';

function App() {
  return (
    <MantineProvider
      theme={{ fontFamily: 'Inter', headings: { fontFamily: 'Inter' } }}
    >
      <Search />
    </MantineProvider>
  );
}

export default App;
