"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.states = exports.group = exports.DB_VOTES_TEAM = exports.DB_VOTES_MATCH = exports.DB_VOTES_ID = exports.DB_MATCH_STATE = exports.DB_MATCH_WINNER = exports.DB_MATCH_TEAM2 = exports.DB_MATCH_TEAM1 = exports.DB_MATCH_INDEX = exports.DB_MATCH_PHASE = exports.DB_MATCH_GROUP = exports.DB_MATCH_ID = exports.DB_TEAM_GROUP = exports.DB_TEAM_TEAM = exports.DB_TEAM_CLASS = exports.DB_TEAM_ID = exports.DB_VOTES = exports.DB_MATCHES = exports.DB_TEAMS = exports.DB = void 0;
// DATABASE
exports.DB = "rvseyuxbfpmolvyxfspq";
// TABLES
exports.DB_TEAMS = "teams";
exports.DB_MATCHES = "matches";
exports.DB_VOTES = "votes";
// COLUMNS
// Teams
exports.DB_TEAM_ID = "id";
exports.DB_TEAM_CLASS = "class";
exports.DB_TEAM_TEAM = "team";
exports.DB_TEAM_GROUP = "group";
// Matches
exports.DB_MATCH_ID = "id";
exports.DB_MATCH_GROUP = "group";
exports.DB_MATCH_PHASE = "phase";
exports.DB_MATCH_INDEX = "index";
exports.DB_MATCH_TEAM1 = "team1";
exports.DB_MATCH_TEAM2 = "team2";
exports.DB_MATCH_WINNER = "winner";
exports.DB_MATCH_STATE = "state";
// Votes
exports.DB_VOTES_ID = "id";
exports.DB_VOTES_MATCH = "match";
exports.DB_VOTES_TEAM = "team";
// CONSTS
exports.group = ["A", "B"];
exports.states = ["set", "started", "finished"];
