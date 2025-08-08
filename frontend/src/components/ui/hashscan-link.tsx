import { Link } from "@chakra-ui/react";

type HashscanLinkProps = {
  value: string
  path: string
};

const HashscanLink = (props: HashscanLinkProps) => {
  const { value, path } = props;

  return (
    <Link 
      target="_blank"
      _hover={{
        textDecoration: 'underline',
      }}
      _focus={{ boxShadow: 'none', outline: 'none' }}
      href={process.env.NEXT_PUBLIC_HASHSCAN_URL + path}
    >
      {value}
    </Link>
  );
};

export default HashscanLink;