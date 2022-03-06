import { useState, useCallback, useRef } from 'react';
import {
  TextInput,
  ScrollArea,
  Grid,
  Group,
  Button,
  Card,
  Center,
  Container,
  Pagination,
  ActionIcon,
} from '@mantine/core';
import { DownloadIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons';

// For HTTP requests
import axios, { AxiosError } from 'axios';

import SpeciesCard from './components/SpeciesCard';
import Message from './components/Message';

// Helper function for removing author name commas (which mess up the CSV formatting)
const stripAuthor = (name: string | null) =>
  name ? name.replaceAll(',', '') : 'N/A';

function Search() {
  const [speciesData, setSpeciesData] = useState<SearchResults | null>(null);
  const [firstHundred, setFirstHundred] = useState<SearchResults | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Store a reference to the search input box rather than storing the state
  // in a state variable - requires less page re-renders
  const searchInputRef = useRef<HTMLInputElement>(null);
  const downloadLinkRef = useRef<HTMLAnchorElement>(null);

  const getSearchResults = useCallback(
    async (start?: number) => {
      if (!searchInputRef.current || searchInputRef.current.value.length < 1)
        return;

      // If we haven't clicked a pagination button, select the first option again
      // (the 'start' parameter is only supplied upon clicking a pagination button)
      if (!start) setCurrentPage(1);

      try {
        // Reset the search & error state (in case we're making a new request after an error)
        setError(null);
        setIsSearching(true);

        const queryUrl = `search.json?q=${
          searchInputRef.current.value
        }&pageSize=100&start=${((start || 1) - 1) * 100}&fq=idxtype:TAXON`;

        const { searchResults } = (await axios.get<SearchResponse>(queryUrl))
          .data;

        // If we're retrieving the first hundred results (i.e. we're on page 1), store them
        if (!start || start === 1) {
          setFirstHundred(searchResults);
        }

        setIsSearching(false);
        setSpeciesData(searchResults);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(`Network Error: ${(error as AxiosError).message}`);
        } else setError((error as Error).message);
        setIsSearching(false);
      }
    },
    [searchInputRef, isSearching, currentPage]
  );

  // Callback function for downloading the results as a CSV
  const exportResultsCSV = useCallback(async () => {
    if (firstHundred) {
      // Generate an encoded CSV string with the first 100 species
      const csvString =
        'data:text/csv;charset=utf-8,' +
        'id,guid,kingdom,kingdomGuid,scientificName,author,imageUrl\n' +
        firstHundred.results
          .map(
            (species) =>
              `${species.id},` +
              `${species.guid},` +
              `${species.kingdom},` +
              `${species.kingdomGuid},` +
              `${species.scientificName},` +
              `${stripAuthor(species.author)},` +
              (species.imageUrl || 'N/A')
          )
          .join('\n');

      // Simulate a download by clicking the hidden anchor
      if (downloadLinkRef.current && searchInputRef.current) {
        downloadLinkRef.current.setAttribute('href', csvString);
        downloadLinkRef.current.setAttribute(
          'download',
          `${searchInputRef.current.value} (${new Date().toLocaleString()}).csv`
        );
        downloadLinkRef.current.click();
      }
    }
  }, [firstHundred]);

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
      <a style={{ display: 'none' }} ref={downloadLinkRef}></a>
      <Card shadow="md" radius="lg" style={{ overflow: 'visible' }}>
        <Grid gutter="xs">
          <Grid.Col xs={12} sm={10} md={10} lg={10} xl={11}>
            <Group spacing="xs">
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
                onClick={() => getSearchResults()}
              >
                <MagnifyingGlassIcon />
              </ActionIcon>
            </Group>
          </Grid.Col>
          <Grid.Col xs={12} sm={2} md={2} lg={2} xl={1}>
            <Button
              disabled={
                Boolean(error) ||
                !firstHundred ||
                firstHundred.results.length === 0 ||
                isSearching
              }
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
          return <Message title="An error occured." content={error} />;
        } else if (isSearching) {
          // If an API request is in progress
          return (
            <ScrollArea offsetScrollbars style={{ flexGrow: 1, marginTop: 35 }}>
              <Grid>
                {Array.from(Array(25).keys()).map((key) => (
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
      {speciesData && speciesData.results.length > 0 && !error && (
        <Center style={{ paddingTop: 25, paddingBottom: 25 }}>
          <Pagination
            page={currentPage}
            onChange={(newPage) => {
              setCurrentPage(newPage);
              getSearchResults(newPage);
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
