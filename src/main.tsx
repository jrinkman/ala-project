import { useState, useEffect } from 'react';
import { TextInput, Group, Button, Card, Container } from '@mantine/core';

// For HTTP requests
import axios from 'axios';

function Main() {
  const [results, setResults] = useState<SearchAPIResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Listen for search changes <FIX>
  useEffect(() => {
    async function getSearchResults() {
      try {
        const { data } = await axios.get<SearchAPIResult>(`search.json`);
        setResults(data);
        console.log(data);
      } catch (error) {
        console.log(error);
      }
    }

    getSearchResults();
  }, []);

  return (
    <Container>
      <Card shadow="lg" radius="lg">
        <Group spacing="sm">
          <TextInput
            sx={{ input: { fontFamily: 'Inter' }, flexGrow: 1 }}
            placeholder="Species name, i.e. 'Fish'"
            onChange={(ev) => console.log(ev)}
            radius="md"
          />
          {results && (
            <Button radius="md" variant="light">
              Download as CSV
            </Button>
          )}
        </Group>
      </Card>
      <span>testing</span>
    </Container>
  );
}

export default Main;
