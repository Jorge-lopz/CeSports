// DATABASE
const DB = "rvseyuxbfpmolvyxfspq";

// TABLES
const DB_TEAMS: string = "teams";
const DB_MATCHES: string = "matches";
const DB_VOTES: string = "votes";

// COLUMNS

// Teams
const DB_TEAM_ID: string = "id";
const DB_TEAM_CLASS: string = "class";
const DB_TEAM_TEAM: string = "team";
const DB_TEAM_GROUP: string = "group";
// Matches
const DB_MATCH_ID: string = "id";
const DB_MATCH_GROUP: string = "group";
const DB_MATCH_PHASE: string = "phase";
const DB_MATCH_INDEX: string = "index";
const DB_MATCH_TEAM1: string = "team1";
const DB_MATCH_TEAM2: string = "team2";
const DB_MATCH_WINNER: string = "winner";
const DB_MATCH_STATE: string = "state";
// Votes
const DB_VOTES_ID: string = "id";
const DB_VOTES_MATCH: string = "match";
const DB_VOTES_TEAM: string = "team";

// CONSTS
const group: Array<string> = ["A", "B"];
const states: Array<string> = ["set", "started", "finished"];
