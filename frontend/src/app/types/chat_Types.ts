interface Source {
  title: string;
  href: string;
  content: string;
  source?: string;
}

interface Resource {
  Name?: string;
  Address?: string;
  Availability?: string;
  Contacts?: string;
  Links?: string;
}
export interface Message {
  id?: string;
  chatResponse?: string;
  options?: string[] | null;
  isUser?: boolean;
  userResponse?: string | null;
  sources?: Source[];
  resources?: Resource[];
}
