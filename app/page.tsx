"use client";
import React from "react";
import { Octokit } from "@octokit/rest";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { Switch } from "@nextui-org/switch";
import { useRouter } from "next/navigation";

interface RepoData {
  id: number;
  name: string;
  is_template?: boolean;
}

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export default function Home() {
  const router = useRouter();
  const [isSelected, setIsSelected] = React.useState(true);
  const [repoName, setRepoName] = React.useState("");
  const [repoData, setRepoData] = React.useState<RepoData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function forkRepo(repoName: string, isPrivate: boolean) {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Forking repo with name:", repoName);
      
      await octokit.request(
        "POST /repos/{template_owner}/{template_repo}/generate",
        {
          template_owner: "charliedesigns",
          template_repo: "APIforktest",
          owner: "charliedesigns",
          name: repoName,
          include_all_branches: false,
          private: isPrivate,
          headers: {
            "X-GitHub-Api-Version": "2022-11-28",
          },
        }
      );
      router.push(`/test?repoName=${repoName}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error("Error creating repo:", err);
    } finally {
      setIsLoading(false);
    }
  }

  async function listAllTemplateRepos() {
    try {
      setIsLoading(true);
      setError(null);
      const response = await octokit.request("GET /user/repos", {
        visibility: "all",
        affiliation: "owner",
        headers: {
          Accept: "application/vnd.github.baptiste-preview+json",
        },
      });

      const templateRepos = response.data.filter((repo: RepoData) => repo.is_template === true);
      setRepoData(templateRepos);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error("Error listing repos:", err);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex justify-center flex-col items-center">
      <div className="flex flex-col gap-5 justify-center items-center w-1/4">
        <h1 className="text-xl">Welcome to GitHub repo gen</h1>
        
        <Input
          className="w-2/3"
          placeholder="Enter repo name"
          value={repoName}
          onChange={(e) => {
            console.log("Setting repo name:", e.target.value);
            setRepoName(e.target.value);
          }}
          disabled={isLoading}
        />

        <Switch 
          isSelected={isSelected} 
          onValueChange={setIsSelected}
          disabled={isLoading}
        >
          Public Repo?
        </Switch>

        <Button 
          onClick={() => forkRepo(repoName, isSelected)}
          disabled={isLoading || !repoName}
        >
          {isLoading ? "Creating..." : "Generate Github repo"}
        </Button>

        <p>repo is set to {isSelected ? "public" : "private"}</p>
        <p>repo name will be "{repoName}"</p>

        <Button 
          onClick={listAllTemplateRepos}
          disabled={isLoading}
        >
          List Template Repos
        </Button>

        {error && <p className="text-red-500">{error}</p>}

        <ul>
          {repoData.map((repo) => (
            <li key={repo.id}>{repo.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}