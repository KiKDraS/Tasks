export type SignUpFormValues = {
  user: string;
  password: string;
  confirmPassword: string;
};

export type SignUpFormErrors = {
  user?: string;
  password?: string;
  confirmPassword?: string;
  form?: string;
};
