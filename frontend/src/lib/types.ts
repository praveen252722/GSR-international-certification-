export type Certification = {
  _id: string;
  name: string;
  description: string;
  category: string;
  status: "Active" | "Inactive";
  verificationSupport: boolean;
  createdAt?: string;
};

export type Organization = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  certificationDate: string;
  status: "Certified" | "Active";
  createdAt?: string;
  updatedAt?: string;
};

export type Inquiry = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  source: "Contact" | "Apply";
  status: "New" | "In Progress" | "Closed";
  createdAt: string;
};

export type Settings = {
  _id?: string;
  companyName: string;
  contactEmail: string;
  contactNumber: string;
  address: string;
  whatsapp?: string;
  domain?: string;
  mapUrl?: string;
  socialLinks: {
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    x?: string;
  };
};
