// always render panel in DOM using hidden attribute rather than conditional
// rendering, so tests and screen readers can reference it when collapsed

"use client";

import { useState } from "react";
import styles from "./ProductRow.module.css";

export default function ProductRow({ product }) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = `product-panel-${product.sys.id}`;

  const imageUrl = product.fields.image?.fields?.file?.url
    ? `https:${product.fields.image.fields.file.url}`
    : null;

  return (
    <div className={styles.row}>
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{product.fields.name}</span>
        <span className={`${styles.chevron} ${isOpen ? styles.open : ""}`}>
          ▼
        </span>
      </button>

      <div
        id={panelId}
        role="region"
        aria-label={product.fields.name}
        className={styles.content}
        hidden={!isOpen}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt={product.fields.name}
            className={styles.icon}
          />
        )}
        <p className={styles.description}>{product.fields.description}</p>
      </div>
    </div>
  );
}
