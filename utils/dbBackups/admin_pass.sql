create table
  public.admin_pass (
    password text not null,
    constraint admin_pass_pkey primary key (password)
  ) tablespace pg_default;