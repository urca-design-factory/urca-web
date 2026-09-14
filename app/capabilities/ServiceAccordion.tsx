import styles from "./page.module.css";

type ServiceAccordionProps = {
  id: string;
  services: readonly (readonly [string, string])[];
};

export function ServiceAccordion({ id, services }: ServiceAccordionProps) {
  return (
    <ul className={styles.services}>
      {services.map(([service, description], index) => {
        return (
          <li key={service}>
            <details className={styles.service} name={id}>
              <summary className={styles.serviceTrigger}>
                <span className={styles.serviceNumber}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.serviceName}>
                  <span className={styles.serviceNameBase}>{service}</span>
                  <em
                    className={styles.serviceNameAlternate}
                    aria-hidden="true"
                  >
                    {service}
                  </em>
                </span>
                <span className={styles.serviceMark} aria-hidden="true" />
              </summary>
              <p className={styles.serviceDescription}>{description}</p>
            </details>
          </li>
        );
      })}
    </ul>
  );
}
