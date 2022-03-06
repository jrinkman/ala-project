import { Center, Title, Text } from '@mantine/core';

interface MessageProps {
  title: string;
  content: string;
}

function Message({ title, content }: MessageProps) {
  return (
    <Center
      style={{
        flexGrow: 1,
        flexDirection: 'column',
        paddingBottom: 60,
      }}
    >
      <Title style={{ textAlign: 'center' }}>{title}</Title>
      <Text style={{ marginTop: 15 }}>{content}</Text>
    </Center>
  );
}

export default Message;
