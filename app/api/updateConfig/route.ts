import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

export async function POST(req: Request) {
  const { banner, repoName, owner } = await req.json();

  console.log("Received repoName:", repoName);
  console.log("Received owner:", owner);

  console.log("GITHUB_TOKEN:", process.env.GITHUB_TOKEN);

  if (!banner) {
    return NextResponse.json({ error: "no banner config" }, { status: 400 });
  }

  try {
    const updatedConfig = `
      export const templateConfig = {
        banner: ${JSON.stringify(banner, null, 2)}
      };
    `;

    let sha;
    try {
      const { data: fileData } = await octokit.rest.repos.getContent({
        owner,
        repo: repoName,
        path: "src/config/banner.ts",
      });
      sha = Array.isArray(fileData) ? fileData[0].sha : fileData.sha;
    } catch (error) {
      if ((error as any).status !== 404) {
        throw error;
      }
      console.log("File does not exist, will create a new one.");
    }

    const updatedContent = Buffer.from(updatedConfig).toString("base64");

    const params: any = {
      owner,
      repo: repoName,
      path: "src/config/banner.ts",
      message: "Updated banner config",
      content: updatedContent,
      committer: {
        name: 'Charlie Fox',
        email: 'charlie.fox2030@gmail.com'
      },
      author: {
        name: 'Charlie Fox',
        email: 'charlie.fox2030@gmail.com'
      },
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    };

    if (sha) {
      params.sha = sha;
    }

    console.log("Request parameters:", params);

    const response = await octokit.rest.repos.createOrUpdateFileContents(params);
    console.log("GitHub API response:", response);

    return NextResponse.json(
      { message: "Config updated successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating file in GitHub:", error);
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 });
  }
}
