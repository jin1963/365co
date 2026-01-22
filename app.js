// app.js (ethers v5) - 365df MLM DApp V3 (FIXED enum pkg 1/2/3)
(() => {
  "use strict";

  const C = window.APP_CONFIG;

  // ===== Company sponsor (default) =====
  const COMPANY_SPONSOR = "0x85EFe209769B183d41A332872Ac1cF57bd3d8300";

  // ===== UI helpers =====
  const $ = (id) => document.getElementById(id);

  const setStatus = (msg) => {
    const el = $("status");
    if (el) el.textContent = msg;
  };

  const isAddr = (s) => /^0x[a-fA-F0-9]{40}$/.test(s || "");
  const checksum = (a) => ethers.utils.getAddress(a);

  const fmtUnits = (bn, decimals = 18, maxFrac = 6) => {
    try {
      const s = ethers.utils.formatUnits(bn || 0, decimals);
      const [i, f = ""] = s.split(".");
      return f.length ? `${i}.${f.slice(0, maxFrac)}` : i;
    } catch {
      return "-";
    }
  };

  const nowSec = () => Math.floor(Date.now() / 1000);

  // ===== State =====
  let provider, signer, user;
  let core, vault, staking, usdt, binary;

  // IMPORTANT: CoreV3 enum Package => None=0, Small=1, Medium=2, Large=3
  let selectedPkg = null; // 1/2/3 only
  let sideRight = null;   // boolean
  let sponsor = null;     // address

  let countdownTimer = null;

  const PKG_LABEL_BY_ENUM = {
    1: "Small",
    2: "Medium",
    3: "Large",
  };

  const RANK_LABEL = ["None", "Bronze", "Silver", "Gold"];

  // ===== Provider detect (MetaMask/Bitget/Binance) =====
  function detectInjected() {
    if (window.ethereum) return window.ethereum;
    if (window.BinanceChain) return window.BinanceChain;
    return null;
  }

  async function ensureBSC() {
    const net = await provider.getNetwork();
    if ($("network")) $("network").textContent = `${net.chainId}`;

    if (net.chainId !== C.CHAIN_ID_DEC) {
      const injected = detectInjected();
      if (!injected?.request) throw new Error(`Wrong network. Switch to BSC (chainId ${C.CHAIN_ID_DEC}).`);

      try {
        await injected.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: C.CHAIN_ID_HEX }]
        });
      } catch (e) {
        throw new Error("Please switch wallet network to BSC Mainnet then retry.");
      }
    }
  }

  function makeReferralURL(addr, side) {
    const u = new URL(window.location.href);
    u.searchParams.set("ref", addr);
    u.searchParams.set("side", side); // L or R
    return u.toString();
  }

  function updateRefPreview() {
    const addr = sponsor && isAddr(sponsor) ? sponsor : COMPANY_SPONSOR;
    const side = sideRight === true ? "R" : "L";
    const link = makeReferralURL(addr, side);
    const el = $("refPreview");
    if (el) el.textContent = link;
  }

  function readRefFromURL_orDefault() {
    const u = new URL(window.location.href);
    const ref = u.searchParams.get("ref");
    const side = (u.searchParams.get("side") || "").toUpperCase();

    sponsor = isAddr(ref) ? checksum(ref) : checksum(COMPANY_SPONSOR);

    if (side === "R") sideRight = true;
    else if (side === "L") sideRight = false;
    else sideRight = false; // default Left

    const inp = $("sponsorInput");
    if (inp) inp.value = sponsor;

    const sideText = $("sideText");
    if (sideText) sideText.textContent = sideRight ? "Right" : "Left";

    updateRefPreview();
  }

  function bindSponsorInput() {
    const inp = $("sponsorInput");
    if (!inp) return;

    inp.addEventListener("input", () => {
      const v = (inp.value || "").trim();
      if (isAddr(v)) sponsor = checksum(v);
      else sponsor = null;

      updateBuyButtonState();
      updateRefPreview();
    });

    inp.addEventListener("blur", () => {
      if (sponsor && isAddr(sponsor)) inp.value = sponsor;
    });
  }

  function bindSideButtons() {
    $("btnSideL")?.addEventListener("click", () => {
      sideRight = false;
      $("sideText").textContent = "Left";
      setStatus("Selected side: Left");
      updateBuyButtonState();
      updateRefPreview();
    });

    $("btnSideR")?.addEventListener("click", () => {
      sideRight = true;
      $("sideText").textContent = "Right";
      setStatus("Selected side: Right");
      updateBuyButtonState();
      updateRefPreview();
    });
  }

  function joinCompany(side) {
    const link = makeReferralURL(COMPANY_SPONSOR, side);
    window.location.href = link;
  }

  function bindCompanyJoinButtons() {
    $("btnJoinCompanyL")?.addEventListener("click", () => joinCompany("L"));
    $("btnJoinCompanyR")?.addEventListener("click", () => joinCompany("R"));
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied ✅");
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setStatus("Copied ✅");
    }
  }

  function bindCopyButtons() {
    $("btnCopyRefL")?.addEventListener("click", async () => {
      const addr = sponsor && isAddr(sponsor) ? sponsor : COMPANY_SPONSOR;
      await copyText(makeReferralURL(addr, "L"));
    });
    $("btnCopyRefR")?.addEventListener("click", async () => {
      const addr = sponsor && isAddr(sponsor) ? sponsor : COMPANY_SPONSOR;
      await copyText(makeReferralURL(addr, "R"));
    });
  }

  // ===== Package selection (FIXED) =====
  function bindPkgButtons() {
    document.querySelectorAll(".pkg").forEach((btn) => {
      btn.addEventListener("click", () => {
        const p = (btn.getAttribute("data-pkg") || "").toUpperCase();

        // CoreV3 enum Package: Small=1, Medium=2, Large=3
        if (p === "S") selectedPkg = 1;
        else if (p === "M") selectedPkg = 2;
        else if (p === "L") selectedPkg = 3;
        else selectedPkg = null;

        const label = selectedPkg ? PKG_LABEL_BY_ENUM[selectedPkg] : "-";
        const el = $("selectedPkg");
        if (el) el.textContent = label;

        if (selectedPkg) setStatus(`Selected package: ${label}`);
        else setStatus("Please select a package.");

        updateBuyButtonState();
      });
    });
  }

  function updateBuyButtonState() {
    const ok =
      !!user &&
      (selectedPkg === 1 || selectedPkg === 2 || selectedPkg === 3) &&
      sponsor && isAddr(sponsor) &&
      (sideRight === true || sideRight === false);

    const btn = $("btnBuy");
    if (btn) btn.disabled = !ok;
  }

  function enableActions(on) {
    if ($("btnClaimBonus")) $("btnClaimBonus").disabled = !on;
    if ($("btnClaimStake")) $("btnClaimStake").disabled = !on;
    if ($("btnRefresh")) $("btnRefresh").disabled = !on;
  }

  function setContractsLine() {
    const el = $("contractsLine");
    if (!el) return;
    el.textContent =
      `CORE: ${C.CORE} • VAULT: ${C.VAULT} • STAKING: ${C.STAKING} • USDT: ${C.USDT} • DF: ${C.DF}`;
  }

  // ===== Buy helpers =====
  // CoreV3 priceUSDT expects Package enum => 1/2/3
  function pkgPriceUSDT(pkgEnum) {
    if (pkgEnum === 1) return ethers.utils.parseUnits("100", 18);
    if (pkgEnum === 2) return ethers.utils.parseUnits("1000", 18);
    if (pkgEnum === 3) return ethers.utils.parseUnits("10000", 18);
    throw new Error("Bad package (enum must be 1/2/3)");
  }

  // ===== Connect =====
  async function connect() {
    try {
      const injected = detectInjected();
      if (!injected) {
        setStatus("No wallet detected. Open this page in a wallet DApp browser (MetaMask/Bitget/Binance).");
        return;
      }

      provider = new ethers.providers.Web3Provider(injected, "any");
      await provider.send("eth_requestAccounts", []);
      signer = provider.getSigner();
      user = checksum(await signer.getAddress());

      await ensureBSC();

      // Contracts
      core = new ethers.Contract(C.CORE, C.CORE_ABI, signer);
      vault = new ethers.Contract(C.VAULT, C.VAULT_ABI, signer);
      staking = new ethers.Contract(C.STAKING, C.STAKING_ABI, signer);
      usdt = new ethers.Contract(C.USDT, C.ERC20_ABI, signer);
      binary = new ethers.Contract(C.BINARY, C.BINARY_ABI, signer); // read-only (for volumes)

      if ($("wallet")) $("wallet").textContent = user;
      if ($("network")) $("network").textContent = "BSC (56)";

      setContractsLine();
      enableActions(true);

      setStatus("Connected ✅");

      await refresh();
      updateBuyButtonState();

      // listeners
      if (injected.on) {
        injected.on("accountsChanged", async (accs) => {
          if (!accs || !accs.length) return;
          user = checksum(accs[0]);
          if ($("wallet")) $("wallet").textContent = user;
          setStatus("Account changed ✅");
          await refresh();
          updateBuyButtonState();
        });

        injected.on("chainChanged", async () => {
          setStatus("Network changed. Refreshing...");
          await refresh();
        });
      }
    } catch (e) {
      setStatus(`Connect failed: ${e?.message || e}`);
    }
  }

  // ===== Buy flow: Approve -> buyOrUpgrade =====
  async function approveAndBuy() {
    try {
      if (!user) return setStatus("Please connect wallet first.");
      if (!(selectedPkg === 1 || selectedPkg === 2 || selectedPkg === 3)) return setStatus("Please select a package.");
      if (!sponsor || !isAddr(sponsor)) return setStatus("Sponsor is invalid.");
      if (sideRight !== true && sideRight !== false) return setStatus("Please choose Left/Right.");

      const amount = pkgPriceUSDT(selectedPkg);

      // allowance
      setStatus("Checking allowance...");
      const allowance = await usdt.allowance(user, C.CORE);

      if (allowance.lt(amount)) {
        setStatus("Approving USDT...");
        const txA = await usdt.approve(C.CORE, amount);
        setStatus(`Approve sent: ${txA.hash}`);
        await txA.wait();
        setStatus("Approve confirmed ✅");
      } else {
        setStatus("Allowance OK ✅");
      }

      setStatus("Buying / Upgrading...");
      const tx = await core.buyOrUpgrade(selectedPkg, sponsor, sideRight);
      setStatus(`Buy sent: ${tx.hash}`);
      await tx.wait();

      setStatus("Buy/Upgrade success ✅");
      await refresh();
    } catch (e) {
      const msg =
        e?.error?.message ||
        e?.data?.message ||
        e?.reason ||
        e?.message ||
        String(e);
      setStatus(`Buy failed: ${msg}`);
    }
  }

  // ===== Claim =====
  async function claimBonus() {
    try {
      if (!user) return;
      setStatus("Claiming bonus (Vault)...");
      const tx = await vault.claim();
      setStatus(`Claim sent: ${tx.hash}`);
      await tx.wait();
      setStatus("Claim Bonus success ✅");
      await refresh();
    } catch (e) {
      const msg = e?.error?.message || e?.data?.message || e?.message || String(e);
      setStatus(`Claim bonus failed: ${msg}`);
    }
  }

  async function claimStake() {
    try {
      if (!user) return;
      setStatus("Claiming stake (Staking)...");
      const tx = await staking.claimStake();
      setStatus(`Claim sent: ${tx.hash}`);
      await tx.wait();
      setStatus("Claim Stake success ✅");
      await refresh();
    } catch (e) {
      const msg = e?.error?.message || e?.data?.message || e?.message || String(e);
      setStatus(`Claim stake failed: ${msg}`);
    }
  }

  // ===== Dashboard refresh =====
  async function refresh() {
    try {
      if (!user || !core) return;

      const u = await core.users(user);
      const pkg = Number(u.pkg);   // 0..3
      const rank = Number(u.rank); // 0..3

      // pkg label
      const pkgLabel = (pkg >= 1 && pkg <= 3) ? PKG_LABEL_BY_ENUM[pkg] : "-";
      if ($("kpiPkg")) $("kpiPkg").textContent = pkgLabel;

      // rank label
      if ($("kpiRank")) $("kpiRank").textContent = (rank >= 0 && rank <= 3) ? RANK_LABEL[rank] : "-";

      // Vault earns
      const earns = await vault.earns(user);
      if ($("kpiClaimUSDT")) $("kpiClaimUSDT").textContent = fmtUnits(earns.claimUSDT, 18, 6);
      if ($("kpiClaimDF")) $("kpiClaimDF").textContent = fmtUnits(earns.claimDF, 18, 6);

      // Binary volumes
      try {
        const vols = await binary.volumesOf(user);
        if ($("kpiVolL")) $("kpiVolL").textContent = fmtUnits(vols.l, 18, 4);
        if ($("kpiVolR")) $("kpiVolR").textContent = fmtUnits(vols.r, 18, 4);
      } catch {
        if ($("kpiVolL")) $("kpiVolL").textContent = "-";
        if ($("kpiVolR")) $("kpiVolR").textContent = "-";
      }

      // Staking info
      const st = await staking.stakes(user);
      if ($("kpiPrincipal")) $("kpiPrincipal").textContent = fmtUnits(st.principal, 18, 6);

      const pending = await staking.pendingReward(user);
      if ($("kpiPending")) $("kpiPending").textContent = fmtUnits(pending, 18, 6);

      const end = Number(st.end);
      if (end > 0) {
        if ($("kpiStakeEnd")) $("kpiStakeEnd").textContent = new Date(end * 1000).toLocaleString();
        startCountdown(end);
      } else {
        if ($("kpiStakeEnd")) $("kpiStakeEnd").textContent = "-";
        if ($("kpiCountdown")) $("kpiCountdown").textContent = "-";
        stopCountdown();
      }

      setStatus("Refreshed ✅");
    } catch (e) {
      const msg = e?.message || String(e);
      setStatus(`Refresh error: ${msg}`);
    }
  }

  function stopCountdown() {
    if (countdownTimer) clearInterval(countdownTimer);
    countdownTimer = null;
  }

  function startCountdown(endSec) {
    stopCountdown();
    const tick = () => {
      const n = nowSec();
      let diff = endSec - n;

      if (diff <= 0) {
        if ($("kpiCountdown")) $("kpiCountdown").textContent = "Matured ✅";
        return;
      }

      const d = Math.floor(diff / 86400); diff -= d * 86400;
      const h = Math.floor(diff / 3600);  diff -= h * 3600;
      const m = Math.floor(diff / 60);    diff -= m * 60;
      const s = diff;

      if ($("kpiCountdown")) $("kpiCountdown").textContent = `${d}d ${h}h ${m}m ${s}s`;
    };
    tick();
    countdownTimer = setInterval(tick, 1000);
  }

  // ===== Bind UI =====
  function bindActions() {
    $("btnConnect")?.addEventListener("click", connect);
    $("btnBuy")?.addEventListener("click", approveAndBuy);
    $("btnClaimBonus")?.addEventListener("click", claimBonus);
    $("btnClaimStake")?.addEventListener("click", claimStake);
    $("btnRefresh")?.addEventListener("click", refresh);
  }

  // ===== Init =====
  function init() {
    readRefFromURL_orDefault();   // auto company sponsor + default Left
    bindSponsorInput();
    bindSideButtons();
    bindCompanyJoinButtons();
    bindCopyButtons();
    bindPkgButtons();
    bindActions();

    setContractsLine();
    setStatus("Ready. Connect wallet to start.");
    updateBuyButtonState();
  }

  window.addEventListener("load", init);
})();
