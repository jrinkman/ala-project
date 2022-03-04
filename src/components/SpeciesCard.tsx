import { Card, Text } from '@mantine/core';

interface SpeciesCardProps {
  species: Species;
}

function SpeciesCard({ species }: SpeciesCardProps) {
  return (
    <Card padding="md" shadow="sm" radius="md">
      <Card.Section>
        <Text>{species.name}</Text>
      </Card.Section>
    </Card>
  );
}

export default SpeciesCard;
