create table
  public.teams (
    id bigint generated by default as identity not null,
    class text null,
    name text not null,
    "group" public.group null,
    constraint teams_pkey primary key (id),
    constraint teams_class_key unique (class),
    constraint teams_id_key unique (id),
    constraint teams_team_key unique (name),
    constraint teams_class_fkey foreign key (class) references classes (initials) on update cascade on delete set null
  ) tablespace pg_default;