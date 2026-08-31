"use client";

import { useEffect, useState } from "react";

import { FactorySigil } from "@/components/FactorySigil";
import { FACTORY_SIGIL_STAGE_KEYS } from "@/components/factory-sigil-states";
import styles from "@/app/dev/factory-sigils/preview.module.css";

export function FactorySigilPreview() {
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveStage((current) => (current + 1) % FACTORY_SIGIL_STAGE_KEYS.length);
    }, 1800);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className={styles.preview}>
      <section className={styles.family} aria-labelledby="sigil-family-title">
        <h1 id="sigil-family-title">Factory Sigils</h1>
        <div className={styles.grid}>
          {FACTORY_SIGIL_STAGE_KEYS.map((stage, index) => (
            <figure className={styles.item} key={stage}>
              <FactorySigil stage={stage} />
              <figcaption>
                {String(index + 1).padStart(2, "0")} {stage}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className={styles.morph} aria-labelledby="sigil-morph-title">
        <h2 id="sigil-morph-title">Morph preview</h2>
        <FactorySigil stage={FACTORY_SIGIL_STAGE_KEYS[activeStage]} />
        <p>{FACTORY_SIGIL_STAGE_KEYS[activeStage]}</p>
      </section>
    </main>
  );
}
