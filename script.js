// Smooth scroll (for when nav links are visible)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    const target = document.querySelector(id);
    if(!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Auto-load GitHub repos (public)
const GITHUB_USERNAME = "Inscode";

// Hide this repo from the auto list (portfolio itself)
const HIDE_REPOS = new Set([
  "Inscode.github.io",
  "inscode.github.io",
]);

async function loadGithubRepos() {
  const el = document.getElementById('githubRepos');
  if (!el) return;

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=12`);
    if (!res.ok) throw new Error("GitHub API error");
    const repos = await res.json();

    const cleaned = repos
      .filter(r => !r.fork)
      .filter(r => !HIDE_REPOS.has(r.name))
      .filter(r => !(r.name || "").toLowerCase().endsWith(".github.io"))
      .slice(0, 6);

    if (!cleaned.length) {
      el.innerHTML = `<li>No repositories to show right now.</li>`;
      return;
    }

    el.innerHTML = cleaned.map(r => {
      const descRaw = (r.description || "No description");
      const desc = descRaw.replace(/</g, "&lt;").replace(/>/g, "&gt;");
      const lang = r.language ? ` · ${r.language}` : "";
      const updated = r.updated_at ? new Date(r.updated_at).toLocaleDateString() : "";

      return `
        <li style="padding: 10px 0;">
          <a href="${r.html_url}" target="_blank" rel="noreferrer"
             style="color:#a5f3fc;text-decoration:none;font-weight:800;display:inline-block;max-width:100%;">
            ${r.name}
          </a>
          <div style="color: var(--muted2); font-size: 12px; margin-top: 4px;">
            ${lang}${updated ? ` · Updated ${updated}` : ""}
          </div>
          <div style="color: var(--muted); font-size: 13px; margin-top: 6px; line-height: 1.7; overflow-wrap:anywhere;">
            ${desc}
          </div>
        </li>
      `;
    }).join("");

  } catch (e) {
    el.innerHTML = `<li>Unable to load GitHub repos right now. Please try again later.</li>`;
  }
}

loadGithubRepos();
