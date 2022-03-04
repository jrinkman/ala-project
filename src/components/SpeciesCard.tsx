import { Card, Group, Image, Text, Title } from '@mantine/core';

interface SpeciesCardProps {
  species: Species;
}

function SpeciesCard({ species }: SpeciesCardProps) {
  // console.log(species);
  return (
    <Card padding="md" shadow="sm" radius="md">
      <Card.Section>
        <Group>
          <Image src={species.imageUrl} height={100} width={80} />
          <Group>
            <Title order={3}>{species.name}</Title>
          </Group>
        </Group>
      </Card.Section>
    </Card>
  );
}

export default SpeciesCard;
