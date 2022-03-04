import { useState, useEffect } from 'react';
import { TextInput, Grid, Group, Button, Card, Container } from '@mantine/core';
import { DownloadIcon } from '@radix-ui/react-icons';

// For HTTP requests
import axios from 'axios';

import SpeciesCard from './components/SpeciesCard';

function Main() {
  const [speciesData, setSpeciesData] = useState<SearchResults | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Listen for search changes <FIX>
  useEffect(() => {
    async function getSearchResults() {
      try {
        // Reset the error state (in case we're making a new request after an error)
        setError(null);

        // Make a request to the ALA API
        const { searchResults } = (
          await axios.get<SearchResponse>(`search.json`)
        ).data;

        setSpeciesData(searchResults);
      } catch (error) {
        setError(error as Error);
      }
    }

    getSearchResults();
  }, []);

  return (
    <Container size="xl">
      <Card shadow="lg" radius="lg">
        <Group spacing="sm">
          <TextInput
            sx={{ input: { fontFamily: 'Inter' }, flexGrow: 1 }}
            placeholder="Species name, i.e. 'Fish'"
            onChange={(ev) => console.log(ev)}
            radius="md"
          />
          <Button
            disabled={!speciesData || speciesData.results.length === 0}
            radius="md"
            variant="light"
            leftIcon={<DownloadIcon />}
          >
            CSV
          </Button>
        </Group>
      </Card>
      {speciesData && (
        <Grid>
          {speciesData.results.map((species) => (
            <Grid.Col key={species.id} xs={12} sm={6} md={4} lg={3}>
              <SpeciesCard species={species} />
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  );
}

export default Main;
