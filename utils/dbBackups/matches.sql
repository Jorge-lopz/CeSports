create table
  public.matches (
    id bigint generated by default as identity not null,
    "group" public.group not null,
    round smallint not null,
    index integer not null,
    team1 text null,
    team2 text null,
    winner smallint null,
    state public.state null,
    t1_goals integer null default 0,
    t2_goals integer null default 0,
    constraint matches_pkey primary key (id),
    constraint matches_id_key unique (id),
    constraint matches_team1_fkey foreign key (team1) references teams (name),
    constraint matches_team2_fkey foreign key (team2) references teams (name)
  ) tablespace pg_default;