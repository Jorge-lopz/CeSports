// DATABASE
const DB = "rvseyuxbfpmolvyxfspq";
const DB_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2c2V5dXhiZnBtb2x2eXhmc3BxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM5MTI0NjcsImV4cCI6MjA0OTQ4ODQ2N30.nEnVsu7epQDuBuAi5-ByYEckOzJoKPV1yYbETLxBxZk";
// TABLES
const DB_TEAMS = "teams";
const DB_MATCHES = "matches";
const DB_VOTES = "votes";
// COLUMNS
// Teams
const DB_TEAM_ID = "id";
const DB_TEAM_CLASS = "class";
const DB_TEAM_TEAM = "team";
const DB_TEAM_GROUP = "group";
// Matches
const DB_MATCH_ID = "id";
const DB_MATCH_GROUP = "group";
const DB_MATCH_ROUND = "round";
const DB_MATCH_INDEX = "index";
const DB_MATCH_TEAM1 = "team1";
const DB_MATCH_TEAM2 = "team2";
const DB_MATCH_WINNER = "winner";
const DB_MATCH_STATE = "state";
// Votes
const DB_VOTES_ID = "id";
const DB_VOTES_MATCH = "match";
const DB_VOTES_TEAM = "team";
// Consts
const GROUP = ["A", "B"];
const STATES = ["set", "started", "finished"];
