export type Certification = {
  _id: string;
  name: string;
  description: string;
  category: string;
  status: "Active" | "Inactive";
  verificationSupport: boolean;
  certificateId?: string;
  companyName?: string;
  scope?: string;
  publishDate?: string;
  expiryDate?: string;
  certificateState?: "Active" | "Expired" | "Suspended";
  createdAt?: string;
};

export type Organization = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  imageUrl2?: string;
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

export type AdminUser = {
  _id: string;
  username: string;
  name: string;
  email: string;
  createdAt?: string;
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
