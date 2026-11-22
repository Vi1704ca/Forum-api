#!/usr/bin/env -S node
import type { Contract as End } from '../../snapshots/1c7679aa4bead6e737a654e9ad0477edcb8728620e7ed93bc981757458a28498/contract';
import endContract from '../../snapshots/1c7679aa4bead6e737a654e9ad0477edcb8728620e7ed93bc981757458a28498/contract.json' with { type: 'json' };
import type { Contract as Start } from '../../snapshots/26cd6a7ed4b23dd803e4a9e3da727fb9b941d1372b5c792b79b88c742b97012e/contract';
import startContract from '../../snapshots/26cd6a7ed4b23dd803e4a9e3da727fb9b941d1372b5c792b79b88c742b97012e/contract.json' with { type: 'json' };
import { Migration, MigrationCLI, col, primaryKey } from '@prisma/orm-postgres/migration';

export default class M extends Migration<Start, End> {
  override readonly startContractJson = startContract;
  override readonly endContractJson = endContract;

  override get operations() {
    return [
      this.createTable({
        schema: 'public',
        table: 'RefreshSession',
        columns: [
          col('id', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('tokenHash', 'text', { notNull: true, codecRef: { codecId: 'pg/text@1' } }),
          col('userId', 'int4', { notNull: true, codecRef: { codecId: 'pg/int4@1' } }),
        ],
        constraints: [primaryKey(['id'])],
      }),
      this.addUnique({
        schema: 'public',
        table: 'RefreshSession',
        constraint: 'RefreshSession_tokenHash_key',
        columns: ['tokenHash'],
      }),
      this.createIndex({
        schema: 'public',
        table: 'RefreshSession',
        index: 'RefreshSession_userId_idx_a489d58a',
        columns: ['userId'],
      }),
      this.addForeignKey({
        schema: 'public',
        table: 'RefreshSession',
        foreignKey: {
          name: 'RefreshSession_userId_fkey',
          columns: ['userId'],
          references: { schema: 'public', table: 'User', columns: ['id'] },
          onDelete: 'cascade',
          onUpdate: 'cascade',
        },
      }),
    ];
  }
}

MigrationCLI.run(import.meta.url, M);
