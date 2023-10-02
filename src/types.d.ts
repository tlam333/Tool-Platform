type Tool = {
  id: string;
  name: string;
  brand: string;
  description: string;
  rent: number;
  duration: RentDuration;
  deposit: number;
  images: string[];
  category: ToolCategory;
  owner: string;
  location: string;
  status: ToolStatus;
  createdAt: string;
  updatedAt: string;
};

type ToolsPage = {
  tools: Tool[];
  pageIndex: number;
  total: number;
  nextPage: string;
  message: string;
};

type Booking = {
  id: string;
  toolId: string;
  ownerId: string;
  renterId: string;
  status: string;
  startDate: string;
  endDate: string;
  comments: string;
  createdAt: string;
  updatedAt: string;
};
type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  suburb: string;
  postCode: string;
  state: string;
  country: string;
  createdAt: string;
  updatedAt: string;
};

type FAQ = {
  id: string;
  question: string;
  answer: string;
  type: string;
};
