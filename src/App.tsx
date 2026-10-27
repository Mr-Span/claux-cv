import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { flushSync } from "react-dom";
import { ClauxTrademark } from "./components/ClauxTrademark";
import { WorkSection } from "./components/WorkSection";
import { AboutSection } from "./components/AboutSection";
import { CaseStudyPage } from "./components/CaseStudyPage";
import { AtelierHero } from "./atelier/AtelierHero";
import type { AtelierZone } from "./atelier/AtelierScene";
import { profile } from "./content/portfolio";
import { pageMetadata } from "./content/pageMetadata";
import { WorkshopPage, WorkshopTeaser } from "./workshop/WorkshopPage";
import { appPath, sitePath } from "./sitePaths";

type HomeContext = { index: number; scrollY: number; zone: AtelierZone };

const PreviousVersion = lazy(async () => {
  await import("./legacy-base.css");
  await import("./previous.css");
  const module = await import("./versions/PreviousVersion");
  return { default: module.PreviousVersion };
});

export default function App({
  initialPath = "/",
  legacy = false,
}: {
  initialPath?: string;
  legacy?: boolean;
}) {
  const [path, setPath] = useState(initialPath.replace(/\/$/, "") || "/");
  const [zone, setZone] = useState<AtelierZone>("automation");
  const homeContext = useRef<HomeContext | null>(null);
  const navigationIndex = useRef(0);
  const main = useRef<HTMLElement>(null);
  const isHome = path === "/";
  const currentPath = useRef(path);
  currentPath.current = path;

  const showPath = useCallback(
    (nextPath: string, y: number, focus = true, hash?: string) => {
      const normalizedPath = nextPath.replace(/\/$/, "") || "/";
      const update = () => flushSync(() => setPath(normalizedPath));
      const restore = () =>
        requestAnimationFrame(() => {
          if (currentPath.current !== normalizedPath) return;
          window.scrollTo({ top: y, behavior: "instant" });
          if (hash)
            document
              .getElementById(hash)
              ?.scrollIntoView({ behavior: "instant" });
          history.replaceState(
            { ...history.state, scrollY: window.scrollY },
            "",
          );
          if (focus)
            (
              document.querySelector<HTMLElement>("[data-route-heading]") ??
              document.getElementById("case-title") ??
              main.current
            )?.focus({
              preventScroll: true,
            });
        });
      if (
        document.startViewTransition &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        const transition = document.startViewTransition(update);
        // Interrupted captures (rapid navigation or a hidden page) still navigate.
        // Each lifecycle promise may reject independently when a capture is skipped.
        void transition.ready.catch(() => undefined);
        void transition.finished.catch(() => undefined);
        void transition.updateCallbackDone.then(restore, restore);
      } else {
        update();
        restore();
      }
    },
    [],
  );

  const navigate = useCallback(
    (target: string) => {
      const [nextPath = "/", hash] = target.split("#");
      if (
        nextPath === "/" &&
        hash === "work" &&
        !isHome &&
        homeContext.current
      ) {
        history.go(homeContext.current.index - navigationIndex.current);
        return;
      }
      if (isHome) {
        homeContext.current = {
          index: navigationIndex.current,
          scrollY: window.scrollY,
          zone,
        };
      }
      history.replaceState(
        {
          ...history.state,
          scrollY: window.scrollY,
          index: navigationIndex.current,
          zone,
          origin: homeContext.current,
        },
        "",
      );
      const origin = nextPath === "/" ? null : homeContext.current;
      history.pushState(
        { scrollY: 0, index: ++navigationIndex.current, zone, origin },
        "",
        sitePath(target),
      );
      homeContext.current = origin;
      showPath(nextPath, 0, !hash, hash);
    },
    [isHome, showPath, zone],
  );

  useEffect(() => {
    history.scrollRestoration = "manual";
    navigationIndex.current = history.state?.index ?? 0;
    homeContext.current = history.state?.origin ?? null;
    if (history.state?.zone) setZone(history.state.zone);
    let scrollTimer: ReturnType<typeof setTimeout> | undefined;
    const rememberScroll = () => {
      clearTimeout(scrollTimer);
      const href = location.href;
      const index = history.state?.index;
      scrollTimer = setTimeout(() => {
        // A late scroll event must never overwrite a different history entry.
        if (location.href === href && history.state?.index === index)
          history.replaceState(
            { ...history.state, scrollY: window.scrollY },
            "",
          );
      }, 150);
    };
    const pop = (event: PopStateEvent) => {
      navigationIndex.current = event.state?.index ?? 0;
      const nextPath = appPath(location.pathname).replace(/\/$/, "") || "/";
      // Native fragment entries scroll themselves; enhanced entries restore their
      // saved position and keep the index used to return to the originating home.
      if (
        nextPath === currentPath.current &&
        location.hash &&
        event.state?.index === undefined
      )
        return;
      homeContext.current = event.state?.origin ?? null;
      if (event.state?.origin?.zone || event.state?.zone)
        setZone(event.state.origin?.zone ?? event.state.zone);
      showPath(
        appPath(location.pathname),
        event.state?.scrollY ?? 0,
        false,
        event.state?.scrollY === undefined
          ? location.hash.slice(1) || undefined
          : undefined,
      );
    };
    window.addEventListener("popstate", pop);
    window.addEventListener("scroll", rememberScroll, { passive: true });
    return () => {
      window.removeEventListener("popstate", pop);
      window.removeEventListener("scroll", rememberScroll);
      clearTimeout(scrollTimer);
      history.scrollRestoration = "auto";
    };
  }, [showPath]);

  useEffect(() => {
    const metadata = pageMetadata[path] ?? pageMetadata["/"];
    document.title = metadata.title;
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute("content", metadata.description);
  }, [path]);

  const follow = (event: MouseEvent<HTMLAnchorElement>, target: string) => {
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    if (isHome && target.startsWith("/#")) return;
    event.preventDefault();
    navigate(target);
  };

  if (legacy || path.startsWith("/previous"))
    return (
      <Suspense
        fallback={<p className="legacy-loading">Loading previous portfolio…</p>}
      >
        <PreviousVersion />
      </Suspense>
    );

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header portfolio-header">
        <a
          className="site-brand"
          href={sitePath("/")}
          onClick={(event) => follow(event, "/")}
          aria-label="CLAUX · Claudiu Șpan — home"
        >
          <ClauxTrademark />
          <span>Claudiu Șpan</span>
        </a>
        <nav aria-label="Main navigation">
          <a
            href={sitePath("/#work")}
            onClick={(event) => follow(event, "/#work")}
          >
            Work
          </a>
          <a
            href={sitePath("/workshop/")}
            aria-current={path === "/workshop" ? "page" : undefined}
            onClick={(event) => follow(event, "/workshop/")}
          >
            Workshop
          </a>
          <a
            href={sitePath("/#about")}
            onClick={(event) => follow(event, "/#about")}
          >
            About
          </a>
          <a
            href={sitePath("/#contact")}
            onClick={(event) => follow(event, "/#contact")}
          >
            Contact <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>
      <main id="main" ref={main} tabIndex={-1}>
        {isHome ? (
          <>
            <AtelierHero
              zone={zone}
              onZoneSelect={setZone}
              onNavigate={navigate}
            />
            <WorkSection onNavigate={navigate} />
            <WorkshopTeaser onNavigate={navigate} />
            <AboutSection />
          </>
        ) : path === "/workshop" ? (
          <WorkshopPage onNavigate={navigate} />
        ) : (
          <CaseStudyPage
            slug={path.startsWith("/work/") ? path.split("/")[2] : "missing"}
            onNavigate={navigate}
          />
        )}
      </main>
      <footer className="site-footer">
        <ClauxTrademark surface="cocoa" />
        <p>Made with care. Built to work.</p>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn ↗
        </a>
        <a href="https://github.com/Mr-Span" target="_blank" rel="noreferrer">
          GitHub ↗
        </a>
        <span>© {new Date().getFullYear()} Claudiu Șpan</span>
      </footer>
    </>
  );
}
