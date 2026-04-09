export type Ue = {
  id: number;
  code: string;
  name: string;
};

export type Groupe = {
  id: number;
  name: string;
  year: string;
};

export type Sae = {
  id: number;
  title: string;
  description: string;
  domain: string;
  semester: string;
  startDate: string;
  endDate: string;
  imageUrl?: string | null;
  ue?: Ue | null;
};

export type SaeProjectResponse = {
  id: number;
  sae: Sae;
  groupe: Groupe;
  imageUrls?: string[];
  humanResources?: string;
  websiteUrl?: string | null;
  sourceCodeUrl?: string | null;
  studentGrades: number[];
  average: number;
  min: number;
  max: number;
};

export type SaeProject = SaeProjectResponse;
