import { TextInput, Container } from '@mantine/core';

// For HTTP requests
// import axios from 'axios';

function App() {
  return (
    <Container>
      <TextInput
        placeholder="Species name, i.e. 'Fish'"
        onChange={(ev) => console.log(ev)}
      />
      <span>testing</span>
    </Container>
  );
}

export default App;
