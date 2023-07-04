import Dexie, { Table } from "dexie";
import { IReview } from "../interfaces";
import {} from "./db-interfaces";
import { ExportOptions, ImportOptions } from "dexie-export-import";
import "dexie-export-import";
import { StaticImportOptions } from "dexie-export-import/dist/import";
const version = 6;

declare module "dexie" {
  // Extend methods on db
  interface Dexie {
    export(options?: ExportOptions): Promise<Blob>;
    import(blob: Blob, options?: ImportOptions): Promise<void>;
  }
  interface DexieConstructor {
    import(blob: Blob, options?: StaticImportOptions): Promise<Dexie>;
  }
}

export class DBContext extends Dexie {
  reviews!: Table<IReview>;

  constructor() {
    super("lit-review-manager");
    this.version(version).stores({
      reviews: "++id, &title", // Primary key and unique index on title
    });
  }

  async export(options?: ExportOptions): Promise<Blob> {
    const blob = await super.export(options);
    return blob;
  }

  async import(blob: Blob, options?: ImportOptions): Promise<void> {
    await super.import(blob, options);
  }
}

export const db = new DBContext();
