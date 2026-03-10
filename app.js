(() => {
  const LS_KEY = "colinea_outil_v1";
  const GATE_KEY = "colinea_app_unlocked";
  /** Code d'accès à l'espace interne — change-le ici si tu veux */
  const APP_CODE = "Colin1703";

  const gateEl = document.getElementById("app-gate");
  const wrapEl = document.getElementById("app-wrap");
  const gateForm = document.getElementById("app-gate-form");
  const gateInput = document.getElementById("app-gate-code");
  const gateError = document.getElementById("app-gate-error");

  function isUnlocked() {
    return sessionStorage.getItem(GATE_KEY) === "1";
  }

  function setUnlocked() {
    sessionStorage.setItem(GATE_KEY, "1");
  }

  function showApp() {
    if (gateEl) gateEl.setAttribute("aria-hidden", "true");
    if (wrapEl) {
      wrapEl.removeAttribute("hidden");
    }
  }

  function showGate() {
    if (gateEl) gateEl.removeAttribute("aria-hidden");
    if (wrapEl) wrapEl.setAttribute("hidden", "");
    if (gateInput) gateInput.value = "";
    if (gateError) {
      gateError.hidden = true;
      gateError.textContent = "";
    }
  }

  function checkGate() {
    if (isUnlocked()) {
      showApp();
      return true;
    }
    showGate();
    if (gateForm && gateInput) {
      gateForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const value = (gateInput.value || "").trim();
        if (value === APP_CODE) {
          setUnlocked();
          showApp();
          if (typeof start === "function") start();
        } else {
          if (gateError) {
            gateError.textContent = "Code incorrect.";
            gateError.hidden = false;
          }
          gateInput.select();
        }
      });
    }
    return false;
  }

  const SIMULATORS = [
    {
      id: "profil-investisseur",
      title: "Profil investisseur complet",
      desc: "Évaluer les préférences de placement financier, y compris les critères ESG.",
    },
    {
      id: "assurance-vie",
      title: "Simulateur assurance vie",
      desc: "Étudier la valorisation d’un contrat d’assurance vie et l’impact des rachats ou de la sortie en rentes.",
    },
    {
      id: "immobilier",
      title: "Simulateur Immobilier",
      desc: "Simuler un investissement immobilier en location nue ou meublée.",
    },
    {
      id: "per",
      title: "Simulateur PER",
      desc: "Estimer l’incidence de la mise en place d’un PER et de sa sortie.",
    },
    {
      id: "ir-diagnostic",
      title: "Diagnostic Impôt sur le revenu",
      desc: "Calculer rapidement l’impôt sur le revenu et tester des pistes d’optimisation.",
    },
    {
      id: "credit",
      title: "Simulateur Crédit",
      desc: "Effectuer une simulation de prêt (mensualités, durée, coût total).",
    },
    {
      id: "statut-dirigeant",
      title: "Diagnostic statut et rémunération du dirigeant",
      desc: "Comparer les effets d’un changement de statut et l’arbitrage salaire / dividendes.",
    },
    {
      id: "retraite",
      title: "Diagnostic Retraite",
      desc: "Évaluer rapidement le montant estimatif de la pension de retraite.",
    },
    {
      id: "sci",
      title: "Simulateur SCI",
      desc: "Comparer une SCI à l’IR et à l’IS pour un bien locatif.",
    },
    {
      id: "succession",
      title: "Diagnostic Succession",
      desc: "Estimer la transmission et les droits de succession à partir d’une situation simplifiée.",
    },
    {
      id: "ifi",
      title: "Diagnostic Impôt sur la fortune immobilière",
      desc: "Effectuer un calcul indicatif de l’IFI et analyser des leviers d’optimisation.",
    },
    {
      id: "plus-values-immo",
      title: "Fiscalité des plus-values immobilières",
      desc: "Calculer la plus-value immobilière et l’impôt correspondant.",
    },
    {
      id: "capacite-acquisition",
      title: "Simulateur Capacité d’Acquisition",
      desc: "Estimer la capacité d’emprunt et le budget d’acquisition immobilier.",
    },
    {
      id: "rente-viagere",
      title: "Simulateur Rente Viagère",
      desc: "Estimer la rente ou le capital à constituer pour une rente souhaitée.",
    },
    {
      id: "epargne",
      title: "Simulateur Epargne",
      desc: "Projeter rapidement l’évolution d’une épargne dans le temps.",
    },
    {
      id: "frais-notaire",
      title: "Simulateur Frais de notaire",
      desc: "Estimer les frais de notaire liés à l’acquisition d’un bien immobilier.",
    },
  ];

  const PROFIL_INVESTISSEUR_STEPS = [
    { id: "intro", title: "Introduction" },
    { id: "connaissance", title: "Connaissance et Expérience" },
    { id: "risque", title: "Profil de risque" },
    { id: "preferences", title: "Préférences de placement" },
    { id: "pertes", title: "Capacité à subir des pertes" },
    { id: "extra", title: "Profil investisseur extra-financier" },
    { id: "recap", title: "Récapitulatif" },
  ];

  function uid(prefix) {
    return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function formatDate(iso) {
    try {
      return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(iso));
    } catch {
      return iso?.slice?.(0, 10) ?? "";
    }
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function loadState() {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      return {
        clients: [],
        projects: [],
        lastOpened: nowIso(),
      };
    }
    try {
      const parsed = JSON.parse(raw);
      return {
        clients: Array.isArray(parsed.clients) ? parsed.clients : [],
        projects: Array.isArray(parsed.projects) ? parsed.projects : [],
        lastOpened: parsed.lastOpened || nowIso(),
      };
    } catch {
      return { clients: [], projects: [], lastOpened: nowIso() };
    }
  }

  function saveState(state) {
    state.lastOpened = nowIso();
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  }

  function setTitle(title, subtitle) {
    const t = document.getElementById("app-title");
    const s = document.getElementById("app-subtitle");
    if (t) t.textContent = title;
    if (s) s.textContent = subtitle ?? "";
  }

  function setActions(html) {
    const el = document.getElementById("app-actions");
    if (el) el.innerHTML = html ?? "";
  }

  function render(html) {
    const root = document.getElementById("app-root");
    if (root) root.innerHTML = html;
  }

  function route() {
    const hash = window.location.hash || "#/dashboard";
    const [path, query] = hash.replace(/^#\//, "").split("?");
    const params = new URLSearchParams(query || "");

    if (path === "" || path === "dashboard") return viewDashboard();
    if (path === "clients") return viewClients(params);
    if (path === "client") return viewClient(params);
    if (path === "simulations") return viewSimulations(params);
    if (path === "simulateur") return viewSimulator(params);

    window.location.hash = "#/dashboard";
  }

  function viewDashboard() {
    const state = loadState();
    setTitle("Tableau de bord", "Vue d’ensemble de vos dossiers et simulations.");
    setActions(`
      <a class="btn btn-primary" href="#/clients?new=1">Nouveau client</a>
      <a class="btn btn-outline" href="#/simulations">Ouvrir une simulation</a>
    `);

    const recentClients = [...state.clients]
      .sort((a, b) => (b.updatedAt || b.createdAt || "").localeCompare(a.updatedAt || a.createdAt || ""))
      .slice(0, 5);

    const recentProjects = [...state.projects]
      .sort((a, b) => (b.updatedAt || b.createdAt || "").localeCompare(a.updatedAt || a.createdAt || ""))
      .slice(0, 5);

    render(`
      <section class="app-grid-3">
        <div class="app-card kpi">
          <div class="kpi-label">Clients</div>
          <div class="kpi-value">${state.clients.length}</div>
          <div class="kpi-hint">enregistrés sur cet appareil</div>
        </div>
        <div class="app-card kpi">
          <div class="kpi-label">Projets</div>
          <div class="kpi-value">${state.projects.length}</div>
          <div class="kpi-hint">liés à vos clients</div>
        </div>
        <div class="app-card kpi">
          <div class="kpi-label">Simulateurs</div>
          <div class="kpi-value">${SIMULATORS.length}</div>
          <div class="kpi-hint">coquilles prêtes à compléter</div>
        </div>
      </section>

      <section class="app-grid-2">
        <div class="app-card">
          <h2 class="section-title" style="margin-bottom: 1rem;">Clients récents</h2>
          ${recentClients.length ? `
            <table class="app-table">
              <thead>
                <tr><th>Nom</th><th>Dernière modif.</th><th></th></tr>
              </thead>
              <tbody>
                ${recentClients.map(c => `
                  <tr>
                    <td>${escapeHtml((c.prenom ? c.prenom + " " : "") + (c.nom || ""))}</td>
                    <td><span class="pill">${escapeHtml(formatDate(c.updatedAt || c.createdAt))}</span></td>
                    <td><a class="service-link" href="#/client?id=${encodeURIComponent(c.id)}">Ouvrir →</a></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          ` : `
            <p class="about-text">Aucun client pour le moment. Crée ton premier dossier.</p>
            <a class="btn btn-primary" href="#/clients?new=1">Créer un client</a>
          `}
        </div>

        <div class="app-card">
          <h2 class="section-title" style="margin-bottom: 1rem;">Projets récents</h2>
          ${recentProjects.length ? `
            <table class="app-table">
              <thead>
                <tr><th>Projet</th><th>Client</th><th></th></tr>
              </thead>
              <tbody>
                ${recentProjects.map(p => {
                  const c = state.clients.find(x => x.id === p.clientId);
                  const clientName = c ? ((c.prenom ? c.prenom + " " : "") + (c.nom || "")) : "Client supprimé";
                  return `
                    <tr>
                      <td>${escapeHtml(p.title || "Projet")}</td>
                      <td><span class="pill">${escapeHtml(clientName)}</span></td>
                      <td><a class="service-link" href="#/client?id=${encodeURIComponent(p.clientId)}">Voir →</a></td>
                    </tr>
                  `;
                }).join("")}
              </tbody>
            </table>
          ` : `
            <p class="about-text">Ajoute des projets à tes clients (ex. achat immobilier, retraite, transmission…).</p>
          `}
        </div>
      </section>
    `);
  }

  function viewClients(params) {
    const state = loadState();
    const q = (params.get("q") || "").trim().toLowerCase();
    const showNew = params.get("new") === "1";

    setTitle("Clients", "Créer, rechercher et ouvrir des dossiers clients.");
    setActions(`
      <a class="btn btn-primary" href="#/clients?new=1">Nouveau client</a>
    `);

    const filtered = state.clients
      .filter(c => {
        if (!q) return true;
        const hay = `${c.prenom || ""} ${c.nom || ""} ${c.email || ""} ${c.tel || ""}`.toLowerCase();
        return hay.includes(q);
      })
      .sort((a, b) => (b.updatedAt || b.createdAt || "").localeCompare(a.updatedAt || a.createdAt || ""));

    render(`
      <section class="app-card">
        <div class="app-grid-2" style="align-items: end;">
          <div class="form-group">
            <label for="search" class="contact-label">Rechercher</label>
            <input id="search" type="text" placeholder="Nom, email, téléphone…" value="${escapeHtml(params.get("q") || "")}" />
          </div>
          <div class="app-form-actions" style="justify-content: flex-start;">
            <button class="btn btn-outline" id="export-json" type="button">Exporter (JSON)</button>
            <label class="btn btn-outline" for="import-json" style="cursor: pointer;">Importer (JSON)</label>
            <input id="import-json" type="file" accept="application/json" hidden />
          </div>
        </div>
      </section>

      ${showNew ? `
        <section class="app-card" id="new-client-card">
          <h2 class="section-title" style="margin-bottom: 1rem;">Nouveau client</h2>
          <form class="app-form" id="new-client-form">
            <div class="form-group">
              <label for="prenom">Prénom</label>
              <input id="prenom" name="prenom" type="text" autocomplete="given-name" />
            </div>
            <div class="form-group">
              <label for="nom">Nom</label>
              <input id="nom" name="nom" type="text" required autocomplete="family-name" />
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input id="email" name="email" type="email" autocomplete="email" />
            </div>
            <div class="form-group">
              <label for="tel">Téléphone</label>
              <input id="tel" name="tel" type="tel" autocomplete="tel" />
            </div>
            <div class="form-group span-2">
              <label for="notes">Notes</label>
              <textarea id="notes" name="notes" rows="4" placeholder="Contexte, objectifs, points d’attention…"></textarea>
            </div>
            <div class="app-form-actions span-2">
              <a class="btn btn-outline" href="#/clients">Annuler</a>
              <button class="btn btn-primary" type="submit">Créer</button>
            </div>
          </form>
        </section>
      ` : ""}

      <section class="app-card">
        <h2 class="section-title" style="margin-bottom: 1rem;">Liste des clients</h2>
        ${filtered.length ? `
          <table class="app-table">
            <thead>
              <tr><th>Client</th><th>Contact</th><th>Dernière modif.</th><th></th></tr>
            </thead>
            <tbody>
              ${filtered.map(c => `
                <tr>
                  <td>
                    <div style="font-weight: 600;">${escapeHtml((c.prenom ? c.prenom + " " : "") + (c.nom || ""))}</div>
                    ${c.notes ? `<div style="color: var(--color-text-muted); font-size: 0.9rem; margin-top: 4px;">${escapeHtml(String(c.notes).slice(0, 120))}${String(c.notes).length > 120 ? "…" : ""}</div>` : ""}
                  </td>
                  <td>
                    ${c.email ? `<div><a class="service-link" href="mailto:${escapeHtml(c.email)}">${escapeHtml(c.email)}</a></div>` : `<div class="kpi-hint">—</div>`}
                    ${c.tel ? `<div><a class="service-link" href="tel:${escapeHtml(c.tel)}">${escapeHtml(c.tel)}</a></div>` : ""}
                  </td>
                  <td><span class="pill">${escapeHtml(formatDate(c.updatedAt || c.createdAt))}</span></td>
                  <td><a class="btn btn-outline" href="#/client?id=${encodeURIComponent(c.id)}">Ouvrir</a></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        ` : `<p class="about-text">Aucun client ne correspond à ta recherche.</p>`}
      </section>
    `);

    const search = document.getElementById("search");
    if (search) {
      search.addEventListener("input", () => {
        const next = new URLSearchParams();
        const v = search.value.trim();
        if (v) next.set("q", v);
        window.location.hash = `#/clients${next.toString() ? "?" + next.toString() : ""}`;
      });
    }

    const newForm = document.getElementById("new-client-form");
    if (newForm) {
      newForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(newForm);
        const client = {
          id: uid("c"),
          prenom: (fd.get("prenom") || "").toString().trim(),
          nom: (fd.get("nom") || "").toString().trim(),
          email: (fd.get("email") || "").toString().trim(),
          tel: (fd.get("tel") || "").toString().trim(),
          notes: (fd.get("notes") || "").toString().trim(),
          createdAt: nowIso(),
          updatedAt: nowIso(),
        };
        const s = loadState();
        s.clients.unshift(client);
        saveState(s);
        window.location.hash = `#/client?id=${encodeURIComponent(client.id)}`;
      });
    }

    const exportBtn = document.getElementById("export-json");
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const s = loadState();
        const payload = JSON.stringify(s, null, 2);
        const blob = new Blob([payload], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `colinea-outil-export-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      });
    }

    const importInput = document.getElementById("import-json");
    if (importInput) {
      importInput.addEventListener("change", async () => {
        const file = importInput.files?.[0];
        if (!file) return;
        try {
          const text = await file.text();
          const parsed = JSON.parse(text);
          const next = {
            clients: Array.isArray(parsed.clients) ? parsed.clients : [],
            projects: Array.isArray(parsed.projects) ? parsed.projects : [],
            lastOpened: nowIso(),
          };
          saveState(next);
          window.location.hash = "#/clients";
        } catch {
          alert("Import impossible : fichier JSON invalide.");
        } finally {
          importInput.value = "";
        }
      });
    }
  }

  function viewClient(params) {
    const id = params.get("id");
    const state = loadState();
    const client = state.clients.find(c => c.id === id);
    if (!client) {
      setTitle("Client introuvable", "Ce dossier n’existe pas (ou a été supprimé).");
      setActions(`<a class="btn btn-outline" href="#/clients">Retour</a>`);
      render(`<section class="app-card"><p class="about-text">Impossible d’ouvrir ce client.</p></section>`);
      return;
    }

    const projects = state.projects
      .filter(p => p.clientId === client.id)
      .sort((a, b) => (b.updatedAt || b.createdAt || "").localeCompare(a.updatedAt || a.createdAt || ""));

    const fullName = (client.prenom ? client.prenom + " " : "") + (client.nom || "");
    setTitle(fullName || "Client", "Fiche client, projets et accès aux simulations.");
    setActions(`
      <a class="btn btn-outline" href="#/clients">Retour</a>
      <a class="btn btn-primary" href="#/simulations?clientId=${encodeURIComponent(client.id)}">Simuler</a>
    `);

    render(`
      <section class="app-card">
        <h2 class="section-title" style="margin-bottom: 1rem;">Fiche client</h2>
        <form class="app-form" id="client-form">
          <div class="form-group">
            <label for="prenom">Prénom</label>
            <input id="prenom" name="prenom" type="text" value="${escapeHtml(client.prenom || "")}" />
          </div>
          <div class="form-group">
            <label for="nom">Nom</label>
            <input id="nom" name="nom" type="text" required value="${escapeHtml(client.nom || "")}" />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" name="email" type="email" value="${escapeHtml(client.email || "")}" />
          </div>
          <div class="form-group">
            <label for="tel">Téléphone</label>
            <input id="tel" name="tel" type="tel" value="${escapeHtml(client.tel || "")}" />
          </div>
          <div class="form-group span-2">
            <label for="notes">Notes</label>
            <textarea id="notes" name="notes" rows="4">${escapeHtml(client.notes || "")}</textarea>
          </div>
          <div class="app-form-actions span-2">
            <button class="btn btn-outline" id="delete-client" type="button">Supprimer</button>
            <button class="btn btn-primary" type="submit">Enregistrer</button>
          </div>
        </form>
      </section>

      <section class="app-card">
        <div style="display:flex; align-items: baseline; justify-content: space-between; gap: 1rem; flex-wrap: wrap;">
          <h2 class="section-title" style="margin-bottom: 0.5rem;">Projets</h2>
          <button class="btn btn-outline" id="new-project" type="button">Nouveau projet</button>
        </div>

        ${projects.length ? `
          <table class="app-table">
            <thead>
              <tr><th>Titre</th><th>Type</th><th>Statut</th><th>Mise à jour</th><th></th></tr>
            </thead>
            <tbody>
              ${projects.map(p => `
                <tr>
                  <td style="font-weight: 600;">${escapeHtml(p.title || "Projet")}</td>
                  <td><span class="pill">${escapeHtml(p.type || "—")}</span></td>
                  <td><span class="pill pill-accent">${escapeHtml(p.status || "En cours")}</span></td>
                  <td>${escapeHtml(formatDate(p.updatedAt || p.createdAt))}</td>
                  <td><button class="btn btn-outline" type="button" data-edit-project="${escapeHtml(p.id)}">Modifier</button></td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        ` : `<p class="about-text">Aucun projet pour le moment.</p>`}

        <div id="project-editor"></div>
      </section>
    `);

    const form = document.getElementById("client-form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const s = loadState();
        const c = s.clients.find(x => x.id === client.id);
        if (!c) return;
        c.prenom = (fd.get("prenom") || "").toString().trim();
        c.nom = (fd.get("nom") || "").toString().trim();
        c.email = (fd.get("email") || "").toString().trim();
        c.tel = (fd.get("tel") || "").toString().trim();
        c.notes = (fd.get("notes") || "").toString().trim();
        c.updatedAt = nowIso();
        saveState(s);
        route();
      });
    }

    const deleteBtn = document.getElementById("delete-client");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        const ok = confirm("Supprimer ce client et ses projets ? Cette action est irréversible sur cet appareil.");
        if (!ok) return;
        const s = loadState();
        s.clients = s.clients.filter(x => x.id !== client.id);
        s.projects = s.projects.filter(p => p.clientId !== client.id);
        saveState(s);
        window.location.hash = "#/clients";
      });
    }

    function renderProjectEditor(project) {
      const host = document.getElementById("project-editor");
      if (!host) return;
      const isNew = !project;
      const p = project || { id: uid("p"), clientId: client.id, title: "", type: "", status: "En cours", notes: "", createdAt: nowIso(), updatedAt: nowIso() };
      host.innerHTML = `
        <div class="app-card" style="margin-top: var(--space-lg);">
          <h3 class="about-subtitle" style="margin-top: 0;">${isNew ? "Nouveau projet" : "Modifier le projet"}</h3>
          <form class="app-form" id="project-form">
            <div class="form-group span-2">
              <label for="title">Titre</label>
              <input id="title" name="title" type="text" required value="${escapeHtml(p.title)}" placeholder="Ex. Achat résidence principale, investissement locatif, préparation retraite…" />
            </div>
            <div class="form-group">
              <label for="type">Type</label>
              <input id="type" name="type" type="text" value="${escapeHtml(p.type)}" placeholder="Ex. Immobilier, Retraite, Fiscalité…" />
            </div>
            <div class="form-group">
              <label for="status">Statut</label>
              <input id="status" name="status" type="text" value="${escapeHtml(p.status)}" placeholder="Ex. En cours, À revoir, Finalisé…" />
            </div>
            <div class="form-group span-2">
              <label for="notes">Notes</label>
              <textarea id="notes" name="notes" rows="4" placeholder="Hypothèses, décisions, prochaines étapes…">${escapeHtml(p.notes || "")}</textarea>
            </div>
            <div class="app-form-actions span-2">
              ${!isNew ? `<button class="btn btn-outline" id="delete-project" type="button">Supprimer</button>` : `<span></span>`}
              <button class="btn btn-primary" type="submit">${isNew ? "Créer" : "Enregistrer"}</button>
            </div>
          </form>
        </div>
      `;

      const pf = document.getElementById("project-form");
      if (pf) {
        pf.addEventListener("submit", (e) => {
          e.preventDefault();
          const fd = new FormData(pf);
          const s = loadState();
          const existing = s.projects.find(x => x.id === p.id);
          const next = existing || p;
          next.clientId = client.id;
          next.title = (fd.get("title") || "").toString().trim();
          next.type = (fd.get("type") || "").toString().trim();
          next.status = (fd.get("status") || "").toString().trim() || "En cours";
          next.notes = (fd.get("notes") || "").toString().trim();
          next.updatedAt = nowIso();
          if (!existing) s.projects.unshift(next);
          saveState(s);
          route();
        });
      }

      const dp = document.getElementById("delete-project");
      if (dp) {
        dp.addEventListener("click", () => {
          const ok = confirm("Supprimer ce projet ?");
          if (!ok) return;
          const s = loadState();
          s.projects = s.projects.filter(x => x.id !== p.id);
          saveState(s);
          route();
        });
      }
    }

    const newProjectBtn = document.getElementById("new-project");
    if (newProjectBtn) newProjectBtn.addEventListener("click", () => renderProjectEditor(null));

    document.querySelectorAll("[data-edit-project]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const pid = btn.getAttribute("data-edit-project");
        const p = loadState().projects.find(x => x.id === pid);
        if (p) renderProjectEditor(p);
      });
    });
  }

  function viewSimulations(params) {
    const clientId = params.get("clientId") || "";
    const state = loadState();
    const client = clientId ? state.clients.find(c => c.id === clientId) : null;

    setTitle("Simulations", "Choisir un simulateur et lancer un scénario.");
    setActions(client ? `
      <span class="pill pill-accent">Client : ${escapeHtml((client.prenom ? client.prenom + " " : "") + (client.nom || ""))}</span>
      <a class="btn btn-outline" href="#/client?id=${encodeURIComponent(client.id)}">Fiche client</a>
    ` : `
      <a class="btn btn-outline" href="#/clients">Choisir un client</a>
    `);

    render(`
      <section class="app-card">
        <div class="app-tabs" aria-label="Filtres simulateurs">
          <button class="app-tab" type="button" data-filter="all" aria-current="page">Tous</button>
          <button class="app-tab" type="button" data-filter="patrimoine">Patrimoine</button>
          <button class="app-tab" type="button" data-filter="retraite">Retraite</button>
          <button class="app-tab" type="button" data-filter="fiscalite">Fiscalité</button>
          <button class="app-tab" type="button" data-filter="transmission">Transmission</button>
        </div>
      </section>

      <section class="services">
        <div class="services-grid">
          ${SIMULATORS.map((s, idx) => `
            <article class="service-card">
              <div class="service-icon" aria-hidden="true">${String(idx + 1).padStart(2, "0")}</div>
              <h3>${escapeHtml(s.title)}</h3>
              <p>${escapeHtml(s.desc)}</p>
              <a class="service-link" href="#/simulateur?id=${encodeURIComponent(s.id)}${client ? `&clientId=${encodeURIComponent(client.id)}` : ""}">Ouvrir →</a>
            </article>
          `).join("")}
        </div>
      </section>
    `);

    document.querySelectorAll(".app-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".app-tab").forEach(b => b.setAttribute("aria-current", "false"));
        btn.setAttribute("aria-current", "page");
      });
    });
  }

  function viewProfilInvestisseur(params, sim, client) {
    const hashBase = "#/simulateur?id=profil-investisseur" + (client ? "&clientId=" + encodeURIComponent(client.id) : "");
    window.__profilInvestisseurState = window.__profilInvestisseurState || { stepIndex: 0, answers: {} };
    const st = window.__profilInvestisseurState;
    if (st.reset) {
      st.stepIndex = 0;
      st.answers = {};
      st.reset = false;
    }
    const stepIndex = Math.min(st.stepIndex, PROFIL_INVESTISSEUR_STEPS.length - 1);
    const step = PROFIL_INVESTISSEUR_STEPS[stepIndex];
    const a = st.answers;

    setTitle(sim.title, sim.desc);
    setActions(
      '<a class="btn btn-outline" href="#/simulations' + (client ? "?clientId=" + encodeURIComponent(client.id) : "") + '">Retour</a>' +
      (client ? '<span class="pill pill-accent">Client : ' + escapeHtml((client.prenom ? client.prenom + " " : "") + (client.nom || "")) + "</span>" : "")
    );

    const sidebarHtml =
      '<nav class="profil-wizard-sidebar" aria-label="Étapes du profil investisseur">' +
      PROFIL_INVESTISSEUR_STEPS.map(function (s, i) {
        return (
          '<div class="profil-wizard-step ' +
          (i < stepIndex ? "is-done" : "") +
          (i === stepIndex ? " is-active" : "") +
          '" data-step="' +
          i +
          '"><span class="profil-wizard-step-num">' +
          (i < stepIndex ? "✓" : i + 1) +
          "</span><span>" +
          escapeHtml(s.title) +
          "</span></div>"
        );
      }).join("") +
      "</nav>";

    var contentHtml = "";
    if (step.id === "intro") {
      contentHtml =
        "<h2>Profil investisseur</h2>" +
        '<p class="step-desc">Ce questionnaire permet d\'évaluer vos préférences de placement, votre connaissance des marchés financiers et votre sensibilité au risque. Répondez de manière spontanée ; il n\'y a pas de « bonne » réponse.</p>' +
        "<p class=\"step-desc\">Vous pourrez à tout moment revenir en arrière ou fermer sans enregistrer.</p>";
    } else if (step.id === "connaissance") {
      var monOps = (a.connaissance && a.connaissance.monetaire_ops) || "";
      var oblOps = (a.connaissance && a.connaissance.obligataire_ops) || "";
      contentHtml =
        "<h2>Profil investisseur</h2>" +
        '<p class="step-desc"><strong>Connaissance et Expérience</strong> — Pour chaque type de produit, indiquez votre niveau de connaissance et le nombre d\'opérations réalisées au cours des 12 derniers mois.</p>' +
        '<form id="profil-step-form">' +
        '<div class="app-card" style="margin-bottom: var(--space-lg);">' +
        '<h3 class="about-subtitle" style="margin-top: 0;">Produits monétaires</h3>' +
        "<p class=\"about-text\" style=\"margin-bottom: 0.75rem;\">(Fonds monétaires, OPC monétaires)</p>" +
        '<p style="font-size: 0.9rem; margin-bottom: 0.5rem;">Affirmeriez-vous plutôt :</p>' +
        '<div class="profil-choice-group" style="margin-bottom: 1rem;">' +
        '<label><input type="radio" name="profil_connaissance_monetaire_affirm" value="1" /> Les fonds monétaires sont composés principalement de TCN, bons du Trésor et obligations à court terme.</label>' +
        '<label><input type="radio" name="profil_connaissance_monetaire_affirm" value="2" /> L\'investissement sur des OPC monétaires est parfaitement adapté pour un investissement de long terme.</label>' +
        '<label><input type="radio" name="profil_connaissance_monetaire_affirm" value="3" /> En investissant sur des fonds monétaires, le capital est garanti.</label>' +
        '<label><input type="radio" name="profil_connaissance_monetaire_affirm" value="4" /> Je ne sais pas.</label>' +
        "</div>" +
        '<p style="font-size: 0.9rem; margin-bottom: 0.5rem;">Opérations réalisées au cours des 12 derniers mois :</p>' +
        '<div class="profil-ops-group" data-name="profil_connaissance_monetaire_ops">' +
        '<button type="button" class="profil-ops-btn' + (monOps === "0" ? " is-selected" : "") + '" data-value="0">Aucune</button>' +
        '<button type="button" class="profil-ops-btn' + (monOps === "1-5" ? " is-selected" : "") + '" data-value="1-5">De 1 à 5</button>' +
        '<button type="button" class="profil-ops-btn' + (monOps === "5+" ? " is-selected" : "") + '" data-value="5+">Plus de 5</button>' +
        "</div></div>" +
        '<div class="app-card">' +
        "<h3 class=\"about-subtitle\" style=\"margin-top: 0;\">Produits obligataires</h3>" +
        "<p class=\"about-text\" style=\"margin-bottom: 0.75rem;\">(Obligations, fonds obligataires, titres de créance...)</p>" +
        '<p style="font-size: 0.9rem; margin-bottom: 0.5rem;">Affirmeriez-vous plutôt :</p>' +
        '<div class="profil-choice-group" style="margin-bottom: 1rem;">' +
        '<label><input type="radio" name="profil_connaissance_obligataire_affirm" value="1" /> Les obligations sont des dettes pour lesquelles le défaut de remboursement est inexistant.</label>' +
        '<label><input type="radio" name="profil_connaissance_obligataire_affirm" value="2" /> Pour une obligation, un taux élevé indique un risque faible.</label>' +
        '<label><input type="radio" name="profil_connaissance_obligataire_affirm" value="3" /> La performance d\'un fonds obligataire varie avec les évolutions des taux d\'intérêt.</label>' +
        '<label><input type="radio" name="profil_connaissance_obligataire_affirm" value="4" /> Je ne sais pas.</label>' +
        "</div>" +
        '<p style="font-size: 0.9rem; margin-bottom: 0.5rem;">Opérations réalisées au cours des 12 derniers mois :</p>' +
        '<div class="profil-ops-group" data-name="profil_connaissance_obligataire_ops">' +
        '<button type="button" class="profil-ops-btn' + (oblOps === "0" ? " is-selected" : "") + '" data-value="0">Aucune</button>' +
        '<button type="button" class="profil-ops-btn' + (oblOps === "1-5" ? " is-selected" : "") + '" data-value="1-5">De 1 à 5</button>' +
        '<button type="button" class="profil-ops-btn' + (oblOps === "5+" ? " is-selected" : "") + '" data-value="5+">Plus de 5</button>' +
        "</div></div></form>";
    } else if (step.id === "risque") {
      var v = (a.risque && a.risque.placements) || "";
      contentHtml =
        "<h2>Profil investisseur</h2>" +
        '<p class="step-desc"><strong>Profil de risque</strong></p>' +
        "<p class=\"step-desc\">En matière de placements financiers, pensez-vous plutôt que :</p>" +
        '<form id="profil-step-form">' +
        '<div class="profil-choice-group">' +
        '<label><input type="radio" name="profil_risque_placements" value="1"' + (v === "1" ? " checked" : "") + " /> Il ne faut pas prendre de risque ; on doit placer toutes ses économies dans des placements sûrs.</label>" +
        '<label><input type="radio" name="profil_risque_placements" value="2"' + (v === "2" ? " checked" : "") + " /> On peut placer une petite partie de ses économies sur des placements risqués.</label>" +
        '<label><input type="radio" name="profil_risque_placements" value="3"' + (v === "3" ? " checked" : "") + " /> On peut placer une part importante de ses économies sur des actifs risqués si le gain en vaut la peine.</label>" +
        '<label><input type="radio" name="profil_risque_placements" value="4"' + (v === "4" ? " checked" : "") + " /> On doit placer l'essentiel de ses économies sur des actifs risqués dès qu'il y a des chances de gains très importants.</label>" +
        "</div></form>";
    } else if (step.id === "preferences") {
      var checked = (a.preferences && a.preferences.ne_conviennent) || [];
      var opts = [
        { id: "preservation", label: "Préservation du capital", desc: "Stratégie prudente pour préserver le capital et éviter les pertes. Ne permet pas d'investir sur le marché action." },
        { id: "croissance", label: "Croissance du capital", desc: "Objectif d'augmenter le capital avec un risque de perte plus élevé. Permet de s'exposer au marché des actions." },
        { id: "revenus", label: "Revenus", desc: "Stratégie qui privilégie les placements procurant des revenus (dividendes, coupons...)." },
        { id: "hedging", label: "Hedging (couverture de risque)", desc: "Stratégie de couverture adaptée aux investisseurs expérimentés." },
        { id: "levier", label: "Exposition à effet de levier", desc: "Prendre plus de positions que son investissement réel. Gains potentiellement élevés mais risque de perdre plus que la somme investie." },
        { id: "aucun", label: "Aucun, tous les objectifs proposés peuvent me convenir", desc: "" },
      ];
      contentHtml =
        "<h2>Profil investisseur</h2>" +
        '<p class="step-desc"><strong>Préférences de placement</strong> — Parmi les objectifs suivants, cochez ceux qui <strong>ne vous conviennent pas</strong> (plusieurs réponses possibles).</p>' +
        '<form id="profil-step-form"><div class="profil-choice-group">' +
        opts
          .map(function (o) {
            return (
              '<label><input type="checkbox" name="profil_preferences_ne_conviennent" value="' +
              escapeHtml(o.id) +
              '"' +
              (checked.indexOf(o.id) !== -1 ? " checked" : "") +
              " /><span><strong>" +
              escapeHtml(o.label) +
              "</strong>" +
              (o.desc ? " — " + escapeHtml(o.desc) : "") +
              "</span></label>"
            );
          })
          .join("") +
        "</div></form>";
    } else if (step.id === "pertes") {
      var emprunt = (a.pertes && a.pertes.emprunt) || "";
      var charges = (a.pertes && a.pertes.charges) || "";
      contentHtml =
        "<h2>Profil investisseur</h2>" +
        '<p class="step-desc"><strong>Capacité à subir des pertes</strong></p>' +
        '<form id="profil-step-form">' +
        '<div class="form-group" style="margin-bottom: var(--space-lg);">' +
        '<label style="display:block; margin-bottom: 0.5rem; font-weight: 600;">Quel montant d\'emprunt remboursez-vous chaque mois ?</label>' +
        '<div class="profil-choice-group">' +
        '<label><input type="radio" name="profil_pertes_emprunt" value="0"' + (emprunt === "0" ? " checked" : "") + " /> Je ne suis pas endetté(e)</label>" +
        '<label><input type="radio" name="profil_pertes_emprunt" value="<500"' + (emprunt === "<500" ? " checked" : "") + " /> Moins de 500 €</label>" +
        '<label><input type="radio" name="profil_pertes_emprunt" value="500-1000"' + (emprunt === "500-1000" ? " checked" : "") + " /> Entre 500 et 1 000 €</label>" +
        '<label><input type="radio" name="profil_pertes_emprunt" value="1000-2000"' + (emprunt === "1000-2000" ? " checked" : "") + " /> Entre 1 000 € et 2 000 €</label>" +
        '<label><input type="radio" name="profil_pertes_emprunt" value=">2000"' + (emprunt === ">2000" ? " checked" : "") + " /> Plus de 2 000 €</label>" +
        "</div></div>" +
        '<div class="form-group">' +
        '<label style="display:block; margin-bottom: 0.5rem; font-weight: 600;">Quel est le montant de vos autres charges fixes mensuelles ?</label>' +
        '<div class="profil-choice-group">' +
        '<label><input type="radio" name="profil_pertes_charges" value="<1000"' + (charges === "<1000" ? " checked" : "") + " /> Moins de 1 000 €</label>" +
        '<label><input type="radio" name="profil_pertes_charges" value="1000-2000"' + (charges === "1000-2000" ? " checked" : "") + " /> Entre 1 000 € et 2 000 €</label>" +
        '<label><input type="radio" name="profil_pertes_charges" value="2000-5000"' + (charges === "2000-5000" ? " checked" : "") + " /> Entre 2 000 € et 5 000 €</label>" +
        '<label><input type="radio" name="profil_pertes_charges" value=">5000"' + (charges === ">5000" ? " checked" : "") + " /> Plus de 5 000 €</label>" +
        "</div></div></form>";
    } else if (step.id === "extra") {
      var durabilite = (a.extra && a.extra.durabilite) || "";
      var envPercent = (a.extra && a.extra.env_percent) || "";
      contentHtml =
        "<h2>Profil investisseur</h2>" +
        '<p class="step-desc"><strong>Profil investisseur extra-financier</strong> — Critères ESG et durabilité.</p>' +
        '<form id="profil-step-form">' +
        '<div class="form-group" style="margin-bottom: var(--space-lg);">' +
        '<label style="display:block; margin-bottom: 0.5rem; font-weight: 600;">Souhaitez-vous préciser vos préférences en matière de durabilité ?</label>' +
        '<div class="profil-ops-group" data-name="profil_extra_durabilite">' +
        '<button type="button" class="profil-ops-btn' + (durabilite === "oui" ? " is-selected" : "") + '" data-value="oui">Oui</button>' +
        '<button type="button" class="profil-ops-btn' + (durabilite === "non" ? " is-selected" : "") + '" data-value="non">Non</button>' +
        "</div></div>" +
        (durabilite === "oui"
          ? '<div class="form-group"><label style="display:block; margin-bottom: 0.5rem; font-weight: 600;">Quelle part de votre investissement souhaitez-vous consacrer à des activités environnementales ?</label>' +
            '<div class="profil-choice-group">' +
            '<label><input type="radio" name="profil_extra_env_percent" value="5"' + (envPercent === "5" ? " checked" : "") + " /> Au moins 5 %</label>" +
            '<label><input type="radio" name="profil_extra_env_percent" value="25"' + (envPercent === "25" ? " checked" : "") + " /> Au moins 25 %</label>" +
            '<label><input type="radio" name="profil_extra_env_percent" value="50"' + (envPercent === "50" ? " checked" : "") + " /> Au moins 50 %</label>" +
            "</div></div>"
          : "") +
        "</form>";
    } else {
      contentHtml =
        "<h2>Profil investisseur</h2>" +
        '<p class="step-desc"><strong>Récapitulatif</strong> — Voici la synthèse de vos réponses.</p>' +
        '<div class="profil-recap-block"><h3>Connaissance et expérience</h3><p>Produits monétaires : opérations ' + ((a.connaissance && a.connaissance.monetaire_ops) || "—") + " ; Produits obligataires : opérations " + ((a.connaissance && a.connaissance.obligataire_ops) || "—") + ".</p></div>" +
        '<div class="profil-recap-block"><h3>Profil de risque</h3><p>' + ((a.risque && a.risque.placements) ? "Réponse enregistrée." : "—") + "</p></div>" +
        '<div class="profil-recap-block"><h3>Préférences de placement</h3><p>Objectifs ne convenant pas : ' + ((a.preferences && a.preferences.ne_conviennent && a.preferences.ne_conviennent.length) ? a.preferences.ne_conviennent.join(", ") : "Aucun.") + ".</p></div>" +
        '<div class="profil-recap-block"><h3>Capacité à subir des pertes</h3><p>Emprunt mensuel : ' + ((a.pertes && a.pertes.emprunt) || "—") + " ; Charges fixes : " + ((a.pertes && a.pertes.charges) || "—") + ".</p></div>" +
        '<div class="profil-recap-block"><h3>Extra-financier</h3><p>Durabilité : ' + ((a.extra && a.extra.durabilite) || "—") + ((a.extra && a.extra.durabilite === "oui" && a.extra.env_percent) ? " ; Part environnement : " + a.extra.env_percent + " %" : "") + ".</p></div>" +
        '<p class="about-text" style="margin-top: 1rem;">Vous pouvez imprimer cette page (Ctrl+P / Cmd+P) pour conserver un document PDF.</p>';
    }

    var isFirst = stepIndex === 0;
    var isLast = stepIndex === PROFIL_INVESTISSEUR_STEPS.length - 1;
    var actionsHtml =
      '<div class="profil-wizard-actions">' +
      '<div>' +
      (!isFirst ? '<button type="button" class="btn btn-outline" id="profil-prev">← Revenir à l\'étape précédente</button>' : "") +
      "</div>" +
      '<div style="display: flex; gap: 0.5rem;">' +
      '<button type="button" class="btn btn-outline" id="profil-close">Fermer</button>' +
      (isLast ? '<button type="button" class="btn btn-primary" id="profil-pdf">Générer le PDF</button>' : '<button type="button" class="btn btn-primary" id="profil-next">Étape suivante →</button>') +
      "</div></div>";

    render('<section class="profil-wizard">' + sidebarHtml + '<div class="profil-wizard-content">' + contentHtml + actionsHtml + "</div></section>");

    function collectProfilAnswers() {
      var form = document.getElementById("profil-step-form");
      var out = {};
      if (step.id === "connaissance" && form) {
        var fd = new FormData(form);
        var monOpsEl = document.querySelector("[data-name='profil_connaissance_monetaire_ops'] .profil-ops-btn.is-selected");
        var oblOpsEl = document.querySelector("[data-name='profil_connaissance_obligataire_ops'] .profil-ops-btn.is-selected");
        out.connaissance = {
          monetaire_affirm: fd.get("profil_connaissance_monetaire_affirm") || "",
          monetaire_ops: monOpsEl ? monOpsEl.getAttribute("data-value") : "",
          obligataire_affirm: fd.get("profil_connaissance_obligataire_affirm") || "",
          obligataire_ops: oblOpsEl ? oblOpsEl.getAttribute("data-value") : "",
        };
      } else if (step.id === "risque" && form) {
        var r = form.querySelector('input[name="profil_risque_placements"]:checked');
        out.risque = { placements: r ? r.value : "" };
      } else if (step.id === "preferences" && form) {
        var checkboxes = form.querySelectorAll('input[name="profil_preferences_ne_conviennent"]:checked');
        out.preferences = { ne_conviennent: checkboxes ? Array.prototype.map.call(checkboxes, function (el) { return el.value; }) : [] };
      } else if (step.id === "pertes" && form) {
        var e = form.querySelector('input[name="profil_pertes_emprunt"]:checked');
        var c = form.querySelector('input[name="profil_pertes_charges"]:checked');
        out.pertes = { emprunt: e ? e.value : "", charges: c ? c.value : "" };
      } else if (step.id === "extra" && form) {
        var dEl = document.querySelector("[data-name='profil_extra_durabilite'] .profil-ops-btn.is-selected");
        var envEl = form.querySelector('input[name="profil_extra_env_percent"]:checked');
        out.extra = { durabilite: dEl ? dEl.getAttribute("data-value") : "", env_percent: envEl ? envEl.value : "" };
      }
      return out;
    }

    document.querySelectorAll(".profil-ops-group button").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var group = this.closest("[data-name]");
        if (group) group.querySelectorAll(".profil-ops-btn").forEach(function (b) { b.classList.remove("is-selected"); });
        this.classList.add("is-selected");
      });
    });

    var prevBtn = document.getElementById("profil-prev");
    if (prevBtn) prevBtn.addEventListener("click", function () { st.stepIndex = Math.max(0, stepIndex - 1); window.location.hash = hashBase; route(); });
    document.getElementById("profil-close").addEventListener("click", function () {
      st.reset = true;
      window.location.hash = "#/simulations" + (client ? "?clientId=" + encodeURIComponent(client.id) : "");
      route();
    });
    var nextBtn = document.getElementById("profil-next");
    if (nextBtn)
      nextBtn.addEventListener("click", function () {
        var collected = collectProfilAnswers();
        Object.keys(collected).forEach(function (k) {
          st.answers[k] = st.answers[k] || {};
          Object.keys(collected[k]).forEach(function (key) { st.answers[k][key] = collected[k][key]; });
        });
        st.stepIndex = stepIndex + 1;
        window.location.hash = hashBase;
        route();
      });
    var pdfBtn = document.getElementById("profil-pdf");
    if (pdfBtn) pdfBtn.addEventListener("click", function () { window.print(); });
  }

  function viewSimulator(params) {
    const id = params.get("id");
    const clientId = params.get("clientId") || "";
    const state = loadState();
    const sim = SIMULATORS.find(s => s.id === id);
    const client = clientId ? state.clients.find(c => c.id === clientId) : null;

    if (!sim) {
      setTitle("Simulateur introuvable", "Ce simulateur n’existe pas.");
      setActions(`<a class="btn btn-outline" href="#/simulations">Retour</a>`);
      render(`<section class="app-card"><p class="about-text">Impossible d’ouvrir ce simulateur.</p></section>`);
      return;
    }

    if (id === "profil-investisseur") {
      viewProfilInvestisseur(params, sim, client);
      return;
    }

    setTitle(sim.title, sim.desc);
    setActions(`
      <a class="btn btn-outline" href="#/simulations${client ? `?clientId=${encodeURIComponent(client.id)}` : ""}">Retour</a>
      ${client ? `<span class="pill pill-accent">Client : ${escapeHtml((client.prenom ? client.prenom + " " : "") + (client.nom || ""))}</span>` : ""}
    `);

    render(`
      <section class="app-grid-2">
        <div class="app-card">
          <h2 class="section-title" style="margin-bottom: 1rem;">Entrées</h2>
          <form class="app-form" id="sim-form">
            <div class="form-group">
              <label for="horizon">Horizon (années)</label>
              <input id="horizon" name="horizon" type="number" min="0" step="1" value="10" />
            </div>
            <div class="form-group">
              <label for="taux">Rendement annuel (%)</label>
              <input id="taux" name="taux" type="number" step="0.1" value="4" />
            </div>
            <div class="form-group span-2">
              <label for="mensuel">Versement mensuel (€)</label>
              <input id="mensuel" name="mensuel" type="number" step="10" value="300" />
            </div>
            <div class="app-form-actions span-2">
              <button class="btn btn-primary" type="submit">Calculer (démo)</button>
            </div>
          </form>
          <p class="about-text" style="margin-top: 1rem;">
            Cette page est une <strong>base</strong> : on remplacera ces entrées par celles de ton simulateur (IFI, retraite, immo, transmission…),
            avec des formules publiques et une présentation propre.
          </p>
        </div>

        <div class="app-card">
          <h2 class="section-title" style="margin-bottom: 1rem;">Résultat</h2>
          <div id="sim-result" class="kpi">
            <div class="kpi-label">Estimation</div>
            <div class="kpi-value">—</div>
            <div class="kpi-hint">Calcul démonstratif (capitalisation mensuelle simplifiée).</div>
          </div>
        </div>
      </section>
    `);

    const form = document.getElementById("sim-form");
    const result = document.getElementById("sim-result");
    if (form && result) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const horizon = Number(fd.get("horizon") || 0);
        const taux = Number(fd.get("taux") || 0) / 100;
        const mensuel = Number(fd.get("mensuel") || 0);
        const months = Math.max(0, Math.round(horizon * 12));
        const r = taux / 12;
        const fv = r === 0 ? mensuel * months : mensuel * ((Math.pow(1 + r, months) - 1) / r);
        const formatted = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(fv);
        result.querySelector(".kpi-value").textContent = formatted;
      });
    }
  }

  function setupNav() {
    const navToggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".nav");
    if (navToggle && nav) {
      navToggle.addEventListener("click", () => {
        const isOpen = navToggle.getAttribute("aria-expanded") === "true";
        navToggle.setAttribute("aria-expanded", String(!isOpen));
        nav.classList.toggle("is-open");
        document.body.style.overflow = isOpen ? "" : "hidden";
      });
      nav.querySelectorAll("a[data-nav]").forEach((link) => {
        link.addEventListener("click", () => {
          navToggle.setAttribute("aria-expanded", "false");
          nav.classList.remove("is-open");
          document.body.style.overflow = "";
        });
      });
    }
  }

  function start() {
    setupNav();
    window.addEventListener("hashchange", route);
    if (!window.location.hash) window.location.hash = "#/dashboard";
    route();
  }

  function init() {
    if (checkGate()) start();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

