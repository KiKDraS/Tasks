export type SignInFormValues = {
  user: string;
  password: string;
};

export type SignInFormErrors = {
  user?: string;
  password?: string;
  form?: string;
};
