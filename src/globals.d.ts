interface NavLinks {
  name: string;
  link: string;
}

interface TimelineProps {
  title: string;
  body: string;
  icon?: React.Node | null;
  time?: string;
  done: Boolean;
}

interface AboutT {
  img?: React.Node | null;
  title: string;
  description: string;
  span: string;
}

interface FAQ {
  title: string;
  content: string;
}

interface SocialLinks {
  link: string;
  name: string;
  icon: React.ReactElement;
}

interface Token {
  id: string;
  name: string;
  address: string | undefined;
  image: string;
  balance?: number | string;
  price?: number | string;
  decimals?: number;
}

interface Pool {
  poolId: number;
  tokenA: string;
  tokenB: string;
  price: number;
}
