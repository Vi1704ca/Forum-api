#!/usr/bin/env -S node
import type { Contract as Start } from '../../snapshots/1c7679aa4bead6e737a654e9ad0477edcb8728620e7ed93bc981757458a28498/contract';
import startContract from '../../snapshots/1c7679aa4bead6e737a654e9ad0477edcb8728620e7ed93bc981757458a28498/contract.json' with { type: 'json' };
import type { Contract as End } from '../../snapshots/3908db6b1d5c82abdf9192143800d0dc99b194fd09f7e70e8448351962d5cd88/contract';
import endContract from '../../snapshots/3908db6b1d5c82abdf9192143800d0dc99b194fd09f7e70e8448351962d5cd88/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, fn } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.addColumn({
        schema: 'public',
        table: 'RefreshSession',
        column: col('createdAt', 'timestamptz(3)', {
          notNull: true,
          default: fn('now()'),
          codecRef: { codecId: 'pg/timestamptz-string@1', typeParams: { precision: 3 } },
        }),
      }),
      this.addColumn({
        schema: 'public',
        table: 'RefreshSession',
        column: col('updatedAt', 'timestamptz(3)', {
          notNull: true,
          default: fn('now()'),
          codecRef: { codecId: 'pg/timestamptz-string@1', typeParams: { precision: 3 } },
        }),
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
