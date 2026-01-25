// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Auto-load GitHub repos (public)
const GITHUB_USERNAME = "Inscode";

async function loadGithubRepos() {
  const el = document.getElementById('githubRepos');
  if (!el) return;

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
    if (!res.ok) throw new Error("GitHub API error");
    const repos = await res.json();

    el.innerHTML = repos
      .filter(r => !r.fork)
      .slice(0, 6)
      .map(r => {
        const desc = (r.description || "No description")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

        const lang = r.language ? ` · ${r.language}` : "";
        const updated = new Date(r.updated_at).toLocaleDateString();

        return `
          <li>
            <a href="${r.html_url}" target="_blank" rel="noreferrer" class="wrap-link">
              ${r.name}
            </a>
            <div class="muted2 tiny">${lang} · Updated ${updated}</div>
            <div class="muted" style="margin-top:4px;">${desc}</div>
          </li>
        `;
      })
      .join("");
  } catch (e) {
    el.innerHTML = `<li>Unable to load GitHub repos right now.</li>`;
  }
}

loadGithubRepos();
