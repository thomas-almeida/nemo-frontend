import 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      _id: string;
      username: string;
      email: string;
      sessionId: string;
      id?: string;
      name?: string | null;
      image?: string | null;
    };
  }

  interface User {
    _id: string;
    username: string;
    email: string;
    sessionId: string;
    id?: string;
    name?: string | null;
    image?: string | null;
  }
}
