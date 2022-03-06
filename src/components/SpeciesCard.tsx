import { Card, Box, Group, Image, Skeleton, Text } from '@mantine/core';

interface SpeciesCardProps {
  species: Species | null;
}

function SpeciesCard({ species }: SpeciesCardProps) {
  return (
    <Card shadow="sm" radius="md">
      <Card.Section>
        <Group align="flex-start">
          <Skeleton height={120} width={80} visible={!species}>
            <Image
              src={species?.thumbnailUrl}
              height={120}
              width={80}
              withPlaceholder
            />
          </Skeleton>
          <Box style={{ paddingTop: 10, maxWidth: 190 }}>
            <Skeleton visible={!species}>
              <Text weight={700} style={{ maxHeight: 50 }}>
                {species ? species.scientificName : 'Scientific Name'}
              </Text>
            </Skeleton>
            <Skeleton visible={!species} style={{ marginTop: 5 }}>
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
