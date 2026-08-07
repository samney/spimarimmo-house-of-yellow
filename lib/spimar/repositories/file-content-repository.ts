import "server-only";
import { SeamContentRepository } from "./seam-content-repository";
import { FileCmsRepository } from "./file-admin-repository";

/* Development implementation of `ContentRepository`.

   The R1→public mapping lives in `SeamContentRepository`, computed through
   the CMS seam so the file store and the database document store serve the
   public site identically. This class only binds it to the file adapter.

   It exists so the interface has more than one implementation. One
   implementation is a type; two is a seam. */

export class FileContentRepository extends SeamContentRepository {
  constructor() {
    super(new FileCmsRepository());
  }
}
