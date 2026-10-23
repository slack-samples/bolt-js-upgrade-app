# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## What This Is

A Bolt for JavaScript app that checks whether a Slack app uses the latest permission scopes and prompts users to reinstall when an upgrade is needed.

## Slack Plugin

To install the Slack plugin for your coding agent, follow [Claude Code, Codex, Cursor, and Other Coding Agents](./README.md#claude-code-codex-cursor-and-other-coding-agents) in the README.

## Before you finish

Run `npm run lint`. CI runs the same on every PR.

## Code Style

- Kebab-case filenames
- No code comments. Make the code explain itself with clear names, tests, or types. Put the reason for a change in the PR description.
