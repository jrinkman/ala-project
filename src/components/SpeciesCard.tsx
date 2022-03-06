import { Card, Box, Group, Image, Skeleton, Text } from '@mantine/core';

interface SpeciesCardProps {
  species: Species | null;
}

function SpeciesCard({ species }: SpeciesCardProps) {
  // console.log(species);
  return (
    <Card shadow="sm" radius="md">
      <Card.Section>
        <Group align="flex-start">
          <Skeleton height={110} width={70} visible={!species}>
            <Image
              src={species?.thumbnailUrl}
              height={110}
              width={70}
              withPlaceholder
            />
          </Skeleton>
          <Box style={{ paddingTop: 10, maxWidth: 190 }}>
            <Skeleton visible={!species}>
              {/* Create a string of random length to add varation to the style */}
              <Text weight={700}>
                {species ? species.scientificName : 'Scientific Name'}
              </Text>
            </Skeleton>
            <Skeleton visible={!species} style={{ marginTop: 5 }}>
              {/* Create a string of random length to add varation to the style */}
              <Text size="sm" color="dimmed">
                {species && species.commonName
                  ? species.commonName.split(', ')[0]
                  : 'No Common Name'}
              </Text>
            </Skeleton>
          </Box>
        </Group>
      </Card.Section>
    </Card>
  );
}

export default SpeciesCard;
