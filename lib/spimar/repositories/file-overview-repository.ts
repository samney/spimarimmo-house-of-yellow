import "server-only";
import { SeamOverviewRepository } from "./overview-from-seams";
import { FileCmsRepository, FileCrmRepository } from "./file-admin-repository";

/* Development implementation of the overview contract (ADM-070).

   The metric arithmetic lives in `SeamOverviewRepository`, computed through
   the seams so the file and database consoles share ONE definition of every
   figure. This class only binds it to the file adapters. */

export class FileOverviewRepository extends SeamOverviewRepository {
  constructor(now?: () => Date) {
    super({ crm: new FileCrmRepository(), cms: new FileCmsRepository() }, now);
  }
}
