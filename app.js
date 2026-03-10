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
      var realisePour = (a.intro && a.intro.realise_pour) || "";
      var representePar = (a.intro && a.intro.represente_par) || "";
      var comprendObjectif = (a.intro && a.intro.comprend_objectif) ? " checked" : "";
      contentHtml =
        "<h2>Profil investisseur</h2>" +
        '<p class="step-desc">Ce questionnaire permet à chaque individu de déterminer son profil d\'investisseur, pour le guider vers des solutions de placement adaptées, grâce à :</p>' +
        '<ul class="step-list"><li>l\'évaluation du niveau de connaissance et d\'expérience des marchés financiers ;</li>' +
        '<li>la mesure de la sensibilité au risque qui joue un rôle déterminant dans l\'analyse des comportements d\'épargne et de gestion de capital ;</li>' +
        '<li>l\'identification des préférences de placement pour de futurs projets.</li></ul>' +
        '<p class="step-desc">La fourniture d\'informations complètes et sincères est une condition nécessaire pour bénéficier d\'un service de qualité.</p>' +
        '<form id="profil-step-form">' +
        '<div class="form-group"><label for="profil-intro-realise">Réalisé pour</label><input type="text" id="profil-intro-realise" name="profil_intro_realise_pour" value="' + escapeHtml(realisePour) + '" class="form-control" /></div>' +
        '<div class="form-group"><label for="profil-intro-represente">Représenté par <span class="info-icon" title="Information">ⓘ</span></label><input type="text" id="profil-intro-represente" name="profil_intro_represente_par" value="' + escapeHtml(representePar) + '" class="form-control" /></div>' +
        '<div class="form-group"><label class="checkbox-label"><input type="checkbox" name="profil_intro_comprend_objectif"' + comprendObjectif + ' /> Je comprends l\'objectif de ce questionnaire</label></div>' +
        "</form>";
    } else if (step.id === "connaissance") {
      var c = a.connaissance || {};
      var produitsDetenus = c.produits_detenus || [];
      var modesGestion = c.modes_gestion || [];
      var avOui = c.assurance_vie_oui === "oui";
      var peaOui = c.pea_oui === "oui";
      var erOui = c.epargne_retraite_oui === "oui";
      var fondsEurosOui = c.fonds_euros_oui === "oui";
      var monChecked = c.monetaire_checked ? " checked" : "";
      var oblChecked = c.obligataire_checked ? " checked" : "";
      var actChecked = c.actions_checked ? " checked" : "";
      var fondsEurosChecked = c.fonds_euros_checked ? " checked" : "";
      var monOps = c.monetaire_ops || "";
      var oblOps = c.obligataire_ops || "";
      var actOps = c.actions_ops || "";
      var feOps = c.fonds_euros_ops || "";
      var defisc = c.defiscalisation || "";
      var levier = c.levier || "";
      var montantTx = c.montant_transaction || "";
      var pertesSubies = c.pertes_subies || "";
      function isChecked(arr, id) { return arr.indexOf(id) !== -1; }
      contentHtml =
        "<h2>Profil investisseur</h2>" +
        '<p class="step-desc"><strong>Connaissance & expérience</strong></p>' +
        '<form id="profil-step-form">' +
        '<div class="app-card" style="margin-bottom: var(--space-lg);">' +
        '<p style="font-weight: 600; margin-bottom: 0.75rem;">Parmi les produits suivants, cochez ceux que vous détenez ou avez détenus au cours des 12 derniers mois :</p>' +
        '<div class="profil-choice-group">' +
        '<label><input type="checkbox" name="profil_c_produits" value="livrets"' + (isChecked(produitsDetenus, "livrets") ? " checked" : "") + ' /> Des comptes et livrets d\'épargne (livret A, LDDS, PEL, CEL...).</label>' +
        '<label><input type="checkbox" name="profil_c_produits" value="assurance_vie"' + (isChecked(produitsDetenus, "assurance_vie") ? " checked" : "") + ' /> Un ou plusieurs contrats d\'assurance-vie ou de capitalisation.</label>' +
        '<label><input type="checkbox" name="profil_c_produits" value="comptes_titres"' + (isChecked(produitsDetenus, "comptes_titres") ? " checked" : "") + ' /> Un ou plusieurs comptes titres (compte titres ordinaire, PEA...).</label>' +
        '<label><input type="checkbox" name="profil_c_produits" value="epargne_retraite"' + (isChecked(produitsDetenus, "epargne_retraite") ? " checked" : "") + ' /> Un ou plusieurs produits d\'Épargne Retraite (PER, PERP, Madelin, Perco, Contrat Prefon...).</label>' +
        '<label><input type="checkbox" name="profil_c_produits" value="epargne_salariale"' + (isChecked(produitsDetenus, "epargne_salariale") ? " checked" : "") + ' /> Un ou plusieurs produits d\'Épargne Salariale (PEE, PEI).</label>' +
        '<label><input type="checkbox" name="profil_c_produits" value="fip_scpi"' + (isChecked(produitsDetenus, "fip_scpi") ? " checked" : "") + ' /> Un ou plusieurs produits de capital investissement (FIP, FCPI...) ou des SCPI.</label>' +
        '<label><input type="checkbox" name="profil_c_produits" value="ne_pas_repondre"' + (isChecked(produitsDetenus, "ne_pas_repondre") ? " checked" : "") + ' /> Je préfère ne pas répondre</label></div></div>' +
        '<div class="app-card" style="margin-bottom: var(--space-lg);">' +
        '<p style="font-weight: 600; margin-bottom: 0.75rem;">A quels modes de gestion avez-vous eu recours ?</p>' +
        '<div class="profil-choice-group">' +
        '<label><input type="checkbox" name="profil_c_modes" value="directe"' + (isChecked(modesGestion, "directe") ? " checked" : "") + ' /> Gestion directe, vous vous occupez vous-même de votre gestion.</label>' +
        '<label><input type="checkbox" name="profil_c_modes" value="conseillee"' + (isChecked(modesGestion, "conseillee") ? " checked" : "") + ' /> Gestion conseillée, vous êtes conseillé par votre conseiller financier pour effectuer vos choix de gestion.</label>' +
        '<label><input type="checkbox" name="profil_c_modes" value="mandat"' + (isChecked(modesGestion, "mandat") ? " checked" : "") + ' /> Gestion sous mandat, votre gestion est déléguée à un organisme de gestion.</label>' +
        '<label><input type="checkbox" name="profil_c_modes" value="ne_pas_repondre"' + (isChecked(modesGestion, "ne_pas_repondre") ? " checked" : "") + ' /> Je préfère ne pas répondre</label></div></div>' +
        '<div class="app-card" style="margin-bottom: var(--space-lg);">' +
        '<p style="font-weight: 600; margin-bottom: 0.75rem;">Connaissez-vous les familles de produits suivantes ? Si oui, sélectionnez les affirmations avec lesquelles vous êtes d\'accord.</p>' +
        '<p style="margin-bottom: 0.5rem;">Assurance-vie et capitalisation</p>' +
        '<div class="profil-ops-group" data-name="profil_c_assurance_vie">' +
        '<button type="button" class="profil-ops-btn' + (c.assurance_vie_oui === "oui" ? " is-selected" : "") + '" data-value="oui">Oui</button>' +
        '<button type="button" class="profil-ops-btn' + (c.assurance_vie_oui === "non" ? " is-selected" : "") + '" data-value="non">Non</button></div>' +
        '<div class="connaissance-followup" data-followup="assurance_vie"' + (avOui ? "" : ' style="display:none;"') + '>' +
        '<p style="font-size: 0.9rem; margin-top: 0.75rem;">Affirmeriez-vous plutôt :</p>' +
        '<div class="profil-choice-group">' +
        '<label><input type="radio" name="profil_c_av_affirm1" value="1" /> La clause bénéficiaire permet de désigner les bénéficiaires en cas de décès du souscripteur.</label>' +
        '<label><input type="radio" name="profil_c_av_affirm1" value="2" /> La clause bénéficiaire permet de définir les bénéficiaires en cas de rachat du contrat.</label>' +
        '<label><input type="radio" name="profil_c_av_affirm1" value="3" /> La clause bénéficiaire permet de définir les conditions que doivent remplir mes héritiers pour pouvoir percevoir le capital investi.</label>' +
        '<label><input type="radio" name="profil_c_av_affirm1" value="4" /> Je ne sais pas.</label></div>' +
        '<p style="font-size: 0.9rem; margin-top: 0.75rem;">Affirmeriez-vous plutôt :</p>' +
        '<div class="profil-choice-group">' +
        '<label><input type="radio" name="profil_c_av_affirm2" value="1" /> Sur un contrat de capitalisation je désigne des bénéficiaires.</label>' +
        '<label><input type="radio" name="profil_c_av_affirm2" value="2" /> Sur un contrat d\'assurance vie je désigne des bénéficiaires.</label>' +
        '<label><input type="radio" name="profil_c_av_affirm2" value="3" /> La liste des bénéficiaires d\'un contrat de capitalisation ou d\'un contrat d\'assurance-vie est restreinte à la liste des héritiers de l\'assuré.</label>' +
        '<label><input type="radio" name="profil_c_av_affirm2" value="4" /> Je ne sais pas.</label></div></div>' +
        '<p style="margin-bottom: 0.5rem; margin-top: 1rem;">PEA et comptes-titres</p>' +
        '<div class="profil-ops-group" data-name="profil_c_pea">' +
        '<button type="button" class="profil-ops-btn' + (c.pea_oui === "oui" ? " is-selected" : "") + '" data-value="oui">Oui</button>' +
        '<button type="button" class="profil-ops-btn' + (c.pea_oui === "non" ? " is-selected" : "") + '" data-value="non">Non</button></div>' +
        '<div class="connaissance-followup" data-followup="pea"' + (peaOui ? "" : ' style="display:none;"') + '>' +
        '<p style="font-size: 0.9rem; margin-top: 0.75rem;">Affirmeriez-vous plutôt :</p>' +
        '<div class="profil-choice-group">' +
        '<label><input type="radio" name="profil_c_pea_affirm1" value="1" /> Sur le compte titre, si je vends une action pour en acheter une autre, je ne paye pas d\'impôt.</label>' +
        '<label><input type="radio" name="profil_c_pea_affirm1" value="2" /> Sur le PEA, si je vends une action pour en acheter une autre, je ne paye pas d\'impôt.</label>' +
        '<label><input type="radio" name="profil_c_pea_affirm1" value="3" /> Après 5 ans, les dividendes et plus-values dégagées par le PEA sont exonérés d\'impôt et des prélèvements sociaux contrairement au compte titre.</label>' +
        '<label><input type="radio" name="profil_c_pea_affirm1" value="4" /> Je ne sais pas.</label></div>' +
        '<p style="font-size: 0.9rem; margin-top: 0.75rem;">Affirmeriez-vous plutôt :</p>' +
        '<div class="profil-choice-group">' +
        '<label><input type="radio" name="profil_c_pea_affirm2" value="1" /> Sur le PEA, je peux acheter des actions, obligations, immeubles...</label>' +
        '<label><input type="radio" name="profil_c_pea_affirm2" value="2" /> Le compte-titres doit être investi à 75% au moins en actions d\'entreprises cotées en dehors de l\'Union européenne.</label>' +
        '<label><input type="radio" name="profil_c_pea_affirm2" value="3" /> Sur le PEA, je peux acheter des actions européennes.</label>' +
        '<label><input type="radio" name="profil_c_pea_affirm2" value="4" /> Je ne sais pas.</label></div></div>' +
        '<p style="margin-bottom: 0.5rem; margin-top: 1rem;">Épargne retraite et entreprise</p>' +
        '<div class="profil-ops-group" data-name="profil_c_epargne_retraite">' +
        '<button type="button" class="profil-ops-btn' + (c.epargne_retraite_oui === "oui" ? " is-selected" : "") + '" data-value="oui">Oui</button>' +
        '<button type="button" class="profil-ops-btn' + (c.epargne_retraite_oui === "non" ? " is-selected" : "") + '" data-value="non">Non</button></div>' +
        '<div class="connaissance-followup" data-followup="epargne_retraite"' + (erOui ? "" : ' style="display:none;"') + '><p class="about-text" style="margin-top: 0.75rem;">Si vous avez répondu Oui, précisez votre connaissance de ces produits.</p></div></div>' +
        '<div class="app-card" style="margin-bottom: var(--space-lg);">' +
        '<p style="font-weight: 600; margin-bottom: 0.5rem;">Connaissez-vous ou avez-vous réalisé des opérations au cours des 12 derniers mois sur les instruments financiers suivants ? Si oui, cochez ceux dont vous connaissez le fonctionnement.</p>' +
        '<p style="margin-bottom: 0.5rem;">Fonds euros, produits monétaires, obligataires et actions</p>' +
        '<div class="profil-ops-group" data-name="profil_c_fonds_euros_global">' +
        '<button type="button" class="profil-ops-btn' + (c.fonds_euros_oui === "oui" ? " is-selected" : "") + '" data-value="oui">Oui</button>' +
        '<button type="button" class="profil-ops-btn' + (c.fonds_euros_oui === "non" ? " is-selected" : "") + '" data-value="non">Non</button></div>' +
        '<div class="connaissance-block-content connaissance-fonds-euros-reveal" data-block="fonds_euros_global"' + (fondsEurosOui ? ' style="display:block;"' : ' style="display:none;"') + '>' +
        '<label class="connaissance-toggle" style="margin-top: 1rem;"><input type="checkbox" class="connaissance-checkbox" data-block="fonds_euros"' + (fondsEurosChecked ? " checked" : "") + ' /><strong>Fonds euros</strong></label>' +
        '<div class="connaissance-block-content" data-block="fonds_euros"' + (fondsEurosChecked ? ' style="display:block;"' : "") + '>' +
        '<p style="font-size: 0.9rem; margin-top: 0.75rem;">Affirmeriez-vous plutôt :</p>' +
        '<div class="profil-choice-group">' +
        '<label><input type="radio" name="profil_connaissance_fonds_euros_affirm" value="1" /> En cas de baisse des marchés financiers, votre investissement en fonds euros va subir la même évolution.</label>' +
        '<label><input type="radio" name="profil_connaissance_fonds_euros_affirm" value="2" /> Les fonds en euros sont composés essentiellement d\'investissements obligataires garantis par la compagnie vous assurant de ne pas perdre votre capital.</label>' +
        '<label><input type="radio" name="profil_connaissance_fonds_euros_affirm" value="3" /> A long terme, les rendements des fonds euros sont plus élevés que ceux des unités de compte.</label>' +
        '<label><input type="radio" name="profil_connaissance_fonds_euros_affirm" value="4" /> Je ne sais pas.</label></div>' +
        '<p style="font-size: 0.9rem; margin-top: 0.5rem;">Opérations réalisées au cours des 12 derniers mois :</p>' +
        '<div class="profil-ops-group" data-name="profil_connaissance_fonds_euros_ops">' +
        '<button type="button" class="profil-ops-btn' + (feOps === "0" ? " is-selected" : "") + '" data-value="0">Aucune</button>' +
        '<button type="button" class="profil-ops-btn' + (feOps === "1-5" ? " is-selected" : "") + '" data-value="1-5">De 1 à 5</button>' +
        '<button type="button" class="profil-ops-btn' + (feOps === "5+" ? " is-selected" : "") + '" data-value="5+">Plus de 5</button></div></div></div>' +
        '<div class="app-card connaissance-card connaissance-fonds-euros-reveal" style="margin-bottom: var(--space-lg);' + (fondsEurosOui ? "" : " display:none;") + '">' +
        '<label class="connaissance-toggle">' +
        '<input type="checkbox" class="connaissance-checkbox" data-block="monetaire"' + monChecked + " />" +
        '<strong>Produits monétaires</strong></label>' +
        "<p class=\"about-text\" style=\"margin-bottom: 0.5rem;\">(Fonds monétaires, OPC monétaires)</p>" +
        '<div class="connaissance-block-content" data-block="monetaire"' + (monChecked ? ' style="display:block;"' : "") + ">" +
        '<p style="font-size: 0.9rem; margin-bottom: 0.5rem;">Affirmeriez-vous plutôt :</p>' +
        '<div class="profil-choice-group" style="margin-bottom: 1rem;">' +
        '<label><input type="radio" name="profil_connaissance_monetaire_affirm" value="1" /> Les fonds monétaires sont composés principalement de titres de créances négociables (TCN), de bons du Trésor, ainsi que d\'obligations à court terme.</label>' +
        '<label><input type="radio" name="profil_connaissance_monetaire_affirm" value="2" /> L\'investissement sur des OPC monétaires est parfaitement adapté pour un investissement de long terme.</label>' +
        '<label><input type="radio" name="profil_connaissance_monetaire_affirm" value="3" /> En investissant sur des fonds monétaires, le capital est garanti.</label>' +
        '<label><input type="radio" name="profil_connaissance_monetaire_affirm" value="4" /> Je ne sais pas.</label></div>' +
        '<p style="font-size: 0.9rem; margin-bottom: 0.5rem;">Opérations réalisées au cours des 12 derniers mois :</p>' +
        '<div class="profil-ops-group" data-name="profil_connaissance_monetaire_ops">' +
        '<button type="button" class="profil-ops-btn' + (monOps === "0" ? " is-selected" : "") + '" data-value="0">Aucune</button>' +
        '<button type="button" class="profil-ops-btn' + (monOps === "1-5" ? " is-selected" : "") + '" data-value="1-5">De 1 à 5</button>' +
        '<button type="button" class="profil-ops-btn' + (monOps === "5+" ? " is-selected" : "") + '" data-value="5+">Plus de 5</button></div></div></div>' +
        '<div class="app-card connaissance-card connaissance-fonds-euros-reveal" style="margin-bottom: var(--space-lg);' + (fondsEurosOui ? "" : " display:none;") + '">' +
        '<label class="connaissance-toggle">' +
        '<input type="checkbox" class="connaissance-checkbox" data-block="obligataire"' + oblChecked + " />" +
        '<strong>Produits obligataires</strong></label>' +
        "<p class=\"about-text\" style=\"margin-bottom: 0.5rem;\">(Obligations, fonds obligataires, OPC obligataires, titres de créance... à l'exception de ceux qui comportent un instrument dérivé)</p>" +
        '<div class="connaissance-block-content" data-block="obligataire"' + (oblChecked ? ' style="display:block;"' : "") + ">" +
        '<p style="font-size: 0.9rem; margin-bottom: 0.5rem;">Affirmeriez-vous plutôt :</p>' +
        '<div class="profil-choice-group" style="margin-bottom: 1rem;">' +
        '<label><input type="radio" name="profil_connaissance_obligataire_affirm" value="1" /> Les obligations sont des dettes d\'État ou d\'entreprise pour lesquelles le défaut de remboursement des organismes emprunteurs est inexistant.</label>' +
        '<label><input type="radio" name="profil_connaissance_obligataire_affirm" value="2" /> Pour une obligation, un taux d\'intérêt élevé indique un risque faible.</label>' +
        '<label><input type="radio" name="profil_connaissance_obligataire_affirm" value="3" /> La performance d\'un fonds obligataire varie avec les évolutions des taux d\'intérêt.</label>' +
        '<label><input type="radio" name="profil_connaissance_obligataire_affirm" value="4" /> Je ne sais pas.</label></div>' +
        '<p style="font-size: 0.9rem; margin-bottom: 0.5rem;">Opérations réalisées au cours des 12 derniers mois :</p>' +
        '<div class="profil-ops-group" data-name="profil_connaissance_obligataire_ops">' +
        '<button type="button" class="profil-ops-btn' + (oblOps === "0" ? " is-selected" : "") + '" data-value="0">Aucune</button>' +
        '<button type="button" class="profil-ops-btn' + (oblOps === "1-5" ? " is-selected" : "") + '" data-value="1-5">De 1 à 5</button>' +
        '<button type="button" class="profil-ops-btn' + (oblOps === "5+" ? " is-selected" : "") + '" data-value="5+">Plus de 5</button></div></div></div>' +
        '<div class="app-card connaissance-card connaissance-fonds-euros-reveal" style="margin-bottom: var(--space-lg);' + (fondsEurosOui ? "" : " display:none;") + '">' +
        '<label class="connaissance-toggle">' +
        '<input type="checkbox" class="connaissance-checkbox" data-block="actions"' + actChecked + " />" +
        '<strong>Produits actions</strong></label>' +
        "<p class=\"about-text\" style=\"margin-bottom: 0.5rem;\">(Actions, fonds en actions, OPC actions... admis à la négociation sur un marché réglementé à l'exception de ceux qui comportent un instrument dérivé)</p>" +
        '<div class="connaissance-block-content" data-block="actions"' + (actChecked ? ' style="display:block;"' : "") + ">" +
        '<p style="font-size: 0.9rem; margin-bottom: 0.5rem;">Affirmeriez-vous plutôt :</p>' +
        '<div class="profil-choice-group" style="margin-bottom: 1rem;">' +
        '<label><input type="radio" name="profil_connaissance_actions_affirm" value="1" /> Les actions répondent à un investissement à court terme.</label>' +
        '<label><input type="radio" name="profil_connaissance_actions_affirm" value="2" /> Les variations du cours de l\'action dépendent de la santé financière de l\'entreprise et de son environnement économique.</label>' +
        '<label><input type="radio" name="profil_connaissance_actions_affirm" value="3" /> Avec des actions, l\'investisseur bénéficie de revenus réguliers car les entreprises ont l\'obligation de verser des dividendes aux actionnaires.</label>' +
        '<label><input type="radio" name="profil_connaissance_actions_affirm" value="4" /> Je ne sais pas.</label></div>' +
        '<p style="font-size: 0.9rem; margin-bottom: 0.5rem;">Opérations réalisées au cours des 12 derniers mois :</p>' +
        '<div class="profil-ops-group" data-name="profil_connaissance_actions_ops">' +
        '<button type="button" class="profil-ops-btn' + (actOps === "0" ? " is-selected" : "") + '" data-value="0">Aucune</button>' +
        '<button type="button" class="profil-ops-btn' + (actOps === "1-5" ? " is-selected" : "") + '" data-value="1-5">De 1 à 5</button>' +
        '<button type="button" class="profil-ops-btn' + (actOps === "5+" ? " is-selected" : "") + '" data-value="5+">Plus de 5</button></div></div></div>' +
        '<div class="app-card" style="margin-bottom: var(--space-lg);">' +
        '<p style="font-weight: 600; margin-bottom: 0.5rem;">Défiscalisation, immobilier et produits structurés</p>' +
        '<div class="profil-ops-group" data-name="profil_connaissance_defiscalisation">' +
        '<button type="button" class="profil-ops-btn' + (defisc === "oui" ? " is-selected" : "") + '" data-value="oui">Oui</button>' +
        '<button type="button" class="profil-ops-btn' + (defisc === "non" ? " is-selected" : "") + '" data-value="non">Non</button></div>' +
        '<div class="connaissance-followup" data-followup="defiscalisation"' + (defisc === "oui" ? "" : ' style="display:none;"') + '><p class="about-text" style="margin-top: 0.75rem;">Précisez si vous avez une expérience en défiscalisation, immobilier ou produits structurés (OPCI, SCPI, Girardin, etc.).</p></div></div>' +
        '<div class="app-card">' +
        '<p style="font-weight: 600; margin-bottom: 0.5rem;">Produits à effet de levier et produits boursiers</p>' +
        '<div class="profil-ops-group" data-name="profil_connaissance_levier">' +
        '<button type="button" class="profil-ops-btn' + (levier === "oui" ? " is-selected" : "") + '" data-value="oui">Oui</button>' +
        '<button type="button" class="profil-ops-btn' + (levier === "non" ? " is-selected" : "") + '" data-value="non">Non</button></div>' +
        '<div class="connaissance-followup" data-followup="levier"' + (levier === "oui" ? "" : ' style="display:none;"') + '><p class="about-text" style="margin-top: 0.75rem;">Précisez si vous avez une expérience en produits à effet de levier (CFD, options, warrants, turbos, etc.).</p></div></div>' +
        '<div class="app-card" style="margin-bottom: var(--space-lg);">' +
        '<p style="font-weight: 600; margin-bottom: 0.5rem;">Quel montant de transaction (versement, arbitrage, retrait) avez-vous effectué sur ces 12 derniers mois ?</p>' +
        '<div class="profil-choice-group">' +
        '<label><input type="radio" name="profil_c_montant_transaction" value="aucun"' + (montantTx === "aucun" ? " checked" : "") + ' /> Aucun</label>' +
        '<label><input type="radio" name="profil_c_montant_transaction" value="<=3000"' + (montantTx === "<=3000" ? " checked" : "") + ' /> Inférieur ou égal à 3 000 euros</label>' +
        '<label><input type="radio" name="profil_c_montant_transaction" value="3000-10000"' + (montantTx === "3000-10000" ? " checked" : "") + ' /> Entre 3 000 et 10 000 euros</label>' +
        '<label><input type="radio" name="profil_c_montant_transaction" value=">10000"' + (montantTx === ">10000" ? " checked" : "") + ' /> Supérieur à 10 000 euros</label></div></div>' +
        '<div class="app-card">' +
        '<p style="font-weight: 600; margin-bottom: 0.5rem;">Avez-vous déjà subi des pertes sur vos placements financiers ?</p>' +
        '<div class="profil-ops-group" data-name="profil_c_pertes_subies">' +
        '<button type="button" class="profil-ops-btn' + (pertesSubies === "oui" ? " is-selected" : "") + '" data-value="oui">Oui</button>' +
        '<button type="button" class="profil-ops-btn' + (pertesSubies === "non" ? " is-selected" : "") + '" data-value="non">Non</button></div></div>' +
        "</form>";
    } else if (step.id === "risque") {
      var scenarioChoice = (a.risque && a.risque.scenario) || "";
      var v = (a.risque && a.risque.placements) || "";
      var placementAbc = (a.risque && a.risque.placement_abc) || "";
      contentHtml =
        "<h2>Profil investisseur</h2>" +
        '<p class="step-desc"><strong>Profil de risque</strong></p>' +
        '<p class="step-desc">Imaginez que l\'ensemble de vos économies soit investi dans un placement sans risque qui vous rapporte un revenu certain de 20 000 € par an. On vous propose de réallouer votre capital pour l\'investir sur des supports risqués qui ont : une chance sur deux (50 %) de vous procurer un revenu annuel double (40 000 €) ; et une chance sur deux de vous procurer un revenu diminué d\'un tiers (13 333 €).</p>' +
        '<form id="profil-step-form">' +
        '<div class="form-group" style="margin-bottom: var(--space-lg);">' +
        '<div class="profil-choice-group" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">' +
        '<label class="profil-scenario-card"><input type="radio" name="profil_risque_scenario" value="conserver"' + (scenarioChoice === "conserver" ? " checked" : "") + ' /><span><strong>Je conserve le placement actuel</strong><br/>Garanti · 20 000 € / an</span></label>' +
        '<label class="profil-scenario-card"><input type="radio" name="profil_risque_scenario" value="accepter"' + (scenarioChoice === "accepter" ? " checked" : "") + ' /><span><strong>J\'accepte le nouveau placement</strong><br/>50 % de chance 40 000 € / an · 50 % de chance 13 333 € / an</span></label>' +
        "</div></div>" +
        '<p class="step-desc">En matière de placements financiers, pensez-vous plutôt que :</p>' +
        '<div class="profil-choice-group" style="margin-bottom: var(--space-lg);">' +
        '<label><input type="radio" name="profil_risque_placements" value="1"' + (v === "1" ? " checked" : "") + " /> Il ne faut pas prendre de risque ; on doit placer toutes ses économies dans des placements sûrs.</label>" +
        '<label><input type="radio" name="profil_risque_placements" value="2"' + (v === "2" ? " checked" : "") + " /> On peut placer une petite partie de ses économies sur des placements risqués.</label>" +
        '<label><input type="radio" name="profil_risque_placements" value="3"' + (v === "3" ? " checked" : "") + " /> On peut placer une part importante de ses économies sur des actifs risqués si le gain en vaut la peine.</label>" +
        '<label><input type="radio" name="profil_risque_placements" value="4"' + (v === "4" ? " checked" : "") + " /> On doit placer l'essentiel de ses économies sur des actifs risqués dès qu'il y a des chances de gains très importants.</label>" +
        "</div>" +
        '<p class="step-desc">Le graphique ci-dessous présente 3 placements. Pour chacun d\'eux, sont représentées les estimations de rendement annuel (en %) sur une période de 8 ans, de la plus pessimiste à la plus optimiste. Choisissez le placement qui vous correspond le mieux.</p>' +
        '<div class="profil-choice-group">' +
        '<label class="profil-scenario-card"><input type="radio" name="profil_risque_placement_abc" value="A"' + (placementAbc === "A" ? " checked" : "") + ' /><span><strong>Placement A</strong><br/>Vous souhaitez limiter au maximum le risque de vos investissements, quitte à en limiter la performance.</span></label>' +
        '<label class="profil-scenario-card"><input type="radio" name="profil_risque_placement_abc" value="B"' + (placementAbc === "B" ? " checked" : "") + ' /><span><strong>Placement B</strong><br/>Vous acceptez un risque modéré afin de dynamiser la performance de vos placements.</span></label>' +
        '<label class="profil-scenario-card"><input type="radio" name="profil_risque_placement_abc" value="C"' + (placementAbc === "C" ? " checked" : "") + ' /><span><strong>Placement C</strong><br/>Vous recherchez une très bonne performance, et acceptez de voir votre capital fluctuer à la baisse durant la durée de votre placement.</span></label>' +
        "</div></form>";
    } else if (step.id === "preferences") {
      var checked = (a.preferences && a.preferences.ne_conviennent) || [];
      var opts = [
        { id: "preservation", label: "Préservation du capital", desc: "Stratégie d'investissement prudente dont l'objectif principal est de préserver le capital et d'éviter les pertes au sein d'un portefeuille. Cette stratégie ne permet pas d'investir sur le marché action." },
        { id: "croissance", label: "Croissance du capital", desc: "Stratégie d'investissement dont l'objectif principal est d'augmenter le capital avec en contrepartie un risque de perte plus élevé. Cette stratégie permet de s'exposer plus ou moins sur le marché des actions." },
        { id: "revenus", label: "Revenus", desc: "Cette stratégie privilégie les placements qui procurent des revenus (dividendes, coupons, autres revenus distribués...)." },
        { id: "hedging", label: "Hedging (couverture de risque)", desc: "Une stratégie de Hedging est une stratégie de couverture. Elle consiste à couvrir une position ouverte par une autre position opposée. C'est un objectif de placement adapté uniquement aux investisseurs expérimentés." },
        { id: "levier", label: "Exposition à effet de levier", desc: "Stratégie d'investissement qui vous permet, contre couverture, de prendre plus de positions sur les marchés que votre investissement réel. Les gains sont potentiellement élevés mais en contrepartie vous risquez de perdre plus que la somme réellement investie." },
        { id: "aucun", label: "Aucun, tous les objectifs d'investissement proposés peuvent me convenir", desc: "" },
      ];
      contentHtml =
        "<h2>Profil investisseur</h2>" +
        '<p class="step-desc"><strong>Préférences de placement</strong> — Parmi les objectifs d\'investissement suivants, cochez ceux qui ne vous conviennent pas (plusieurs réponses possibles) :</p>' +
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
      var revenus = (a.pertes && a.pertes.revenus_foyer) || "";
      var epargne = (a.pertes && a.pertes.epargne_mensuelle) || "";
      contentHtml =
        "<h2>Profil investisseur</h2>" +
        '<p class="step-desc"><strong>Capacité à subir des pertes</strong></p>' +
        '<form id="profil-step-form">' +
        '<div class="form-group" style="margin-bottom: var(--space-lg);">' +
        '<label style="display:block; margin-bottom: 0.5rem; font-weight: 600;">Quels sont les revenus nets annuels de votre foyer ?</label>' +
        '<div class="profil-choice-group">' +
        '<label><input type="radio" name="profil_pertes_revenus" value="<25"' + (revenus === "<25" ? " checked" : "") + " /> Inférieur à 25 000 €</label>" +
        '<label><input type="radio" name="profil_pertes_revenus" value="25-50"' + (revenus === "25-50" ? " checked" : "") + " /> Entre 25 000 € et 50 000 €</label>" +
        '<label><input type="radio" name="profil_pertes_revenus" value="50-75"' + (revenus === "50-75" ? " checked" : "") + " /> Entre 50 000 € et 75 000 €</label>" +
        '<label><input type="radio" name="profil_pertes_revenus" value="75-100"' + (revenus === "75-100" ? " checked" : "") + " /> Entre 75 000 € et 100 000 €</label>" +
        '<label><input type="radio" name="profil_pertes_revenus" value="100-150"' + (revenus === "100-150" ? " checked" : "") + " /> Entre 100 000 € et 150 000 €</label>" +
        '<label><input type="radio" name="profil_pertes_revenus" value="150-300"' + (revenus === "150-300" ? " checked" : "") + " /> Entre 150 000 € et 300 000 €</label>" +
        '<label><input type="radio" name="profil_pertes_revenus" value=">300"' + (revenus === ">300" ? " checked" : "") + " /> Plus de 300 000 €</label>" +
        "</div></div>" +
        '<div class="form-group">' +
        '<label style="display:block; margin-bottom: 0.5rem; font-weight: 600;">Combien épargnez-vous chaque mois ?</label>' +
        '<div class="profil-choice-group">' +
        '<label><input type="radio" name="profil_pertes_epargne" value="0"' + (epargne === "0" ? " checked" : "") + " /> Je n'épargne pas</label>" +
        '<label><input type="radio" name="profil_pertes_epargne" value="0-500"' + (epargne === "0-500" ? " checked" : "") + " /> Entre 0 et 500 €</label>" +
        '<label><input type="radio" name="profil_pertes_epargne" value="500-1000"' + (epargne === "500-1000" ? " checked" : "") + " /> Entre 500 et 1 000 €</label>" +
        '<label><input type="radio" name="profil_pertes_epargne" value="1000-2000"' + (epargne === "1000-2000" ? " checked" : "") + " /> Entre 1 000 € et 2 000 €</label>" +
        '<label><input type="radio" name="profil_pertes_epargne" value=">2000"' + (epargne === ">2000" ? " checked" : "") + " /> Plus de 2 000 €</label>" +
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
          ? '<div class="form-group" style="margin-bottom: var(--space-lg);"><label style="display:block; margin-bottom: 0.5rem; font-weight: 600;">Quelle part de votre investissement souhaitez-vous consacrer à des activités environnementales ?</label>' +
            '<div class="profil-choice-group">' +
            '<label><input type="radio" name="profil_extra_env_percent" value="5"' + (envPercent === "5" ? " checked" : "") + " /> Vous souhaitez y consacrer au moins 5 % de votre investissement.</label>" +
            '<label><input type="radio" name="profil_extra_env_percent" value="25"' + (envPercent === "25" ? " checked" : "") + " /> Vous souhaitez y consacrer au moins 25 % de votre investissement.</label>" +
            '<label><input type="radio" name="profil_extra_env_percent" value="50"' + (envPercent === "50" ? " checked" : "") + " /> Vous souhaitez y consacrer au moins 50 % de votre investissement.</label>" +
            "</div></div>" +
            '<p class="about-text">Vous avez indiqué vouloir investir dans des activités environnementales. Les instruments financiers qui correspondent à ce choix font partie de la catégorie Taxonomie. Veuillez noter que ce choix est susceptible d\'impacter la liste des supports dans lesquels vous pourriez investir.</p>'
          : "") +
        "</form>";
    } else {
      var recapConnaissance = (a.connaissance) ? "Monétaires op. " + (a.connaissance.monetaire_ops || "—") + " ; Obligataires op. " + (a.connaissance.obligataire_ops || "—") + " ; Actions op. " + (a.connaissance.actions_ops || "—") + " ; Défiscalisation " + (a.connaissance.defiscalisation || "—") + " ; Effet de levier " + (a.connaissance.levier || "—") : "—";
      var recapRisque = (a.risque) ? ["Scénario " + (a.risque.scenario || "—"), "Placements " + (a.risque.placements || "—"), "Placement A/B/C " + (a.risque.placement_abc || "—")].filter(Boolean).join(" ; ") : "—";
      contentHtml =
        "<h2>Profil investisseur</h2>" +
        '<p class="step-desc"><strong>Récapitulatif</strong> — Voici la synthèse de vos réponses.</p>' +
        '<div class="profil-recap-block"><h3>Connaissance et expérience</h3><p>' + recapConnaissance + "</p></div>" +
        '<div class="profil-recap-block"><h3>Profil de risque</h3><p>' + recapRisque + "</p></div>" +
        '<div class="profil-recap-block"><h3>Préférences de placement</h3><p>Objectifs ne convenant pas : ' + ((a.preferences && a.preferences.ne_conviennent && a.preferences.ne_conviennent.length) ? a.preferences.ne_conviennent.join(", ") : "Aucun.") + ".</p></div>" +
        '<div class="profil-recap-block"><h3>Capacité à subir des pertes</h3><p>Revenus foyer : ' + ((a.pertes && a.pertes.revenus_foyer) || "—") + " ; Épargne mensuelle : " + ((a.pertes && a.pertes.epargne_mensuelle) || "—") + ".</p></div>" +
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
      if (step.id === "intro" && form) {
        var fd = new FormData(form);
        out.intro = {
          realise_pour: (fd.get("profil_intro_realise_pour") || "").trim(),
          represente_par: (fd.get("profil_intro_represente_par") || "").trim(),
          comprend_objectif: !!form.querySelector('input[name="profil_intro_comprend_objectif"]:checked'),
        };
      } else if (step.id === "connaissance" && form) {
        var fd = new FormData(form);
        var produitsEls = form.querySelectorAll('input[name="profil_c_produits"]:checked');
        var modesEls = form.querySelectorAll('input[name="profil_c_modes"]:checked');
        var avEl = document.querySelector("[data-name='profil_c_assurance_vie'] .profil-ops-btn.is-selected");
        var peaEl = document.querySelector("[data-name='profil_c_pea'] .profil-ops-btn.is-selected");
        var erEl = document.querySelector("[data-name='profil_c_epargne_retraite'] .profil-ops-btn.is-selected");
        var feGlobalEl = document.querySelector("[data-name='profil_c_fonds_euros_global'] .profil-ops-btn.is-selected");
        var monCb = form.querySelector(".connaissance-checkbox[data-block=\"monetaire\"]");
        var oblCb = form.querySelector(".connaissance-checkbox[data-block=\"obligataire\"]");
        var actCb = form.querySelector(".connaissance-checkbox[data-block=\"actions\"]");
        var feCb = form.querySelector(".connaissance-checkbox[data-block=\"fonds_euros\"]");
        var feOpsEl = document.querySelector("[data-name='profil_connaissance_fonds_euros_ops'] .profil-ops-btn.is-selected");
        var monOpsEl = document.querySelector("[data-name='profil_connaissance_monetaire_ops'] .profil-ops-btn.is-selected");
        var oblOpsEl = document.querySelector("[data-name='profil_connaissance_obligataire_ops'] .profil-ops-btn.is-selected");
        var actOpsEl = document.querySelector("[data-name='profil_connaissance_actions_ops'] .profil-ops-btn.is-selected");
        var defiscEl = document.querySelector("[data-name='profil_connaissance_defiscalisation'] .profil-ops-btn.is-selected");
        var levierEl = document.querySelector("[data-name='profil_connaissance_levier'] .profil-ops-btn.is-selected");
        var pertesSubiesEl = document.querySelector("[data-name='profil_c_pertes_subies'] .profil-ops-btn.is-selected");
        out.connaissance = {
          produits_detenus: produitsEls ? Array.prototype.map.call(produitsEls, function (el) { return el.value; }) : [],
          modes_gestion: modesEls ? Array.prototype.map.call(modesEls, function (el) { return el.value; }) : [],
          assurance_vie_oui: avEl ? avEl.getAttribute("data-value") : "",
          av_affirm1: fd.get("profil_c_av_affirm1") || "",
          av_affirm2: fd.get("profil_c_av_affirm2") || "",
          pea_oui: peaEl ? peaEl.getAttribute("data-value") : "",
          pea_affirm1: fd.get("profil_c_pea_affirm1") || "",
          pea_affirm2: fd.get("profil_c_pea_affirm2") || "",
          epargne_retraite_oui: erEl ? erEl.getAttribute("data-value") : "",
          fonds_euros_oui: feGlobalEl ? feGlobalEl.getAttribute("data-value") : "",
          fonds_euros_checked: feCb ? feCb.checked : false,
          fonds_euros_affirm: fd.get("profil_connaissance_fonds_euros_affirm") || "",
          fonds_euros_ops: feOpsEl ? feOpsEl.getAttribute("data-value") : "",
          monetaire_checked: monCb ? monCb.checked : false,
          obligataire_checked: oblCb ? oblCb.checked : false,
          actions_checked: actCb ? actCb.checked : false,
          monetaire_affirm: fd.get("profil_connaissance_monetaire_affirm") || "",
          monetaire_ops: monOpsEl ? monOpsEl.getAttribute("data-value") : "",
          obligataire_affirm: fd.get("profil_connaissance_obligataire_affirm") || "",
          obligataire_ops: oblOpsEl ? oblOpsEl.getAttribute("data-value") : "",
          actions_affirm: fd.get("profil_connaissance_actions_affirm") || "",
          actions_ops: actOpsEl ? actOpsEl.getAttribute("data-value") : "",
          defiscalisation: defiscEl ? defiscEl.getAttribute("data-value") : "",
          levier: levierEl ? levierEl.getAttribute("data-value") : "",
          montant_transaction: fd.get("profil_c_montant_transaction") || "",
          pertes_subies: pertesSubiesEl ? pertesSubiesEl.getAttribute("data-value") : "",
        };
      } else if (step.id === "risque" && form) {
        var sc = form.querySelector('input[name="profil_risque_scenario"]:checked');
        var r = form.querySelector('input[name="profil_risque_placements"]:checked');
        var abc = form.querySelector('input[name="profil_risque_placement_abc"]:checked');
        out.risque = {
          scenario: sc ? sc.value : "",
          placements: r ? r.value : "",
          placement_abc: abc ? abc.value : "",
        };
      } else if (step.id === "preferences" && form) {
        var checkboxes = form.querySelectorAll('input[name="profil_preferences_ne_conviennent"]:checked');
        out.preferences = { ne_conviennent: checkboxes ? Array.prototype.map.call(checkboxes, function (el) { return el.value; }) : [] };
      } else if (step.id === "pertes" && form) {
        var rev = form.querySelector('input[name="profil_pertes_revenus"]:checked');
        var ep = form.querySelector('input[name="profil_pertes_epargne"]:checked');
        out.pertes = { revenus_foyer: rev ? rev.value : "", epargne_mensuelle: ep ? ep.value : "" };
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
        var name = group && group.getAttribute("data-name");
        var isOui = this.getAttribute("data-value") === "oui";
        var followup = name && document.querySelector(".connaissance-followup[data-followup=\"" + name.replace("profil_c_", "").replace("profil_connaissance_", "") + "\"]");
        if (name === "profil_c_assurance_vie") followup = document.querySelector(".connaissance-followup[data-followup=\"assurance_vie\"]");
        else if (name === "profil_c_pea") followup = document.querySelector(".connaissance-followup[data-followup=\"pea\"]");
        else if (name === "profil_c_epargne_retraite") followup = document.querySelector(".connaissance-followup[data-followup=\"epargne_retraite\"]");
        else if (name === "profil_c_fonds_euros_global") {
          document.querySelectorAll(".connaissance-block-content[data-block=\"fonds_euros_global\"], .connaissance-fonds-euros-reveal").forEach(function (el) { el.style.display = isOui ? "block" : "none"; });
          followup = null;
        }
        else if (name === "profil_connaissance_defiscalisation") followup = document.querySelector(".connaissance-followup[data-followup=\"defiscalisation\"]");
        else if (name === "profil_connaissance_levier") followup = document.querySelector(".connaissance-followup[data-followup=\"levier\"]");
        else if (name === "profil_c_pertes_subies") followup = null;
        if (followup) followup.style.display = isOui ? "block" : "none";
      });
    });
    document.querySelectorAll(".connaissance-checkbox").forEach(function (cb) {
      cb.addEventListener("change", function () {
        var block = this.getAttribute("data-block");
        var content = document.querySelector(".connaissance-block-content[data-block=\"" + block + "\"]");
        if (content) content.style.display = this.checked ? "block" : "none";
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

