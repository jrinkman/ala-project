import { useState, useEffect, useCallback } from 'react';
import {
  TextInput,
  ScrollArea,
  Grid,
  Text,
  Button,
  Card,
  Center,
  Container,
  Pagination,
  Title,
} from '@mantine/core';
import { DownloadIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';

// For HTTP requests
import axios, { AxiosError } from 'axios';

import SpeciesCard from './components/SpeciesCard';
import Message from './components/Message';

function Main() {
  const [speciesData, setSpeciesData] = useState<SearchResults | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

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
        if (axios.isAxiosError(error)) {
          setError(`Network Error: ${(error as AxiosError).message}`);
        } else setError((error as Error).message);

        // Disable the searching flag
        setIsSearching(false);
      }
    }

    getSearchResults();
  }, []);

  // Callback function for downloading the results as a CSV
  const exportResultsCSV = useCallback(() => {
    if (!isExporting) {
      setIsExporting(true);
      setIsExporting(false);
    }
  }, [speciesData, isExporting]);

  return (
    <Container
      size="xl"
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        paddingTop: 15,
      }}
    >
      <Card shadow="md" radius="lg" style={{ marginBottom: 35 }}>
        <Grid>
          <Grid.Col xs={12} sm={10} md={10} lg={10} xl={11}>
            <TextInput
              icon={<MagnifyingGlassIcon />}
              disabled={isSearching}
              sx={{ input: { fontFamily: 'Inter' } }}
              placeholder="Species name, i.e. 'Fish'"
              onChange={(ev) => console.log(ev)}
              radius="md"
            />
          </Grid.Col>
          <Grid.Col xs={12} sm={2} md={2} lg={2} xl={1}>
            <Button
              loading={isExporting}
              disabled={Boolean(error) || !speciesData || isSearching}
              radius="md"
              variant="light"
              leftIcon={<DownloadIcon />}
              onClick={exportResultsCSV}
              fullWidth
            >
              CSV
            </Button>
          </Grid.Col>
        </Grid>
      </Card>
      {(() => {
        if (error) {
          return (
            <Center>
              <Title>An error occured.</Title>
              <Text>{error}</Text>
            </Center>
          );
        } else if (isSearching) {
          // If an API request is in progress
          return Array.from(Array(15).keys()).map((key) => (
            <Grid.Col key={key} xs={12} sm={6} md={4} lg={3}>
              <SpeciesCard species={null} />
            </Grid.Col>
          ));
        } else if (speciesData) {
          // If we have data from a successful API request
          return speciesData.results.length > 0 ? (
            <ScrollArea offsetScrollbars style={{ flexGrow: 1 }}>
              <Grid>
                {speciesData.results.map((species: Species) => (
                  <Grid.Col key={species.id} xs={12} sm={6} md={4} lg={3}>
                    <SpeciesCard species={species} />
                  </Grid.Col>
                ))}
              </Grid>
            </ScrollArea>
          ) : (
            <Message
              title="No results found."
              content="Try using a different search term, i.e. 'Fish'"
            />
          );
        } else {
          return (
            <Message
              title="Looking for a species?"
              content="Use the search bar above to get started."
            />
          );
        }
      })()}
      {speciesData && speciesData.results.length > 0 && (
        <Center style={{ paddingTop: 30, paddingBottom: 30 }}>
          <Pagination
            radius="md"
            total={Math.floor(speciesData.totalRecords / 100) + 1}
            styles={{ item: { fontFamily: 'Inter' } }}
          />
        </Center>
      )}
    </Container>
  );
}

export default Main;
