import { Card, Group, Image, Skeleton, Title } from '@mantine/core';

interface SpeciesCardProps {
  species: Species | null;
}

function SpeciesCard({ species }: SpeciesCardProps) {
  // console.log(species);
  return (
    <Card shadow="sm" radius="md">
      <Card.Section>
        <Group align="flex-start">
          <Skeleton height={90} width={70} visible={!species}>
            <Image
              src={species?.thumbnailUrl}
              height={90}
              width={70}
              withPlaceholder
            />
          </Skeleton>
          <Group style={{ paddingTop: 10, paddingBottom: 10 }}>
            <Skeleton visible={!species}>
              {/* Create a string of random length to add varation to the style */}
              <Title order={4}>{species ? species.name : 'Testing Name'}</Title>
            </Skeleton>
          </Group>
        </Group>
      </Card.Section>
    </Card>
  );
}

export default SpeciesCard;
