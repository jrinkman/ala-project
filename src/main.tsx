import { useState, useEffect } from 'react';
import { TextInput, Grid, Group, Button, Card, Container } from '@mantine/core';
import { DownloadIcon } from '@radix-ui/react-icons';

// For HTTP requests
import axios from 'axios';

import SpeciesCard from './components/SpeciesCard';

function Main() {
  const [speciesData, setSpeciesData] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Listen for search changes <FIX>
  useEffect(() => {
    async function getSearchResults() {
      try {
        // Reset the error state (in case we're making a new request after an error)
        setError(null);
        setIsSearching(true);

        // Make a request to the ALA API
        const { searchResults } = (
          await axios.get<SearchResponse>(`search.json`)
        ).data;

        setIsSearching(false);
        setSpeciesData(searchResults);
      } catch (error) {
        setError(error as Error);
        setIsSearching(false);
      }
    }

    getSearchResults();
  }, []);

  return (
    <Container size="xl">
      <Card shadow="md" radius="lg" style={{ marginTop: 15, marginBottom: 35 }}>
        <Grid>
          <Grid.Col xs={12} sm={10} md={10} lg={10} xl={11}>
            <TextInput
              sx={{ input: { fontFamily: 'Inter' } }}
              placeholder="Species name, i.e. 'Fish'"
              onChange={(ev) => console.log(ev)}
              radius="md"
            />
          </Grid.Col>
          <Grid.Col xs={12} sm={2} md={2} lg={2} xl={1}>
            <Button
              loading={!speciesData || speciesData.results.length === 0}
              radius="md"
              variant="light"
              leftIcon={<DownloadIcon />}
              fullWidth
            >
              CSV
            </Button>
          </Grid.Col>
        </Grid>
      </Card>
      {speciesData && !isSearching ? (
        <Grid>
          {speciesData.results.map((species: Species) => (
            <Grid.Col key={species.id} xs={12} sm={6} md={4} lg={3}>
              <SpeciesCard species={species} />
            </Grid.Col>
          ))}
        </Grid>
      ) : (
        Array.from(Array(15).keys()).map((key) => (
          <Grid.Col key={key} xs={12} sm={6} md={4} lg={3}>
            <SpeciesCard species={null} />
          </Grid.Col>
        ))
      )}
    </Container>
  );
}

export default Main;
