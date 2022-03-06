import { useState, useEffect, useCallback, useRef } from 'react';
import {
  TextInput,
  ScrollArea,
  Grid,
  Group,
  Text,
  Button,
  Card,
  Center,
  Container,
  Pagination,
  Title,
  ActionIcon,
} from '@mantine/core';
import { DownloadIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';

// For HTTP requests
import axios, { AxiosError } from 'axios';

import SpeciesCard from './components/SpeciesCard';
import Message from './components/Message';

function Search() {
  const [speciesData, setSpeciesData] = useState<SearchResults | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Store a reference to the search input box
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Callback funciton for searching the API
  const getSearchResults = useCallback(async () => {
    // Ensure the search box has an input value
    if (!searchInputRef.current || searchInputRef.current.value.length < 1)
      return;

    try {
      // Reset the error state (in case we're making a new request after an error)
      setError(null);
      setIsSearching(true);

      // Make a request to the ALA API
      const { searchResults } = (
        await axios.get<SearchResponse>(
          `search.json?q=${
            searchInputRef.current.value
          }&pageSize=100&recordOffset=${currentPage - 1}`
        )
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
  }, [searchInputRef, isSearching]);

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
      <Card shadow="md" radius="lg" style={{ overflow: 'visible' }}>
        <Grid>
          <Grid.Col xs={12} sm={10} md={10} lg={10} xl={11}>
            <Group>
              <TextInput
                ref={searchInputRef}
                icon={<MagnifyingGlassIcon />}
                disabled={isSearching}
                sx={{ input: { fontFamily: 'Inter' }, flexGrow: 1 }}
                placeholder="Species name, i.e. 'Fish'"
                onKeyPress={(ev) => {
                  if (ev.key === 'Enter') getSearchResults();
                }}
                radius="md"
              />
              <ActionIcon
                variant="light"
                color="blue"
                size="lg"
                radius="md"
                onClick={getSearchResults}
              >
                <MagnifyingGlassIcon />
              </ActionIcon>
            </Group>
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
          return (
            <ScrollArea offsetScrollbars style={{ flexGrow: 1, marginTop: 35 }}>
              <Grid>
                {Array.from(Array(15).keys()).map((key) => (
                  <Grid.Col key={key} xs={12} sm={6} md={4} lg={3}>
                    <SpeciesCard species={null} />
                  </Grid.Col>
                ))}
              </Grid>
            </ScrollArea>
          );
        } else if (speciesData) {
          // If we have data from a successful API request
          return speciesData.results.length > 0 ? (
            <ScrollArea offsetScrollbars style={{ flexGrow: 1, marginTop: 35 }}>
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
            page={currentPage}
            onChange={(newPage) => {
              setCurrentPage(newPage);
              getSearchResults();
            }}
            radius="md"
            total={Math.floor(speciesData.totalRecords / 100) + 1}
            styles={{ item: { fontFamily: 'Inter' } }}
          />
        </Center>
      )}
    </Container>
  );
}

export default Search;
