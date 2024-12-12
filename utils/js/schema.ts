// DATABASE
export const DB: string = "rvseyuxbfpmolvyxfspq";

// TABLES
export const DB_TEAMS: string = "teams";
export const DB_MATCHES: string = "matches";
export const DB_VOTES: string = "votes";

// COLUMNS

// Teams
export const DB_TEAM_ID: string = "id";
export const DB_TEAM_CLASS: string = "class";
export const DB_TEAM_TEAM: string = "team";
export const DB_TEAM_GROUP: string = "group";
// Matches
export const DB_MATCH_ID: string = "id";
export const DB_MATCH_GROUP: string = "group";
export const DB_MATCH_PHASE: string = "phase";
export const DB_MATCH_INDEX: string = "index";
export const DB_MATCH_TEAM1: string = "team1";
export const DB_MATCH_TEAM2: string = "team2";
export const DB_MATCH_WINNER: string = "winner";
export const DB_MATCH_STATE: string = "state";
// Votes
export const DB_VOTES_ID: string = "id";
export const DB_VOTES_MATCH: string = "match";
export const DB_VOTES_TEAM: string = "team";

// CONSTS
export const group: Array<string> = ["A", "B"];
export const states: Array<string> = ["set", "started", "finished"];
