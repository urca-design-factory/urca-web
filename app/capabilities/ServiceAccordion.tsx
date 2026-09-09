"use client";

import { useState } from "react";
import styles from "./page.module.css";

type ServiceAccordionProps = {
  id: string;
  services: readonly (readonly [string, string])[];
};

export function ServiceAccordion({ id, services }: ServiceAccordionProps) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <ul className={styles.services}>
      {services.map(([service, description], index) => {
        const open = active === index;
        const panelId = `${id}-service-${index}`;
        return (
          <li className={`${styles.service} t-acc`} data-open={open} key={service}>
            <button
              className={styles.serviceTrigger}
              type="button"
              id={`${panelId}-trigger`}
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setActive(open ? null : index)}
            >
              <span className={styles.serviceNumber}>{String(index + 1).padStart(2, "0")}</span>
              <span className={styles.serviceName}>
                <span className={styles.serviceNameBase}>{service}</span>
                <em className={styles.serviceNameAlternate} aria-hidden="true">{service}</em>
              </span>
              <span className={styles.serviceMark} aria-hidden="true" />
            </button>
            <div className="t-acc-panel" id={panelId} aria-hidden={!open} inert={!open}>
              <div className="t-acc-panel-inner">
                <p className={styles.serviceDescription}>{description}</p>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
