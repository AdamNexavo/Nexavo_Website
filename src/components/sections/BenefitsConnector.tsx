import { useCallback, useLayoutEffect, useState } from "react";
import type { RefObject } from "react";

type Point = { x: number; y: number };

type ConnectorGeometry = {
  path: string;
  start: Point;
  end: Point;
  width: number;
  height: number;
};

function buildConnectorGeometry(
  container: DOMRect,
  dashboard: DOMRect,
  integrations: DOMRect,
): ConnectorGeometry {
  const start: Point = {
    x: dashboard.left - container.left + dashboard.width / 2,
    y: dashboard.bottom - container.top,
  };

  const end: Point = {
    x: integrations.right - container.left,
    y: integrations.top - container.top + integrations.height / 2,
  };

  const drop = Math.max(52, (end.y - start.y) * 0.38);
  const approach = Math.max(44, (start.x - end.x) * 0.22);
  const path = [
    `M ${start.x} ${start.y}`,
    `C ${start.x} ${start.y + drop}`,
    `${end.x + approach} ${end.y}`,
    `${end.x} ${end.y}`,
  ].join(" ");

  return {
    path,
    start,
    end,
    width: container.width,
    height: container.height,
  };
}

type BenefitsConnectorProps = {
  containerRef: RefObject<HTMLElement | null>;
  dashboardRef: RefObject<HTMLElement | null>;
  integrationsRef: RefObject<HTMLElement | null>;
};

export const BenefitsConnector = ({
  containerRef,
  dashboardRef,
  integrationsRef,
}: BenefitsConnectorProps) => {
  const [geometry, setGeometry] = useState<ConnectorGeometry | null>(null);

  const update = useCallback(() => {
    const container = containerRef.current;
    const dashboard = dashboardRef.current;
    const integrations = integrationsRef.current;

    if (!container || !dashboard || !integrations) {
      return false;
    }

    if (window.matchMedia("(min-width: 1024px)").matches === false) {
      setGeometry(null);
      return true;
    }

    setGeometry(
      buildConnectorGeometry(
        container.getBoundingClientRect(),
        dashboard.getBoundingClientRect(),
        integrations.getBoundingClientRect(),
      ),
    );
    return true;
  }, [containerRef, dashboardRef, integrationsRef]);

  useLayoutEffect(() => {
    let cancelled = false;
    let raf = 0;

    const tick = () => {
      if (cancelled) return;
      const ready = update();
      if (!ready) {
        raf = requestAnimationFrame(tick);
      }
    };

    tick();

    const observer = new ResizeObserver(() => update());
    const observeTargets = () => {
      [containerRef.current, dashboardRef.current, integrationsRef.current].forEach(
        (el) => {
          if (el) observer.observe(el);
        },
      );
    };

    observeTargets();
    const observeRetry = window.setInterval(observeTargets, 100);
    window.setTimeout(() => window.clearInterval(observeRetry), 500);

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [update, containerRef, dashboardRef, integrationsRef]);

  if (!geometry) return null;

  const { path, start, end, width, height } = geometry;

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[1] hidden overflow-visible lg:block"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
    >
      <defs>
        <linearGradient
          id="benefits-connector-gradient"
          gradientUnits="userSpaceOnUse"
          x1={start.x}
          y1={start.y}
          x2={end.x}
          y2={end.y}
        >
          <stop offset="0%" stopColor="#6a50ff" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#6a50ff" stopOpacity="0.35" />
        </linearGradient>
      </defs>

      <path
        d={path}
        fill="none"
        stroke="url(#benefits-connector-gradient)"
        strokeWidth={2}
        strokeDasharray="7 5"
        strokeLinecap="round"
      />

      <circle
        cx={start.x}
        cy={start.y}
        r={4}
        fill="white"
        stroke="#6a50ff"
        strokeWidth={2}
      />
      <circle
        cx={end.x}
        cy={end.y}
        r={4}
        fill="white"
        stroke="#6a50ff"
        strokeWidth={2}
      />
    </svg>
  );
};
