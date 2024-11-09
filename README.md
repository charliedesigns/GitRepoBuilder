# GitHub Repo Builder
### Fully automated way of making of github repositories from a template

## How it works
This uses the Github RestAPI to generate a repository off of a master template repo.
Inside of the GitRepoBuilder you can:
- Configure react components with custom colours, text etc
- Live previews

## Why
This can be used to speed up repetitive builds that need the same components, but need to be customized

## How to run
`npm install`
- edit the files:
  /app/api/updateConfig/route.ts
  /app/page.tsx
  to have your Github fine token with correct permissions
`npm run dev`
